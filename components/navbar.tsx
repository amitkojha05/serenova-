'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Menu, X, Heart, MessageCircle, ClipboardCheck, BookOpen, Box, LogOut, History, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getSupabaseBrowserClient } from '@/lib/supabase-auth'

const navLinks = [
  { href: '/', label: 'Home', icon: Heart },
  { href: '/chat', label: 'AI Chat', icon: MessageCircle },
  { href: '/self-check', label: 'Self-Check', icon: ClipboardCheck },
  { href: '/regeneration', label: 'AR/VR', icon: Box },
  { href: '/resources', label: 'Resources', icon: BookOpen },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])

  useEffect(() => {
    let active = true

    supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setIsSignedIn(Boolean(data.user))
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(Boolean(session?.user))
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsSignedIn(false)
    window.location.href = '/'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary/50 transition-colors">
              <Heart className="w-5 h-5 text-primary" />
              <div className="absolute inset-0 rounded-xl animate-pulse-glow opacity-50" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="gradient-text">B-Care</span>
              <span className="text-muted-foreground ml-1 text-sm font-normal">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300"
                >
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              {isSignedIn ? (
                <>
                  <Link href="/chat/history">
                    <Button variant="ghost">
                      <History className="w-4 h-4 mr-2" />
                      History
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Button>
                </>
              ) : (
                <Link href="/auth/sign-in">
                  <Button variant="outline">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign in
                  </Button>
                </Link>
              )}
              <Link href="/chat">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
                  Start Chat
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            isOpen ? 'max-h-80 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-primary/10"
                >
                  <link.icon className="w-4 h-4 mr-3" />
                  {link.label}
                </Button>
              </Link>
            ))}
            <Link href="/chat" onClick={() => setIsOpen(false)}>
              <Button className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Chat
              </Button>
            </Link>
            {isSignedIn ? (
              <>
                <Link href="/chat/history" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <History className="w-4 h-4 mr-3" />
                    History
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign out
                </Button>
              </>
            ) : (
              <Link href="/auth/sign-in" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <LogIn className="w-4 h-4 mr-3" />
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
