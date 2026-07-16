# Backend Setup

## Environment Variables

Add these to `.env.local` and Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional for admin/system tasks)
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `PINECONE_API_KEY`
- `PINECONE_INDEX`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `ADMIN_EMAILS` (comma-separated admin emails)

## Installed Backend Features

- Supabase auth + user-scoped persistence
- RLS-protected `conversations` and `messages`
- Chat API request validation with Zod
- Conversation update/delete request validation with Zod
- Upstash Redis rate limiting on chat and conversation write endpoints
- Optional RAG query mode with Pinecone + Gemini embeddings

## Commands

- Install dependencies:
  - `npm install`
- Run dev server:
  - `npm run dev`
- Lint:
  - `npm run lint`
- Seed Pinecone demo data:
  - `npm run rag:ingest`

## RAG Use

The chat API supports optional `useRag` in request body:

```json
{
  "messages": [...],
  "conversationId": "uuid-optional",
  "useRag": true
}
```

If `useRag` is false or omitted, the chatbot runs on the default system prompt only.

## AR/VR and RAG (see IMPLEMENTATION.md for full details)

- AR/VR reconstruction viewer: `/regeneration` → "AR / VR Mode" tab. Uses
  WebXR via `@react-three/xr`. Requires HTTPS and an AR/VR-capable device
  (Chrome on Android, or a headset like Meta Quest). Desktop shows a 2D
  fallback preview.
- Grounded RAG chatbot: a "Grounded answers" toggle in the chat input controls
  whether responses are grounded in cited U.S.-source excerpts (CDC, NCI, ACS,
  USPSTF, FDA). Seed the knowledge base with `npm run rag:ingest`.
- The Pinecone index must be created with **dimension 768** (cosine) to match
  Google `text-embedding-004`.
