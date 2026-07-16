'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'
import { Send, Loader2, BookMarked } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  disabled?: boolean
  useRag?: boolean
  onToggleRag?: (value: boolean) => void
}

export function ChatInput({ onSend, isLoading, disabled, useRag, onToggleRag }: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || disabled) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      {onToggleRag && (
        <button
          type="button"
          onClick={() => onToggleRag(!useRag)}
          className={cn(
            'mb-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all',
            useRag
              ? 'bg-primary/15 text-primary border border-primary/30'
              : 'bg-muted/40 text-muted-foreground border border-transparent'
          )}
          title="When on, answers are grounded in cited excerpts from US clinical sources (CDC, NCI, ACS, USPSTF)."
        >
          <BookMarked className="w-3.5 h-3.5" />
          {useRag ? 'Grounded answers: on' : 'Grounded answers: off'}
        </button>
      )}
      <div className="glass-card rounded-2xl p-2 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about breast cancer awareness..."
          disabled={isLoading || disabled}
          rows={1}
          className={cn(
            'flex-1 resize-none bg-transparent border-0 focus:ring-0 focus:outline-none',
            'text-foreground placeholder:text-muted-foreground',
            'px-4 py-3 text-sm min-h-[48px] max-h-[200px]',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading || disabled}
          className={cn(
            'flex-shrink-0 w-12 h-12 rounded-xl transition-all duration-300',
            'bg-primary hover:bg-primary/90 text-primary-foreground',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'shadow-lg shadow-primary/25 hover:shadow-primary/40'
          )}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  )
}
