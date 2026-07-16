'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Heart,
  Scissors,
  Syringe,
  Clock,
  Activity,
  Shield,
  Users,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const procedures = [
  {
    id: 'implant',
    title: 'Implant-Based Reconstruction',
    icon: Heart,
    description:
      'Uses silicone or saline implants to recreate breast shape. Often done in stages with tissue expanders.',
    duration: '1-2 hours',
    recovery: '4-6 weeks',
    candidacy: 'Ideal for patients with adequate skin coverage',
    details: [
      'Minimally invasive compared to flap surgery',
      'Shorter initial recovery time',
      'May require additional surgeries for optimal results',
      'Options for different implant sizes and shapes',
    ],
  },
  {
    id: 'diep',
    title: 'DIEP Flap Reconstruction',
    icon: Activity,
    description:
      'Uses tissue from the lower abdomen to create a natural-feeling breast without sacrificing muscle.',
    duration: '6-8 hours',
    recovery: '6-8 weeks',
    candidacy: 'Best for patients with sufficient abdominal tissue',
    details: [
      'Creates natural look and feel',
      'Preserves abdominal muscles',
      'Includes benefit of tummy tuck',
      'Permanent results with natural aging',
    ],
  },
  {
    id: 'latissimus',
    title: 'Latissimus Dorsi Flap',
    icon: Scissors,
    description:
      'Uses muscle and skin from the upper back to reconstruct the breast, often combined with an implant.',
    duration: '3-4 hours',
    recovery: '4-6 weeks',
    candidacy: 'Good for patients who need additional tissue coverage',
    details: [
      'Reliable blood supply',
      'Can be combined with implants',
      'Minimal impact on back function',
      'Creates natural breast projection',
    ],
  },
  {
    id: 'fat',
    title: 'Fat Grafting / Lipofilling',
    icon: Syringe,
    description:
      'Transfers fat from other body areas to enhance breast shape and volume. Often used for refinement.',
    duration: '1-3 hours',
    recovery: '2-4 weeks',
    candidacy: 'Ideal for minor adjustments and contouring',
    details: [
      'Uses your own natural tissue',
      'Minimal scarring',
      'Can improve contour irregularities',
      'May require multiple sessions',
    ],
  },
]

const benefits = [
  {
    icon: Shield,
    title: 'Safe & Proven',
    description: 'FDA-approved techniques with decades of clinical success',
  },
  {
    icon: Users,
    title: 'Expert Teams',
    description: 'Specialized plastic surgeons and oncology support',
  },
  {
    icon: Clock,
    title: 'Personalized Timeline',
    description: 'Immediate or delayed reconstruction options available',
  },
]

export function ProcedureCards() {
  return (
    <div className="space-y-8">
      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="glass-card rounded-xl p-4 flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <benefit.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">{benefit.title}</h4>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Procedures Accordion */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-semibold gradient-text mb-4">
          Reconstruction Procedures
        </h3>
        <Accordion type="single" collapsible className="space-y-2">
          {procedures.map((procedure) => (
            <AccordionItem
              key={procedure.id}
              value={procedure.id}
              className="border border-border/50 rounded-xl px-4 data-[state=open]:bg-card/50"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <procedure.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-foreground">
                      {procedure.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {procedure.description}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="pl-13 space-y-4">
                  <p className="text-muted-foreground">{procedure.description}</p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="text-foreground">{procedure.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Recovery:</span>
                      <span className="text-foreground">{procedure.recovery}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-foreground">
                      Key Points:
                    </h5>
                    <ul className="space-y-1.5">
                      {procedure.details.map((detail, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <ArrowRight className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Candidacy */}
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm">
                      <span className="text-primary font-medium">Best For: </span>
                      <span className="text-foreground">{procedure.candidacy}</span>
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* CTA */}
      <div className="glass-card rounded-2xl p-6 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Have Questions About Reconstruction?
        </h3>
        <p className="text-muted-foreground mb-4">
          Our AI assistant can help answer your questions about breast reconstruction options.
        </p>
        <Link href="/chat">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Talk to B-Care AI
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
