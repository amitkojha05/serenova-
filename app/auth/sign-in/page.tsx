'use client'

export const dynamic = 'force-dynamic'

import { FormEvent, Suspense, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSupabaseBrowserClient } from '@/lib/supabase-auth'

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  )
}

function SignInContent() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = useMemo(() => getSupabaseBrowserClient(), [])

  const nextPath = params.get('next') ?? '/chat'

  const handleEmailSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    setMessage('Magic link sent. Check your email to continue.')
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    })

    if (googleError) {
      setError(googleError.message)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Sign in to B-Care AI</CardTitle>
              <CardDescription>
                Continue to your private chat and history across devices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleEmailSignIn} className="space-y-3">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Sending link...' : 'Sign in with Email'}
                </Button>
              </form>

              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={handleGoogleSignIn}
                className="w-full"
              >
                Continue with Google
              </Button>

              {message ? <p className="text-sm text-primary">{message}</p> : null}
              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <p className="text-xs text-muted-foreground">
                By continuing, you agree to use this app for education support only.
                Medical decisions should be made with licensed professionals.
              </p>

              <Button variant="ghost" onClick={() => router.push('/')} className="w-full">
                Back to Home
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Next page after login: <Link href={nextPath} className="underline">{nextPath}</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
