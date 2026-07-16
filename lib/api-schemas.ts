import { z } from 'zod'

const uiTextPartSchema = z.object({
  type: z.literal('text'),
  text: z.string().min(1).max(4000),
})

const uiMessageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(['user', 'assistant', 'system']),
  parts: z.array(z.union([uiTextPartSchema, z.object({ type: z.string() })])).min(1),
})

export const chatRequestSchema = z.object({
  messages: z.array(uiMessageSchema).min(1).max(50),
  conversationId: z.string().uuid().optional(),
  useRag: z.boolean().optional(),
})

export const patchConversationSchema = z.object({
  title: z.string().trim().min(1).max(120),
})
