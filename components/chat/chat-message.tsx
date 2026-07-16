'use client'

import { Heart, User, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AGENT_META, type AgentId } from '@/lib/agents/types'
import type { UIMessage } from 'ai'

interface ChatMessageProps {
  message: UIMessage
  agentId?: AgentId
}

/**
 * Renders a single chat message.
 *
 * AI messages carry an optional agent badge (Medical Research, Risk
 * Assessment, Vision, 3D Visualization) so the user knows which
 * specialist handled their question.
 *
 * The component also does basic markdown-like formatting:
 *  - **bold**  → <strong>
 *  - [S1] ... [Sn]  → citation pill
 *  - Numbered / bulleted lines → compact list items
 */
function renderText(text: string) {
  return text.split('\n').map((line, li) => {
    // Empty line → spacer
    if (!line.trim()) return <div key={li} className="h-2" />

    // Apply inline formatting
    const formatted = line
      // Bold **...**
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      // Citation pill [S1]
      .replace(
        /\[S(\d+)\]/g,
        '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-primary/15 text-primary border border-primary/25 mx-0.5">[S$1]</span>'
      )

    const isNumbered = /^\d+\.\s/.test(line)
    const isBullet = /^[•\-]\s/.test(line)
    const isHeading = /^##\s/.test(line)

    if (isHeading) {
      return (
        <p
          key={li}
          className="text-sm font-semibold text-foreground mt-3 mb-1"
          dangerouslySetInnerHTML={{ __html: formatted.replace(/^##\s/, '') }}
        />
      )
    }
    if (isNumbered || isBullet) {
      return (
        <p
          key={li}
          className="text-sm leading-relaxed pl-4 text-foreground/90"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      )
    }
    return (
      <p
        key={li}
        className="text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    )
  })
}

export function ChatMessage({ message, agentId }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const meta = agentId ? AGENT_META[agentId] : AGENT_META['medical-rag']

  const textParts = message.parts.filter(
    (p): p is { type: 'text'; text: string } => p.type === 'text'
  )

  return (
    <div
      className={cn(
        'flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300',
        isUser ? 'justify-end' : 'justify-start items-start'
      )}
    >
      {/* AI avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-lg mt-1">
          {meta.icon}
        </div>
      )}

      <div className={cn('flex flex-col gap-1.5', isUser ? 'items-end' : 'items-start', 'max-w-[82%]')}>
        {/* Agent badge */}
        {!isUser && agentId && (
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border',
              meta.color
            )}
          >
            <span>{meta.icon}</span>
            {meta.label}
          </div>
        )}

        {/* Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-3 space-y-1',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'glass-card rounded-bl-md'
          )}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {textParts.map((p) => p.text).join('\n')}
            </p>
          ) : (
            <div className="text-sm leading-relaxed space-y-0.5 text-foreground/90">
              {textParts.map((p, i) => (
                <div key={i}>{renderText(p.text)}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
