# Serenova — Implementation Document

**AR/VR breast-reconstruction visualization + RAG breast-health chatbot**

This document explains how the two research-driven features were implemented,
how they fit into the existing Next.js app, and how to run and extend them.
It is written to be read alongside the code.

---

## 1. System overview

Serenova is a Next.js 16 (App Router) + React 19 application. It already ships:

- A landing site, self-check guide, and resources pages
- Supabase auth with RLS-protected `conversations` / `messages` tables
- A Gemini-backed streaming chat API (`/api/chat`) with Zod validation and
  Upstash Redis rate limiting
- A desktop 3D reconstruction viewer (react-three-fiber + drei)

This work adds two capabilities on top of that base:

| Feature | What it does | Key files |
|---|---|---|
| **AR / VR mode** | Places the reconstruction model in the user's room (AR) or an immersive scene (VR) via WebXR | `components/regeneration/xr-viewer.tsx`, `reconstruction-mesh.tsx` |
| **Grounded RAG chatbot** | Answers grounded in cited excerpts from U.S. clinical sources | `scripts/knowledge-base.ts`, `scripts/rag-ingest.ts`, `lib/rag.ts`, `app/api/chat/route.ts` |

Both are **educational** features with explicit disclaimers, not diagnostic or
treatment-planning tools.

---

## 2. AR / VR reconstruction visualization

### 2.1 Research basis

The design mirrors how AR/VR is actually used in U.S. clinical practice for
breast surgery, so the app teaches an accurate mental model:

- **Commercial 3D/AR planning tools** (e.g. Crisalix, PROVOKE/VECTRA XT) build a
  3D body model from standard photos and let patient and surgeon preview
  different implant sizes and shapes from multiple angles. The documented
  benefits are better communication, expectation-setting, and reduced anxiety —
  **not** a guarantee of the surgical result.
- **Peer-reviewed work** (e.g. AR prototypes using HoloLens to project candidate
  implant shapes onto a patient; the *Breamy* mHealth AR prototype) shows
  individualized 3D previews can increase patient confidence versus generic 2D
  images.

We therefore present the AR/VR view as an *outcome-preview at true-to-life scale*
with a prominent "discuss actual outcomes with your surgeon" disclaimer, rather
than implying clinical precision.

### 2.2 Architecture

The original viewer duplicated its mesh-generation logic inline. That geometry
was extracted into a **shared component** so the desktop and XR viewers render
identical models:

```
reconstruction-mesh.tsx   ← procedural geometry + per-procedure profiles (shared)
        │
        ├── model-viewer.tsx   (desktop: OrbitControls, grid, overlays)
        └── xr-viewer.tsx      (WebXR: immersive-ar / immersive-vr)
```

**`reconstruction-mesh.tsx`** — Exports `ReconstructionMesh` and
`getProcedureProfile`. A 64×64 `SphereGeometry` is deformed per-vertex using a
profile (`width`, `height`, `depth`, `frontFlatten`, `backVolume`,
`verticalBias`) chosen by `procedureType` (`implant | diep | latissimus |
fat-grafting`). A `scale` prop lets the XR viewer render the mesh at anatomical
size.

**`xr-viewer.tsx`** — Uses `@react-three/xr`:

1. Creates a stable XR store: `createXRStore({ hand: false })`.
2. On mount, feature-detects support with
   `navigator.xr.isSessionSupported('immersive-ar' | 'immersive-vr')` and enables
   the matching launch buttons.
3. "View in AR" → `store.enterAR()`; "Enter VR" → `store.enterVR()`. An exit
   button ends the active session.
4. In an immersive session the world origin is the viewer's pose, so the model is
   placed at `[0, 1.3, -1.2]` (≈1.2 m ahead, chest height) and scaled to ≈12 cm
   base contour. A second non-immersive copy renders at the canvas origin as the
   2D fallback preview.

### 2.3 Integration

`app/regeneration/page.tsx` gained an **"AR / VR Mode"** tab. It reuses the
existing procedure selector and `ControlPanel` (color, wireframe, opacity) so the
same controls drive both the desktop and XR views. Selecting a procedure or color
updates both viewers through shared page state.

### 2.4 Device support & fallback

WebXR is browser/hardware dependent:

| Environment | Result |
|---|---|
| Chrome on Android (ARCore) | AR button enabled — model placed in the room |
| Meta Quest / other headsets | AR and/or VR enabled |
| Desktop / unsupported browser | Buttons disabled; the message explains where to open the page; the 2D preview still renders |

Detection is capability-based, so no device is assumed. Requires HTTPS (Vercel
provides this) — WebXR is blocked on insecure origins.

### 2.5 Extending toward true clinical-style previews

The current mesh is procedural. To move closer to Crisalix-style personalization:

1. Capture user photos → generate a body mesh (photogrammetry or a body-model
   estimator).
2. Replace `ReconstructionMesh` geometry with the reconstructed mesh and load
   manufacturer implant shape libraries as morph targets.
3. Add soft-tissue deformation (FEM or a learned deformation model) for realism.

The `procedureType` → profile indirection is the seam where such a model would
plug in.

