import { Navbar } from '@/components/navbar'
import { ChatContainer } from '@/components/chat/chat-container'

export const metadata = {
  title: 'Serenova AI Chat | Multi-Agent Breast Health Assistant',
  description:
    'Chat with our multi-agent AI: Medical RAG, Vision, Risk Assessment, and 3D Orchestration agents routed to your question automatically.',
}

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <ChatContainer />
      </div>
    </main>
  )
}
