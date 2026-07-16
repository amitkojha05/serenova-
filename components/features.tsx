'use client'

import { MessageCircle, ClipboardCheck, BookOpen, HeartPulse, Brain, Box } from 'lucide-react'

const features = [
  {
    icon: MessageCircle,
    title: 'AI Chat Assistant',
    description: 'Get instant answers to your questions about breast cancer, symptoms, prevention, and treatment options.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: ClipboardCheck,
    title: 'Self-Check Guide',
    description: 'Step-by-step instructions for breast self-examination with visual guides and reminders.',
    gradient: 'from-rose-500 to-pink-400',
  },
  {
    icon: BookOpen,
    title: 'Resource Library',
    description: 'Access curated articles, research papers, and educational materials about breast health.',
    gradient: 'from-pink-400 to-fuchsia-500',
  },
  {
    icon: HeartPulse,
    title: 'Risk Assessment',
    description: 'Interactive questionnaire to understand your personal risk factors and prevention strategies.',
    gradient: 'from-fuchsia-500 to-pink-500',
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Advanced AI trained on medical literature to provide accurate, up-to-date information.',
    gradient: 'from-pink-500 to-rose-400',
  },
  {
    icon: Box,
    title: 'AR/VR Visualization',
    description: 'Interactive 3D breast reconstruction visualization with AR technology for surgical planning.',
    gradient: 'from-rose-400 to-pink-500',
  },
]

export function Features() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            <span className="gradient-text">Everything You Need</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
            Comprehensive tools and resources designed to support your breast health journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
