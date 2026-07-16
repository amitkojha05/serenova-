import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import type { GraphState, Intent, RouterOutput } from './types'

/**
 * Router node.
 * Uses a fast Gemini Flash call to classify the user query into one of five
 * intents, then maps that intent to the specialist agent. Falls back to
 * medical-rag on any parse failure.
 */

const CLINICAL_KEYWORDS = [
  'symptom', 'sign', 'mammogram', 'screening', 'biopsy', 'diagnosis', 'stage',
  'treatment', 'chemotherapy', 'radiation', 'surgery', 'hormone', 'her2', 'brca',
  'lump', 'nipple', 'discharge', 'metastasis', 'survival', 'prognosis', 'cancer type',
  'ductal', 'lobular', 'inflammatory', 'triple negative',
]
const RECONSTRUCTION_KEYWORDS = [
  'reconstruction', 'implant', 'diep', 'flap', 'latissimus', 'fat graft',
  'mastectomy', 'augmentation', 'silicone', 'saline', 'expander', 'ar', 'vr',
  '3d', 'visuali', 'procedure', 'aesthetic', 'outcome', 'before surgery',
]
const RISK_KEYWORDS = [
  'risk', 'chance', 'probability', 'likely', 'family history', 'genetic', 'brca',
  'mutation', 'age', 'alcohol', 'weight', 'lifestyle', 'prevent', 'how likely',
  'am i at risk', 'my risk',
]
const IMAGE_KEYWORDS = [
  'image', 'photo', 'picture', 'look at', 'see', 'scan', 'mri', 'ultrasound',
  'mammography image', 'analyze',
]
const EMOTIONAL_KEYWORDS = [
  'scared', 'afraid', 'anxious', 'fear', 'worry', 'cope', 'feel', 'support',
  'sad', 'stress', 'alone', 'hope', 'family', 'told me i have', 'just diagnosed',
]

function keywordIntent(query: string): { intent: Intent; confidence: number } | null {
  const q = query.toLowerCase()
  const score = (kws: string[]) => kws.filter((k) => q.includes(k)).length

  const scores: [Intent, number][] = [
    ['clinical', score(CLINICAL_KEYWORDS)],
    ['reconstruction', score(RECONSTRUCTION_KEYWORDS)],
    ['risk', score(RISK_KEYWORDS)],
    ['image', score(IMAGE_KEYWORDS)],
    ['emotional', score(EMOTIONAL_KEYWORDS)],
  ]
  scores.sort((a, b) => b[1] - a[1])
  const [top, second] = scores
  if (top[1] === 0) return null
  const confidence = Math.min(0.95, 0.5 + (top[1] - (second?.[1] ?? 0)) * 0.1)
  return { intent: top[0], confidence }
}

function intentToAgent(intent: Intent): RouterOutput['agentId'] {
  switch (intent) {
    case 'clinical': return 'medical-rag'
    case 'reconstruction': return '3d-orchestration'
    case 'risk': return 'risk-assessment'
    case 'image': return 'vision'
    case 'emotional': return 'medical-rag'
    default: return 'medical-rag'
  }
}

export async function routerNode(
  state: GraphState
): Promise<Partial<GraphState>> {
  // Fast path: keyword scoring (no LLM call needed for clear cases)
  const fast = keywordIntent(state.query)
  if (fast && fast.confidence >= 0.65) {
    return {
      selectedAgent: intentToAgent(fast.intent),
    }
  }

  // Slow path: use Gemini Flash for ambiguous cases
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    return { selectedAgent: intentToAgent(fast?.intent ?? 'general') }
  }

  try {
    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.0-flash',
      apiKey,
      maxOutputTokens: 60,
      temperature: 0,
    })

    const prompt = `You are a router for a breast-health AI. Classify this message into exactly one intent.
Intents: clinical | reconstruction | risk | image | emotional | general
Reply with ONLY the intent word.

Message: """${state.query.slice(0, 400)}"""`

    const response = await model.invoke([{ type: 'human', content: prompt }])
    const raw = String(response.content).trim().toLowerCase().split(/\s+/)[0]
    const validIntents: Intent[] = [
      'clinical', 'reconstruction', 'risk', 'image', 'emotional', 'general',
    ]
    const intent: Intent = validIntents.includes(raw as Intent)
      ? (raw as Intent)
      : 'clinical'

    return { selectedAgent: intentToAgent(intent) }
  } catch {
    return { selectedAgent: intentToAgent(fast?.intent ?? 'clinical') }
  }
}
