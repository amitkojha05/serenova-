import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import type { GraphState, ViewerCommand } from './types'

const ORCHESTRATION_SYSTEM = `You are the 3D Visualization & Reconstruction agent of Serenova.
You specialize in breast reconstruction options, surgical planning, and how AR/VR technology
is used in modern breast surgery consultation.

## Your expertise
- Implant-based reconstruction: silicone vs. saline, shaped vs. round, tissue expanders
  Recovery: 4–6 weeks. Best for: thinner body frames, faster recovery preference.
- DIEP flap: deep inferior epigastric perforator — abdominal skin/fat, no muscle sacrifice
  Recovery: 6–8 weeks. Best for: natural feel, adequate abdominal tissue, active patients.
- Latissimus dorsi flap: upper-back muscle/skin, often combined with implant
  Recovery: 4–6 weeks. Best for: smaller reconstruction, prior radiation damage.
- Fat grafting / lipofilling: autologous fat from thighs/abdomen, minimal scarring
  Recovery: 2–4 weeks. Best for: minor volume correction, contour refinement.
- Immediate vs. delayed reconstruction: timing decisions and their trade-offs
- AR/VR in surgical planning: how 3D simulations improve patient–surgeon communication
  and help set realistic expectations (Crisalix, VECTRA XT context)

## How to respond
1. Explain the procedure(s) relevant to the question clearly
2. Include realistic recovery timelines, pros/cons, and ideal candidate profiles
3. Describe how a 3D/AR preview can help — and what it can and cannot promise
4. End with a JSON viewer command between <viewer> </viewer> tags so the UI can
   update the 3D model automatically. Use this EXACT format:

<viewer>{"procedure":"implant","wireframe":false,"color":"#ec4899","highlight":"Silicone implant placement"}</viewer>

Valid procedure values: implant | diep | latissimus | fat-grafting
Valid colors: #ec4899 (pink), #60a5fa (blue), #34d399 (green), #f59e0b (amber)

5. Always note that 3D previews are educational approximations — actual results depend on
   many individual factors discussed with a plastic surgeon.`

function extractViewerCommand(text: string): ViewerCommand | null {
  const match = text.match(/<viewer>([\s\S]*?)<\/viewer>/)
  if (!match) return null
  try {
    const raw = JSON.parse(match[1].trim())
    const validProcedures = ['implant', 'diep', 'latissimus', 'fat-grafting'] as const
    if (!validProcedures.includes(raw.procedure)) return null
    return {
      procedure: raw.procedure,
      wireframe: Boolean(raw.wireframe),
      color: typeof raw.color === 'string' ? raw.color : '#ec4899',
      highlight: typeof raw.highlight === 'string' ? raw.highlight : undefined,
    }
  } catch {
    return null
  }
}

export async function orchestrationAgent(
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
    system: ORCHESTRATION_SYSTEM,
    messages: [{ role: 'user', content: userTurn }],
    temperature: 0.6,
    maxOutputTokens: 1000,
  })

  const text = await result.text
  const viewerCommand = extractViewerCommand(text)

  // Strip the <viewer>...</viewer> block from the displayed answer
  const cleanAnswer = text.replace(/<viewer>[\s\S]*?<\/viewer>/g, '').trim()

  return {
    viewerCommand,
    answer: cleanAnswer,
    _stream: result,
    _cleanAnswer: cleanAnswer,
  } as unknown as Partial<GraphState>
}
