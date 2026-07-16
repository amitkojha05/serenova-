'use client'

import { cn } from '@/lib/utils'
import { AGENT_META, type AgentId } from '@/lib/agents/types'
import { ArrowRight } from 'lucide-react'

interface AgentPipelineProps {
  activeAgent: AgentId | null
  isLoading: boolean
}

const PIPELINE_AGENTS: AgentId[] = [
  'router',
  'medical-rag',
  'risk-assessment',
  'vision',
  '3d-orchestration',
]

/**
 * Horizontal pipeline bar showing the 4 specialist agents + router.
 * The currently-active agent glows.
 */
export function AgentPipeline({ activeAgent, isLoading }: AgentPipelineProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {PIPELINE_AGENTS.map((id, i) => {
        const meta = AGENT_META[id]
        const isActive = activeAgent === id && isLoading
        const isRouter = id === 'router'

        return (
          <div key={id} className="flex items-center gap-1">
            <div
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all duration-300',
                isActive
                  ? `${meta.color} shadow-sm scale-105 ring-1 ring-current/30`
                  : 'bg-muted/30 text-muted-foreground border-border/50 opacity-50'
              )}
            >
              <span className="text-[11px]">{meta.icon}</span>
              <span className="hidden sm:inline">{isRouter ? 'Router' : meta.label}</span>
            </div>
            {i < PIPELINE_AGENTS.length - 1 && (
              <ArrowRight className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
            )}
          </div>
        )
      })}
    </div>
  )
}
