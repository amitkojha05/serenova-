import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space',
})

export const metadata: Metadata = {
  title: 'B-Care AI | Breast Cancer Awareness Assistant',
  description: 'AI-powered breast cancer awareness, self-check guidance, and support. Early detection saves lives.',
  keywords: ['breast cancer', 'awareness', 'AI assistant', 'health', 'self-check', 'early detection'],
  authors: [{ name: 'B-Care AI' }],
  openGraph: {
    title: 'B-Care AI | Breast Cancer Awareness Assistant',
    description: 'AI-powered breast cancer awareness, self-check guidance, and support.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#ec4899',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
