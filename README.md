# Serenova

**Breast health education, reconstruction visualization, and a source-grounded AI assistant, built for people navigating breast cancer and recovery.**

🔗 **Live demo:** [serenova-sage.vercel.app](https://serenova-sage.vercel.app)

> ⚠️ **Disclaimer:** Serenova is an educational tool. It does not diagnose, recommend treatment, or replace advice from a qualified healthcare professional. AR/VR previews are approximations, not predictions of surgical results.

---

## Features

### 🩺 Breast health resources
- Landing site, self-check guide, and curated resources pages
- Clear, supportive, educational content

### 🧬 Reconstruction visualization (`/regeneration`)
- Interactive 3D viewer (react-three-fiber + drei) with orbit controls
- Procedure types: **implant**, **DIEP**, **latissimus**, **fat grafting**
- Controls for color, wireframe, and opacity
- **AR / VR mode** via WebXR: place the model in your room (AR) or view it in an immersive scene (VR)
- Capability-based detection with a 2D fallback on unsupported devices

### 💬 Grounded breast-health chatbot (`/chat`)
- Streaming chat powered by Google Gemini
- **RAG (Retrieval-Augmented Generation):** answers are grounded in cited excerpts from CDC, NCI, ACS, USPSTF, and FDA guidance
- Inline `[S1]`-style citations with source links
- "Grounded answers" toggle so users can compare with and without retrieval
- Supabase auth, per-user conversation history, and Upstash Redis rate limiting

---

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS, shadcn/ui |
| 3D / XR | react-three-fiber, drei, `@react-three/xr` |
| Auth & DB | Supabase (Auth + Postgres with RLS) |
| AI | Google Gemini (chat + `text-embedding-004`), Vercel AI SDK |
| Vector search | Pinecone (768-dim, cosine) |
| Validation & limits | Zod, Upstash Redis |
| Hosting | Vercel |

---

## Architecture

```
knowledge-base.ts ──chunk──► embed (text-embedding-004) ──► Pinecone (dim 768)
                                                                   │
user message ──embed query──► Pinecone topK ──► formatRagContext ─┘
                                                       │
                                          prepend to system prompt
                                                       │
                                          Gemini streamText ──► cited answer
```

```
reconstruction-mesh.tsx   ← procedural geometry + per-procedure profiles (shared)
        │
        ├── model-viewer.tsx   (desktop: OrbitControls, overlays)
        └── xr-viewer.tsx      (WebXR: immersive-ar / immersive-vr)
```

For the full design, see [IMPLEMENTATION.md](./IMPLEMENTATION.md).

---

## Getting started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key
- A [Pinecone](https://www.pinecone.io) index with **dimension 768** and **cosine** metric
- An [Upstash Redis](https://upstash.com) database

### 1. Clone and install

```bash
git clone https://github.com/amitkojha05/serenova-.git
cd serenova-
npm install
```

### 2. Configure environment

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # optional, admin tasks
GOOGLE_GENERATIVE_AI_API_KEY=     # Gemini chat + embeddings
PINECONE_API_KEY=
PINECONE_INDEX=                   # dimension 768, cosine
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
ADMIN_EMAILS=                     # comma-separated
```

### 3. Set up the database

Apply the schema in [`supabase/`](./supabase) to create the RLS-protected `conversations` and `messages` tables.

### 4. Seed the knowledge base

```bash
npm run rag:ingest
```

### 5. Run

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

---

## Trying the features

- **RAG chat:** open `/chat`, keep "Grounded answers: on", and ask *"When should I start mammograms?"*. The answer should reflect USPSTF/ACS guidance with inline citations. Toggle grounding off to compare.
- **AR / VR:** open `/regeneration` → **AR / VR Mode**.
  - Chrome on Android (ARCore) over HTTPS: "View in AR" places the model in your room.
  - Meta Quest and other headsets: AR and/or VR buttons are enabled.
  - Desktop: buttons are disabled with an explanation; the 2D preview still renders.

WebXR requires HTTPS. Vercel provides this automatically.

---

## Project structure

```
app/          Next.js routes and API handlers (/chat, /regeneration, /api/chat)
components/   UI, chat, and regeneration (3D / XR) components
hooks/        Custom React hooks
lib/          RAG retrieval, Supabase clients, rate limiting, helpers
scripts/      Knowledge base corpus and RAG ingestion
supabase/     Database schema and policies
types/        Shared TypeScript types
public/       Static assets
```

---

## Knowledge base sources

The curated corpus paraphrases guidance from:

- **CDC:** overview, risk factors, symptoms, screening
- **NCI (NIH):** types, BRCA1/BRCA2 genetics, treatment overview
- **ACS:** screening guidelines, reconstruction options
- **USPSTF:** mammography screening recommendations
- **FDA:** breast implant safety information

Health guidance changes over time. Review the corpus against the live source pages periodically.

---

## Roadmap

- Photo-based personalized 3D body meshes (replacing the procedural mesh)
- Manufacturer implant shape libraries as morph targets
- Soft-tissue deformation for more realistic previews
- Expanded and regularly refreshed knowledge base

---

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you'd like to change.

## License

Released under the [MIT License](./LICENSE).
