'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { EmptyState } from './empty-state'
import { TypingIndicator } from './typing-indicator'
import { ErrorState } from './error-state'
import { AGENT_META, type AgentId } from '@/lib/agents/types'

/**
 * ChatContainer wires the multi-agent response headers back into the UI.
 *
 * When the API returns X-Agent-Id (e.g. "risk-assessment") the container
 * tags the message so ChatMessage can render the specialist badge.
 *
 * If the API returns X-Viewer-Command the container dispatches a custom
 * event so the 3D viewer on /regeneration can react even across pages
 * (cross-page via sessionStorage + storage event).
 */
export function ChatContainer() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)
  const [conversationId] = useState(() => crypto.randomUUID())
  const [useRag, setUseRag] = useState(true)

  // Map messageId → agentId (set when response headers arrive)
  const [agentMap, setAgentMap] = useState<Record<string, AgentId>>({})
  const [activeAgent, setActiveAgent] = useState<AgentId | null>(null)

  const handleResponse = useCallback((response: Response) => {
    const agentId = response.headers.get('X-Agent-Id') as AgentId | null
    const viewerCmd = response.headers.get('X-Viewer-Command')

    if (agentId) setActiveAgent(agentId)

    if (viewerCmd) {
      try {
        const cmd = JSON.parse(viewerCmd)
        sessionStorage.setItem('serenova-viewer-cmd', viewerCmd)
        window.dispatchEvent(
          new CustomEvent('serenova:viewer-command', { detail: cmd })
        )
      } catch {
        // ignore malformed header
      }
    }
  }, [])

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      fetch: async (url, init) => {
        const resp = await fetch(url, init)
        // Capture headers before the body stream is consumed
        if (resp.ok) handleResponse(resp.clone())
        return resp
      },
    }),
    onError: () => setHasError(true),
    onFinish: (e) => {
      if (activeAgent) {
        // id is on the message in ai v6 onFinish event
        const msgId = (e as unknown as { id?: string }).id ?? (e as unknown as { message?: { id?: string } }).message?.id
        if (msgId) setAgentMap((prev) => ({ ...prev, [msgId]: activeAgent! }))
        setActiveAgent(null)
      }
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'
  const isEmpty = messages.length === 0

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = (text: string) => {
    setHasError(false)
    sendMessage({ text }, { body: { conversationId, useRag } })
  }

  const handleRetry = () => {
    setHasError(false)
    window.location.reload()
  }

  // Active agent label for the typing indicator
  const loadingMeta = activeAgent ? AGENT_META[activeAgent] : null

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {isEmpty ? (
            <EmptyState onSelectPrompt={handleSend} />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  agentId={agentMap[message.id]}
                />
              ))}
              {isLoading && (
                <div className="flex flex-col gap-2">
                  {loadingMeta && (
                    <div className={`inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full text-xs border ${loadingMeta.color}`}>
                      <span>{loadingMeta.icon}</span>
                      <span>{loadingMeta.label} is thinking…</span>
                    </div>
                  )}
                  <TypingIndicator />
                </div>
              )}
              {hasError && status === 'error' && (
                <ErrorState onRetry={handleRetry} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-border bg-background/80 backdrop-blur-lg px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSend={handleSend}
            isLoading={isLoading}
            useRag={useRag}
            onToggleRag={setUseRag}
          />
          <p className="text-xs text-muted-foreground text-center mt-3">
            Serenova AI routes your question to a specialist agent. General
            information only — consult a healthcare professional for personal advice.
          </p>
        </div>
      </div>
    </div>
  )
}
