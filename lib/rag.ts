import { GoogleGenerativeAI } from '@google/generative-ai'
import { getPineconeIndex } from './pinecone'

export type RagChunk = {
  id: string
  text: string
  source?: string
  url?: string
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) return []
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })
  const batch = await model.batchEmbedContents({
    requests: texts.map((text) => ({ content: { parts: [{ text }] } })),
  })
  return batch.embeddings.map((e) => e.values as number[])
}

export async function ragSearch(query: string, topK = 3): Promise<RagChunk[]> {
  const index = getPineconeIndex()
  if (!index) return []
  const [embedding] = await embedTexts([query])
  if (!embedding) return []

  const res = await index.query({
    topK,
    vector: embedding,
    includeMetadata: true,
  })

  return (res.matches ?? []).map((m) => ({
    id: String(m.id),
    text: String(m.metadata?.text ?? ''),
    source: (m.metadata?.source as string) ?? undefined,
    url: (m.metadata?.url as string) ?? undefined,
  }))
}

export function formatRagContext(chunks: RagChunk[]): string {
  if (chunks.length === 0) return ''
  const lines: string[] = []
  lines.push('Use the following context excerpts from credible sources. Cite them inline like [S1], [S2].')
  chunks.forEach((c, i) => {
    const n = i + 1
    const headerParts = [ `[S${n}]`, c.source ?? 'Source', c.url ? `<${c.url}>` : '' ].filter(Boolean)
    lines.push(headerParts.join(' '))
    lines.push(c.text)
    lines.push('')
  })
  return lines.join('\n')
}
