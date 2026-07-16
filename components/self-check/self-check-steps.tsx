'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check, AlertCircle, Clock, Eye, Hand, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const steps = [
  {
    id: 1,
    title: 'Look in the Mirror',
    icon: Eye,
    instruction: 'Stand in front of a mirror with your shoulders straight and arms on your hips.',
    details: [
      'Check if your breasts are their usual size, shape, and color',
      'Look for any visible distortion or swelling',
      'Check for dimpling, puckering, or bulging of the skin',
      'Look for a nipple that has changed position or an inverted nipple',
      'Check for redness, soreness, rash, or swelling',
    ],
    tip: 'Do this step in good lighting and take your time.',
  },
  {
    id: 2,
    title: 'Raise Your Arms',
    icon: Hand,
    instruction: 'Raise your arms above your head and look for the same changes.',
    details: [
      'Look for any changes in breast shape when arms are raised',
      'Check for any fluid coming out of one or both nipples',
      'This could be watery, milky, yellow fluid, or blood',
    ],
    tip: 'Squeeze each nipple gently between your finger and thumb.',
  },
  {
    id: 3,
    title: 'Feel While Standing',
    icon: Hand,
    instruction: 'Feel your breasts while standing or sitting, ideally in the shower when skin is wet.',
    details: [
      'Use your right hand to feel your left breast, then vice versa',
      'Use a firm, smooth touch with the first few finger pads',
      'Keep fingers flat and together',
      'Cover the entire breast from top to bottom, side to side',
      'Follow a pattern: circles, lines, or wedges',
    ],
    tip: 'Soapy hands in the shower can make this examination easier.',
  },
  {
    id: 4,
    title: 'Feel While Lying Down',
    icon: RefreshCw,
    instruction: 'Lie down and repeat the examination with a pillow under your right shoulder.',
    details: [
      'Place your right arm behind your head',
      'Use your left hand to feel your right breast',
      'Use the same circular, firm touch as before',
      'Cover all breast tissue including the armpit area',
      'Repeat on the other side',
    ],
    tip: 'Lying down spreads breast tissue evenly, making it easier to feel all areas.',
  },
]

export function SelfCheckSteps() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100
  const isCompleted = completedSteps.includes(step.id)
  const allCompleted = completedSteps.length === steps.length

  const handleNext = () => {
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id])
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id])
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setCompletedSteps([])
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, index) => (
          <button
            key={s.id}
            onClick={() => setCurrentStep(index)}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
              index === currentStep
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : completedSteps.includes(s.id)
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-secondary text-muted-foreground'
            )}
          >
            {completedSteps.includes(s.id) ? (
              <Check className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </button>
        ))}
      </div>

      {/* Current Step Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <step.icon className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{step.title}</h2>
            <p className="text-sm text-muted-foreground">Step {currentStep + 1}</p>
          </div>
        </div>

        {/* Main Instruction */}
        <p className="text-lg text-foreground mb-6 text-pretty">{step.instruction}</p>

        {/* Details */}
        <div className="space-y-3 mb-6">
          {step.details.map((detail, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <p className="text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20">
          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Pro Tip</p>
            <p className="text-sm text-muted-foreground">{step.tip}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="border-border hover:border-primary/50"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {!isCompleted && (
            <Button
              variant="outline"
              onClick={handleComplete}
              className="border-primary/30 hover:bg-primary/10 text-primary"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark Done
            </Button>
          )}

          {currentStep === steps.length - 1 ? (
            allCompleted ? (
              <Button
                onClick={handleReset}
                className="bg-primary hover:bg-primary/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-primary hover:bg-primary/90"
              >
                <Check className="w-4 h-4 mr-2" />
                Complete
              </Button>
            )
          ) : (
            <Button
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90"
            >
              Next Step
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Completion Message */}
      {allCompleted && (
        <div className="mt-8 p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center animate-in fade-in-0 duration-500">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Great Job!</h3>
          <p className="text-muted-foreground mb-4">
            You&apos;ve completed all self-check steps. Remember to perform this examination monthly.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Recommended: Once per month</span>
          </div>
        </div>
      )}
    </div>
  )
}
