import { Pinecone } from '@pinecone-database/pinecone'

export function getPineconeClient() {
  const apiKey = process.env.PINECONE_API_KEY
  if (!apiKey) return null
  return new Pinecone({ apiKey })
}

export function getPineconeIndex() {
  const indexName = process.env.PINECONE_INDEX
  const client = getPineconeClient()
  if (!client || !indexName) return null
  return client.Index(indexName)
}
