'use client'

import { Heart, Sparkles } from 'lucide-react'
import { QuickPrompts } from './quick-prompts'

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void
}

export function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-in fade-in-0 duration-500">
      {/* Icon */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse-glow">
          <Heart className="w-10 h-10 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-accent/30 border border-accent/50 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 text-balance">
        <span className="gradient-text">Hi, I&apos;m your B-Care Assistant</span>
      </h2>

      {/* Description */}
      <p className="text-muted-foreground text-center max-w-md mb-10 text-pretty">
        I&apos;m here to help you learn about breast cancer awareness, guide you through self-checks, 
        and answer any questions you might have.
      </p>

      {/* Quick Prompts */}
      <div className="w-full max-w-lg">
        <p className="text-sm text-muted-foreground text-center mb-4">Try asking:</p>
        <QuickPrompts onSelect={onSelectPrompt} />
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center mt-10 max-w-md">
        Note: I provide general information only. Always consult healthcare professionals for medical advice.
      </p>
    </div>
  )
}
