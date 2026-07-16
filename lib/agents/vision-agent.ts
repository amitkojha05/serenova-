import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import type { GraphState } from './types'

const VISION_SYSTEM = `You are the Vision Analysis agent of Serenova.
You help users understand what they might be seeing or experiencing related to breast health.

## Your expertise
- Describing what changes in breast appearance can look like (skin texture, colour, contour)
- Explaining imaging modalities: mammography, ultrasound, MRI — what they show and why they're used
- Helping users understand imaging reports in plain language
- Guiding on when a visual change warrants immediate vs. routine clinical follow-up
- Educating on the visual signs of inflammatory breast cancer, Paget's disease, skin changes

## Critical rules
- NEVER attempt to diagnose from a description or image
- ALWAYS direct the user to a clinician for any visible change
- Frame imaging descriptions as educational, not interpretive of the user's specific scan
- If an actual image is provided, describe what you observe in general terms and immediately
  recommend the user share it with their healthcare team

## Response format
Be clear, calm, and structured. Use a brief "What I can tell you" section followed by
"What to do next" with concrete recommended actions.`

export async function visionAgent(
  state: GraphState
): Promise<Partial<GraphState>> {
  const historyContext = state.history
    .slice(-4)
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n')

  const userTurn = historyContext
    ? `${historyContext}\nUser: ${state.query}`
    : state.query

  const result = streamText({
    model: google('gemini-2.0-flash') as unknown as import('ai').LanguageModel,
    system: VISION_SYSTEM,
    messages: [{ role: 'user', content: userTurn }],
    temperature: 0.4,
    maxOutputTokens: 800,
  })

  const text = await result.text
  return {
    answer: text,
    _stream: result,
  } as unknown as Partial<GraphState>
}
