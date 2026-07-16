import React from 'react'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSupabaseServerAuthClient } from '@/lib/supabase-auth'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { isAdminEmail } from '@/lib/admin'

type ConversationWithMessages = {
  id: string
  created_at: string
  user_id: string
  messages: Array<{
    id: string
    role: string
    content: string
    created_at: string
  }>
}

export default async function ModerationPage({
  searchParams,
}: {
  searchParams?: { page?: string; limit?: string }
}) {
  const page = searchParams?.page ?? '1'
  const limit = searchParams?.limit ?? '25'
  const pageNum = Math.max(1, Number(page) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(limit) || 25))
  const from = (pageNum - 1) * pageSize
  const to = from + pageSize - 1
  const authClient = await getSupabaseServerAuthClient()
  const {
    data: { user },
  } = await authClient.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in?next=/admin/moderation')
  }

  if (!isAdminEmail(user.email)) {
    redirect('/chat')
  }

  const dbClient = getSupabaseServerClient()
  if (!dbClient) {
    redirect('/chat')
  }

  const { data } = await dbClient
    .from('conversations')
    .select(
      `
      id,
      created_at,
      user_id,
      messages (
        id,
        role,
        content,
        created_at
      )
    `
    )
    .order('created_at', { ascending: false })
    .range(from, to)

  const records = (data ?? []) as ConversationWithMessages[]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div>
            <h1 className="text-2xl font-semibold">Admin Moderation</h1>
            <p className="text-sm text-muted-foreground">
              Last 25 conversations across users for quality and safety review.
            </p>
          </div>

          {records.map((conversation) => (
            <Card key={conversation.id}>
              <CardHeader>
                <CardTitle className="text-base">Conversation {conversation.id.slice(0, 8)}</CardTitle>
                <CardDescription>
                  User: {conversation.user_id} | {new Date(conversation.created_at).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {conversation.messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No messages recorded.</p>
                ) : (
                  conversation.messages.slice(0, 6).map((message) => (
                    <div key={message.id} className="border rounded-md p-2 space-y-1">
                      <Badge variant={message.role === 'assistant' ? 'default' : 'secondary'}>
                        {message.role}
                      </Badge>
                      <p className="text-sm line-clamp-3 whitespace-pre-wrap">{message.content}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
          <div className="flex items-center justify-between pt-2">
            <Link
              href={`/admin/moderation?page=${Math.max(1, pageNum - 1)}&limit=${pageSize}`}
              className="text-sm underline underline-offset-4"
            >
              Previous
            </Link>
            <Link
              href={`/admin/moderation?page=${pageNum + 1}&limit=${pageSize}`}
              className="text-sm underline underline-offset-4"
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
