import { StateGraph, Annotation, START, END } from '@langchain/langgraph'
import { routerNode } from './router'
import { medicalRagAgent } from './medical-rag-agent'
import { visionAgent } from './vision-agent'
import { riskAssessmentAgent } from './risk-assessment-agent'
import { orchestrationAgent } from './orchestration-agent'
import type { GraphState, AgentId, ViewerCommand } from './types'

// ── State annotation ──────────────────────────────────────────────────────

const AgentState = Annotation.Root({
  query: Annotation<string>({ reducer: (_, v) => v, default: () => '' }),
  history: Annotation<GraphState['history']>({
    reducer: (_, v) => v,
    default: () => [],
  }),
  selectedAgent: Annotation<AgentId>({
    reducer: (_, v) => v,
    default: () => 'medical-rag',
  }),
  ragChunks: Annotation<GraphState['ragChunks']>({
    reducer: (_, v) => v,
    default: () => [],
  }),
  riskScore: Annotation<number | null>({
    reducer: (_, v) => v,
    default: () => null,
  }),
  viewerCommand: Annotation<ViewerCommand | null>({
    reducer: (_, v) => v,
    default: () => null,
  }),
  answer: Annotation<string>({ reducer: (_, v) => v, default: () => '' }),
  hasImage: Annotation<boolean>({ reducer: (_, v) => v, default: () => false }),
})

// ── Build & compile ───────────────────────────────────────────────────────
// Note: LangGraph 1.4 types use strict node-name inference that chokes on
// hyphenated names. Runtime is correct; we cast to bypass.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyGraph = any

export function buildAgentGraph() {
  const graph: AnyGraph = new StateGraph(AgentState)

  graph.addNode('router', routerNode)
  graph.addNode('medical-rag', medicalRagAgent)
  graph.addNode('vision', visionAgent)
  graph.addNode('risk-assessment', riskAssessmentAgent)
  graph.addNode('3d-orchestration', orchestrationAgent)

  graph.addEdge(START, 'router')

  graph.addConditionalEdges('router', (s: typeof AgentState.State) => s.selectedAgent, {
    'medical-rag': 'medical-rag',
    vision: 'vision',
    'risk-assessment': 'risk-assessment',
    '3d-orchestration': '3d-orchestration',
  })

  graph.addEdge('medical-rag', END)
  graph.addEdge('vision', END)
  graph.addEdge('risk-assessment', END)
  graph.addEdge('3d-orchestration', END)

  return graph.compile()
}

// ── Public invoke helper ──────────────────────────────────────────────────

export interface AgentRunResult {
  agentId: AgentId
  answer: string
  ragChunks: GraphState['ragChunks']
  riskScore: number | null
  viewerCommand: ViewerCommand | null
}

export async function runAgentGraph(
  query: string,
  history: GraphState['history'],
  hasImage = false
): Promise<AgentRunResult> {
  const compiled = buildAgentGraph()

  const finalState: typeof AgentState.State = await compiled.invoke({
    query,
    history,
    hasImage,
  })

  return {
    agentId: finalState.selectedAgent,
    answer: finalState.answer,
    ragChunks: finalState.ragChunks ?? [],
    riskScore: finalState.riskScore ?? null,
    viewerCommand: finalState.viewerCommand ?? null,
  }
}
