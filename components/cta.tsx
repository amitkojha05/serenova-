'use client'

import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative glass-card rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mb-8 animate-pulse-glow">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>

            {/* Content */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-balance">
              <span className="text-foreground">Ready to Learn More?</span>
              <br />
              <span className="gradient-text">Start Your Journey Today</span>
            </h2>

            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 text-pretty">
              Our AI assistant is here to answer your questions, guide you through self-checks, 
              and provide evidence-based information about breast health.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/chat">
                <Button 
                  size="lg" 
                  className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 px-8"
                >
                  Chat with AI
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/regeneration">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-border hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 px-8"
                >
                  Explore AR/VR
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
