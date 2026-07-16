import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConversationActions } from '@/components/chat/conversation-actions'
import { getSupabaseServerAuthClient } from '@/lib/supabase-auth'

type MessageRow = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export default async function ConversationDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  const authClient = await getSupabaseServerAuthClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()

  if (!user) {
    redirect(`/auth/sign-in?next=/chat/history/${id}`)
  }

  const { data: conversation } = await authClient
    .from('conversations')
    .select('id, created_at, title')
    .eq('id', id)
    .maybeSingle()

  if (!conversation) {
    notFound()
  }

  const { data: messages } = await authClient
    .from('messages')
    .select('id, role, content, created_at')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  const messageList = (messages ?? []) as MessageRow[]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Conversation Transcript</h1>
            <Link href="/chat/history" className="text-sm underline underline-offset-4">
              Back to history
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{conversation.title ?? 'Untitled conversation'}</CardTitle>
              <CardDescription>
                Started {new Date(conversation.created_at).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ConversationActions
                conversationId={conversation.id}
                initialTitle={conversation.title}
              />
              {messageList.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages in this conversation yet.</p>
              ) : (
                messageList.map((message) => (
                  <div key={message.id} className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={message.role === 'assistant' ? 'default' : 'secondary'}>
                        {message.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
