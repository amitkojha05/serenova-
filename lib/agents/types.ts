// ── Shared types across all agents ──────────────────────────────────────────

export type AgentId =
  | 'medical-rag'
  | 'vision'
  | 'risk-assessment'
  | '3d-orchestration'
  | 'router'

export interface AgentMeta {
  id: AgentId
  label: string
  icon: string          // emoji — rendered in the chat badge
  color: string         // tailwind class for badge background
}

export const AGENT_META: Record<AgentId, AgentMeta> = {
  'medical-rag': {
    id: 'medical-rag',
    label: 'Medical Research',
    icon: '🔬',
    color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  vision: {
    id: 'vision',
    label: 'Image Analysis',
    icon: '👁',
    color: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  },
  'risk-assessment': {
    id: 'risk-assessment',
    label: 'Risk Assessment',
    icon: '📊',
    color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  '3d-orchestration': {
    id: '3d-orchestration',
    label: '3D Visualization',
    icon: '🫀',
    color: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  },
  router: {
    id: 'router',
    label: 'Router',
    icon: '🧭',
    color: 'bg-muted text-muted-foreground border-border',
  },
}

// LangGraph state passed between nodes
export interface GraphState {
  /** Raw user query */
  query: string
  /** Conversation history (last N turns, for context) */
  history: Array<{ role: 'user' | 'assistant'; content: string }>
  /** Which agent was selected by the router */
  selectedAgent: AgentId
  /** RAG chunks retrieved (set by medical-rag or risk-assessment) */
  ragChunks: Array<{ text: string; source: string; url?: string }>
  /** Confidence score 0–1 from risk-assessment agent */
  riskScore: number | null
  /** Structured instruction for the 3D viewer (set by 3d-orchestration) */
  viewerCommand: ViewerCommand | null
  /** Final answer text streamed to the user */
  answer: string
  /** Whether the response contains an image attached by the user */
  hasImage: boolean
}

export interface ViewerCommand {
  procedure: 'implant' | 'diep' | 'latissimus' | 'fat-grafting'
  wireframe: boolean
  color: string
  highlight?: string   // text overlay to show in the viewer
}

// Intent enum — router maps query → intent
export type Intent =
  | 'clinical'         // questions about cancer types, symptoms, screening, treatment
  | 'reconstruction'   // breast reconstruction, procedures, implants, AR/VR
  | 'risk'             // risk factors, genetic, lifestyle, family history
  | 'image'            // user attached an image or asks about image analysis
  | 'emotional'        // emotional support, fear, coping
  | 'general'          // anything else

export interface RouterOutput {
  intent: Intent
  agentId: AgentId
  confidence: number
}
