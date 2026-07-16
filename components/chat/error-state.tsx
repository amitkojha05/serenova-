'use client'

import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  onRetry: () => void
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex gap-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-destructive/20 border border-destructive/30 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-destructive" />
      </div>

      <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3 border-destructive/30">
        <p className="text-sm text-foreground mb-3">
          Sorry, something went wrong. Please try again.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="border-destructive/30 hover:border-destructive/50 hover:bg-destructive/10"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  )
}
