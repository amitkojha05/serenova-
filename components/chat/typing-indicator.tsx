'use client'

import { Heart } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex gap-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse">
        <Heart className="w-5 h-5 text-primary" />
      </div>

      <div className="glass-card rounded-2xl rounded-bl-md px-5 py-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
          <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
          <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
        </div>
      </div>
    </div>
  )
}
