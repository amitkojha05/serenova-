'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ConversationActionsProps {
  conversationId: string
  initialTitle?: string | null
  compact?: boolean
}

export function ConversationActions({
  conversationId,
  initialTitle,
  compact = false,
}: ConversationActionsProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle ?? '')
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRename = async () => {
    setIsBusy(true)
    setError(null)

    const res = await fetch(`/api/conversations/${conversationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })

    if (!res.ok) {
      setError('Rename failed')
      setIsBusy(false)
      return
    }

    setIsBusy(false)
    router.refresh()
  }

  const handleDelete = async () => {
    const ok = window.confirm('Delete this conversation permanently?')
    if (!ok) return

    setIsBusy(true)
    setError(null)

    const res = await fetch(`/api/conversations/${conversationId}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      setError('Delete failed')
      setIsBusy(false)
      return
    }

    setIsBusy(false)
    router.push('/chat/history')
    router.refresh()
  }

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <div className="flex gap-2">
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Conversation title"
          maxLength={120}
        />
        <Button variant="outline" onClick={handleRename} disabled={isBusy}>
          Rename
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={isBusy}>
          Delete
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