---

## 3. RAG breast-health chatbot

### 3.1 Why RAG

The base chatbot relied only on a system prompt, which risks unsourced or stale
answers on a health topic. RAG (Retrieval-Augmented Generation) grounds each
answer in retrieved passages and lets the model **cite** them, which is the
appropriate bar for health information.

### 3.2 Knowledge base — U.S. sources

`scripts/knowledge-base.ts` is a curated corpus paraphrasing guidance from major
U.S. authorities, each entry linked to its primary source:

- **CDC** — what breast cancer is, risk factors, symptoms, prevention, screening
- **NCI (NIH)** — types, BRCA1/BRCA2 genetics, treatment overview, support
- **ACS** — screening guidelines, reconstruction options, survival context
- **USPSTF** — mammography screening recommendation (start at 40, biennial to 74)
- **FDA** — breast-implant safety information

Content is deliberately conservative and educational. Because public-health
guidance changes, the corpus should be reviewed against the live source pages
periodically.

### 3.3 Pipeline

```
knowledge-base.ts ──chunk──► embed (text-embedding-004) ──► Pinecone (dim 768)
                                                                   │
user message ──embed query──► Pinecone topK ──► formatRagContext ─┘
                                                       │
                                          prepend to system prompt
                                                       │
                                          Gemini streamText ──► cited answer
```

**Ingestion — `scripts/rag-ingest.ts`** (`npm run rag:ingest`):

- Splits long entries into ≤900-char overlapping chunks (150-char overlap) on
  sentence boundaries so retrieval returns focused passages.
- Embeds in batches of 20 with Google `text-embedding-004`.
- Upserts to Pinecone with `{ text, source, url }` metadata.

**Retrieval — `lib/rag.ts`** (unchanged interface): embeds the query, runs
`index.query({ topK, includeMetadata })`, and `formatRagContext` renders the
chunks as `[S1] Source <url>` blocks with an instruction to cite inline.

**Answer — `app/api/chat/route.ts`**: when `useRag` is true, it takes the latest
user message, retrieves the top 3 chunks, and prepends them to the system prompt
before `streamText`. The RAG path is additive — the existing auth, rate limiting,
Zod validation, and message persistence are unchanged.

### 3.4 UI

`useRag` is wired through the client so users control grounding:

- `chat-container.tsx` — holds `useRag` state (default **on**) and passes it in
  the request body.
- `chat-input.tsx` — a **"Grounded answers: on/off"** toggle chip above the input.

The API already accepted `useRag` (validated by `chatRequestSchema`); this exposes
it to the user.

### 3.5 Important detail: embedding dimension

`text-embedding-004` outputs **768-dim** vectors. The Pinecone index **must** be
created with dimension 768 and a cosine metric, or `upsert`/`query` will fail.

---

## 4. Configuration

Add to `.env.local` and Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=            # optional (admin tasks)
GOOGLE_GENERATIVE_AI_API_KEY=         # Gemini chat + embeddings
PINECONE_API_KEY=
PINECONE_INDEX=                       # index must be dimension 768, cosine
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
ADMIN_EMAILS=                         # comma-separated
```

---

## 5. Run & verify

```bash
npm install
npm run dev            # http://localhost:3000

# Seed the RAG knowledge base (needs Pinecone + Google keys)
npm run rag:ingest

npm run build          # production build
npm run lint
```

**Manual verification**

- **AR/VR:** open `/regeneration` → "AR / VR Mode". On desktop the buttons are
  disabled with an explanatory message and the 2D preview renders. On Chrome for
  Android over HTTPS, "View in AR" places the model in your room.
- **RAG:** open `/chat`, keep "Grounded answers: on", ask e.g. *"When should I
  start mammograms?"* — the answer should reflect the USPSTF/ACS guidance and
  include inline `[S1]`-style citations. Toggle grounding off to compare.

---

## 6. New / changed files

| File | Change |
|---|---|
| `components/regeneration/reconstruction-mesh.tsx` | **New** — shared procedural mesh + profiles |
| `components/regeneration/xr-viewer.tsx` | **New** — WebXR AR/VR viewer |
| `components/regeneration/model-viewer.tsx` | Refactored to import the shared mesh |
| `app/regeneration/page.tsx` | Added "AR / VR Mode" tab |
| `scripts/knowledge-base.ts` | **New** — curated U.S.-source corpus |
| `scripts/rag-ingest.ts` | Rewritten — chunk + batch-embed + upsert the corpus |
| `components/chat/chat-container.tsx` | Added `useRag` state, passed to API |
| `components/chat/chat-input.tsx` | Added grounded-answers toggle |
| `package.json` | Added `@react-three/xr` |

---

## 7. Safety & scope

- All features are **educational**. The chatbot's system prompt already forbids
  diagnosis and requires "consult a healthcare professional" disclaimers; RAG
  grounding reinforces this with cited sources.
- AR/VR previews are approximations and carry an explicit "discuss actual
  outcomes with your surgeon" notice.
- Health guidance evolves — treat the knowledge base as a living document and
  re-verify against primary sources before relying on it.
