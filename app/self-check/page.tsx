import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SelfCheckSteps } from '@/components/self-check/self-check-steps'
import { Heart, AlertTriangle, Calendar, Phone } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Self-Check Guide | B-Care - Breast Cancer Awareness',
  description: 'Learn how to perform a breast self-examination with our step-by-step guide. Early detection saves lives.',
}

export default function SelfCheckPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Monthly Self-Examination Guide</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
              <span className="gradient-text">Breast Self-Examination</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
              Regular self-examinations can help you become familiar with your body and notice any changes early. 
              Follow this step-by-step guide to perform a thorough self-check.
            </p>
          </div>

          {/* Important Notice */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-accent/10 border border-accent/20">
              <AlertTriangle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">Important Notice</p>
                <p className="text-sm text-muted-foreground">
                  Self-examination is not a substitute for regular mammograms and clinical examinations by healthcare professionals. 
                  If you notice any changes, please consult a doctor immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Self-Check Steps */}
          <SelfCheckSteps />

          {/* When to See a Doctor */}
          <div className="max-w-2xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              When to See a Doctor
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                'A new lump or thickening in or near the breast',
                'Change in the size or shape of the breast',
                'Dimpling or puckering of the skin',
                'Nipple discharge (especially bloody)',
                'Redness or flaky skin on the breast or nipple',
                'Pulling in of the nipple or pain',
              ].map((symptom, index) => (
                <div key={index} className="flex items-start gap-3 p-4 glass-card rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-3 h-3 text-destructive" />
                  </div>
                  <p className="text-sm text-muted-foreground">{symptom}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Schedule regular mammograms</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-5 h-5" />
                <span className="text-sm">Consult your healthcare provider</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-4">Have questions about breast health?</p>
            <Link href="/chat">
              <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                Chat with B-Care AI
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
