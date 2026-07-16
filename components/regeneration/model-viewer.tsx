'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Canvas } from '@react-three/fiber'
import { Environment, Grid, OrbitControls } from '@react-three/drei'
import { ReconstructionMesh } from './reconstruction-mesh'

interface ModelViewerProps {
  wireframe?: boolean
  color?: string
  opacity?: number
  showGrid?: boolean
  procedureType?: 'implant' | 'diep' | 'latissimus' | 'fat-grafting'
}

export function ModelViewer({
  wireframe = false,
  color = '#ec4899',
  opacity = 0.8,
  showGrid = true,
  procedureType = 'implant',
}: ModelViewerProps) {
  const [autoRotate, setAutoRotate] = useState(true)

  const getProcedureOverlay = () => {
    switch (procedureType) {
      case 'implant':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-24 h-20 rounded-full border-2 border-dashed animate-pulse"
              style={{ borderColor: color, opacity: 0.6 }}
            />
          </div>
        )
      case 'diep':
        return (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
            <div
              className="w-32 h-8 rounded-lg border-2 border-dashed animate-pulse"
              style={{ borderColor: '#60a5fa', opacity: 0.6 }}
            />
            <svg className="absolute -top-16 left-1/2 -translate-x-1/2 w-4 h-20" viewBox="0 0 10 80">
              <path
                d="M5 0 Q8 40 5 80"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeDasharray="4"
                fill="none"
                className="animate-pulse"
              />
            </svg>
          </div>
        )
      case 'latissimus':
        return (
          <div className="absolute top-1/4 right-4 pointer-events-none">
            <div
              className="w-16 h-24 rounded-lg border-2 border-dashed animate-pulse"
              style={{ borderColor: '#34d399', opacity: 0.6 }}
            />
            <svg className="absolute top-1/2 -left-12 w-12 h-4" viewBox="0 0 48 16">
              <path
                d="M48 8 Q24 0 0 8"
                stroke="#34d399"
                strokeWidth="2"
                strokeDasharray="4"
                fill="none"
                className="animate-pulse"
              />
            </svg>
          </div>
        )
      case 'fat-grafting':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-ping"
                style={{
                  backgroundColor: '#f59e0b',
                  opacity: 0.6,
                  top: `${30 + Math.sin(i * 0.8) * 15}%`,
                  left: `${40 + Math.cos(i * 0.8) * 20}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{
        background: `
          radial-gradient(ellipse at center, ${color}10 0%, transparent 70%),
          linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--card)) 50%, hsl(var(--background)) 100%)
        `,
      }}
    >
      {/* Grid Background */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(${color}40 1px, transparent 1px),
              linear-gradient(90deg, ${color}40 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      )}

      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0.2, 2.5], fov: 50 }}>
          <color attach="background" args={['#00000000']} />
          <ambientLight intensity={0.45} />
          <directionalLight position={[3, 2, 4]} intensity={1.1} />
          <pointLight position={[-3, -1, -2]} intensity={0.4} />
          <ReconstructionMesh
            procedureType={procedureType}
            color={color}
            wireframe={wireframe}
            opacity={opacity}
          />
          {showGrid && <Grid infiniteGrid cellColor={color} sectionColor={color} fadeDistance={18} />}
          <Environment preset="studio" />
          <OrbitControls
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={0.9}
            minDistance={1.5}
            maxDistance={4}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={(Math.PI * 2) / 3}
          />
        </Canvas>
      </div>

      {/* Procedure-specific Overlays */}
      {getProcedureOverlay()}

      {/* Grid Points */}
      {showGrid && !wireframe && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse"
              style={{
                top: `${35 + Math.sin(i * 0.5) * 15}%`,
                left: `${35 + Math.cos(i * 0.5) * 20}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />

      {/* Info Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 glass rounded-full">
        <p className="text-xs text-muted-foreground">
          Drag to rotate, scroll to zoom
        </p>
      </div>

      {/* Auto-rotate Toggle */}
      <button
        onClick={() => setAutoRotate(!autoRotate)}
        className={cn(
          'absolute top-4 right-16 px-3 py-1.5 rounded-full text-xs transition-all',
          autoRotate
            ? 'bg-primary/20 text-primary'
            : 'bg-muted/50 text-muted-foreground'
        )}
      >
        {autoRotate ? 'Auto-rotating' : 'Manual'}
      </button>
    </div>
  )
}
