'use client'

import { cn } from '@/lib/utils'

const prompts = [
  { label: 'What are early signs of breast cancer?', icon: '?' },
  { label: 'How do I perform a self-check?', icon: '?' },
  { label: 'What are the risk factors?', icon: '?' },
  { label: 'When should I get a mammogram?', icon: '?' },
]

interface QuickPromptsProps {
  onSelect: (prompt: string) => void
  disabled?: boolean
}

export function QuickPrompts({ onSelect, disabled }: QuickPromptsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {prompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onSelect(prompt.label)}
          disabled={disabled}
          className={cn(
            'glass-card rounded-xl p-4 text-left transition-all duration-300',
            'hover:border-primary/30 hover:bg-primary/5',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'group'
          )}
        >
          <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            {prompt.label}
          </p>
        </button>
      ))}
    </div>
  )
}
