/* eslint-disable no-console */
import { embedTexts } from '../lib/rag'
import { getPineconeIndex } from '../lib/pinecone'
import { KNOWLEDGE_BASE, type SourceDoc } from './knowledge-base'

/**
 * Ingests the curated U.S.-source breast-health knowledge base into
 * Pinecone. Longer entries are split into overlapping chunks so retrieval
 * returns focused, citable passages.
 *
 * Run with: npm run rag:ingest
 * Requires: PINECONE_API_KEY, PINECONE_INDEX, GOOGLE_GENERATIVE_AI_API_KEY
 *
 * NOTE: the Pinecone index must be created with dimension 768 to match
 * Google's text-embedding-004 model.
 */

const MAX_CHARS = 900
const OVERLAP = 150

function chunkDoc(doc: SourceDoc): SourceDoc[] {
  if (doc.text.length <= MAX_CHARS) return [doc]

  const chunks: SourceDoc[] = []
  const sentences = doc.text.match(/[^.!?]+[.!?]+|\S+$/g) ?? [doc.text]
  let buffer = ''
  let part = 0

  const flush = () => {
    if (!buffer.trim()) return
    chunks.push({
      id: `${doc.id}-${part}`,
      text: buffer.trim(),
      source: doc.source,
      url: doc.url,
    })
    part += 1
  }

  for (const sentence of sentences) {
    if ((buffer + sentence).length > MAX_CHARS && buffer) {
      flush()
      buffer = buffer.slice(-OVERLAP) + sentence
    } else {
      buffer += sentence
    }
  }
  flush()
  return chunks
}

async function main() {
  const index = getPineconeIndex()
  if (!index) {
    throw new Error(
      'Pinecone is not configured. Set PINECONE_API_KEY and PINECONE_INDEX.'
    )
  }

  const chunks = KNOWLEDGE_BASE.flatMap(chunkDoc)
  console.log(`Prepared ${chunks.length} chunks from ${KNOWLEDGE_BASE.length} source documents.`)

  const BATCH = 20
  const vectors: {
    id: string
    values: number[]
    metadata: Record<string, string>
  }[] = []

  for (let i = 0; i < chunks.length; i += BATCH) {
    const slice = chunks.slice(i, i + BATCH)
    const embeddings = await embedTexts(slice.map((c) => c.text))
    if (embeddings.length !== slice.length) {
      throw new Error('Embedding count mismatch — check GOOGLE_GENERATIVE_AI_API_KEY.')
    }
    slice.forEach((chunk, j) => {
      vectors.push({
        id: chunk.id,
        values: embeddings[j],
        metadata: { text: chunk.text, source: chunk.source, url: chunk.url },
      })
    })
    console.log(`Embedded ${Math.min(i + BATCH, chunks.length)}/${chunks.length}`)
  }

  for (let i = 0; i < vectors.length; i += 100) {
    await index.upsert(vectors.slice(i, i + 100))
  }

  console.log(`Upserted ${vectors.length} vectors into Pinecone. Done.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
