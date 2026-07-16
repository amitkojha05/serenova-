'use client'

import { useEffect, useState } from 'react'

const stats = [
  { value: 1, suffix: ' in 8', label: 'Women will develop breast cancer', highlight: true },
  { value: 99, suffix: '%', label: 'Survival rate when detected early' },
  { value: 3.8, suffix: 'M+', label: 'Breast cancer survivors in the US' },
  { value: 45, suffix: '+', label: 'Years of breast cancer research' },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current * 10) / 10)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span>
      {Number.isInteger(value) ? Math.round(displayValue) : displayValue.toFixed(1)}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 ${stat.highlight ? 'gradient-text' : 'text-foreground'}`}>
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
