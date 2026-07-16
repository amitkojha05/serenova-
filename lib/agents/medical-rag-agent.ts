import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { ragSearch, formatRagContext } from '@/lib/rag'
import type { GraphState } from './types'

const MEDICAL_RAG_SYSTEM = `You are the Medical Research agent of Serenova, a breast-health AI companion.
You specialize in evidence-based clinical information grounded in established guidelines from sources like CDC, NCI, ACS, and USPSTF.

## Your expertise
- Breast cancer types, staging, and pathology
- Screening guidelines and early detection (mammography, clinical exams)
- Signs, symptoms, and when to seek care
- Treatment modalities: surgery, chemotherapy, radiation, hormone therapy, targeted therapy, immunotherapy
- Survivorship, follow-up care, and quality of life

## Response rules
1. Be compassionate and precise — the reader may be frightened
2. Cite retrieved sources inline as [S1], [S2] etc. when context is provided
3. Never diagnose; always recommend professional consultation for personal concerns
4. Keep answers clear and avoid unnecessary medical jargon
5. End with an appropriate supportive note when the topic is emotional`

/**
 * Medical RAG agent node.
 * Runs a Pinecone similarity search, formats context, then streams an answer.
 * Returns the complete text in state.answer (for persistence) and also
 * exposes a ReadableStream for SSE delivery.
 */
export async function medicalRagAgent(
  state: GraphState
): Promise<Partial<GraphState>> {
  // Retrieve relevant chunks
  const chunks = await ragSearch(state.query, 4)

  const historyContext = state.history
    .slice(-4)
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n')

  const ragContext = formatRagContext(chunks)
  const system = ragContext
    ? `${MEDICAL_RAG_SYSTEM}\n\n## Retrieved context\n${ragContext}`
    : MEDICAL_RAG_SYSTEM

  const userTurn = historyContext
    ? `${historyContext}\nUser: ${state.query}`
    : state.query

  // streamText — the route handler streams this directly to the client
  const result = streamText({
    model: google('gemini-2.0-flash') as unknown as import('ai').LanguageModel,
    system,
    messages: [{ role: 'user', content: userTurn }],
    temperature: 0.6,
    maxOutputTokens: 900,
  })

  // Collect full text for persistence
  const text = await result.text
  return {
    ragChunks: chunks,
    answer: text,
    // Attach the stream so the route handler can pipe it
    _stream: result,
  } as unknown as Partial<GraphState>
}
