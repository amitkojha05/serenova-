import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { ragSearch } from '@/lib/rag'
import type { GraphState } from './types'

const RISK_SYSTEM = `You are the Risk Assessment agent of Serenova.
You help women understand their individual breast-cancer risk factors and provide
evidence-based, personalised guidance on what they might discuss with their clinician.

## What you know
- Non-modifiable factors: age, sex, dense breast tissue, BRCA1/BRCA2 & other genetic variants,
  family and personal history, reproductive history (age of first period, menopause, first birth),
  prior radiation to chest
- Modifiable factors: alcohol consumption, physical activity, body weight especially post-menopause,
  use of hormone therapy (combined HRT), reproductive choices (breastfeeding lowers risk modestly)
- Validated risk models: Tyrer-Cuzick, Gail Model, BOADICEA — you can explain what they are without
  running them (those require clinical input)
- High-risk pathways: genetic counselling for BRCA, enhanced surveillance (annual MRI + mammogram),
  chemoprevention options, risk-reducing surgery

## How to respond
1. Identify the risk factors mentioned or implied in the message
2. Briefly explain the evidence-level (strong, moderate, weak) for each
3. Produce an informal qualitative summary: "Based on what you've shared, the factors
   that most deserve a conversation with your doctor are…"
4. Recommend appropriate next steps (GP referral, genetic counselling, lifestyle changes)
5. NEVER give a numeric probability without a validated model and clinical supervision
6. ALWAYS note that risk scores are population averages — individual context matters

Retrieved clinical context from guidelines will appear below — cite it as [S1], [S2] etc.`

/**
 * Risk Assessment agent — pulls relevant RAG context on risk, then streams
 * a structured risk-factor summary with evidence levels.
 */
export async function riskAssessmentAgent(
  state: GraphState
): Promise<Partial<GraphState>> {
  const chunks = await ragSearch(`breast cancer risk factors ${state.query}`, 4)

  const ragLines = chunks.length
    ? chunks
        .map((c, i) => `[S${i + 1}] ${c.source}: ${c.text}`)
        .join('\n\n')
    : ''

  const system = ragLines
    ? `${RISK_SYSTEM}\n\n## Clinical guideline excerpts\n${ragLines}`
    : RISK_SYSTEM

  const historyContext = state.history
    .slice(-4)
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n')

  const userTurn = historyContext
    ? `${historyContext}\nUser: ${state.query}`
    : state.query

  const result = streamText({
    model: google('gemini-2.0-flash') as unknown as import('ai').LanguageModel,
    system,
    messages: [{ role: 'user', content: userTurn }],
    temperature: 0.5,
    maxOutputTokens: 1000,
  })

  const text = await result.text

  // Derive a rough qualitative risk score to store in state
  const riskKeywords = ['brca', 'family history', 'dense', 'hormone therapy', 'alcohol', 'radiation']
  const matchCount = riskKeywords.filter((k) =>
    state.query.toLowerCase().includes(k)
  ).length
  const riskScore = Math.min(1, 0.2 + matchCount * 0.13)

  return {
    ragChunks: chunks,
    riskScore,
    answer: text,
    _stream: result,
  } as unknown as Partial<GraphState>
}
