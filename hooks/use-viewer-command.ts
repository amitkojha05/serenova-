'use client'

import { useEffect } from 'react'
import type { ViewerCommand } from '@/lib/agents/types'

/**
 * Subscribes to viewer commands emitted by the 3D-Orchestration agent.
 *
 * The chat API sets sessionStorage and dispatches a CustomEvent
 * `serenova:viewer-command` whenever the 3D agent produces a ViewerCommand.
 * This hook picks it up on the /regeneration page and applies the state.
 */
export function useViewerCommand(
  onCommand: (cmd: ViewerCommand) => void
) {
  useEffect(() => {
    // Apply any pending command from a previous navigation
    const stored = sessionStorage.getItem('serenova-viewer-cmd')
    if (stored) {
      try {
        onCommand(JSON.parse(stored) as ViewerCommand)
      } catch {
        // malformed, ignore
      }
    }

    const handler = (e: Event) => {
      const cmd = (e as CustomEvent<ViewerCommand>).detail
      if (cmd) onCommand(cmd)
    }

    window.addEventListener('serenova:viewer-command', handler)
    return () => window.removeEventListener('serenova:viewer-command', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
