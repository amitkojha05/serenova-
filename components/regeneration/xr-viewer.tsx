'use client'

import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { XR, createXRStore } from '@react-three/xr'
import { Glasses, Smartphone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReconstructionMesh, type ProcedureType } from './reconstruction-mesh'

interface XRViewerProps {
  procedureType: ProcedureType
  color: string
  wireframe?: boolean
  opacity?: number
}

type XRSupport = {
  checked: boolean
  ar: boolean
  vr: boolean
}

/**
 * WebXR viewer for the reconstruction model.
 *
 * - "View in AR" starts an immersive-ar session (camera passthrough on
 *   WebXR-capable Android/Chrome devices and headsets like Quest 3).
 * - "Enter VR" starts an immersive-vr session on connected headsets.
 *
 * The same procedural mesh used by the desktop viewer is anchored ~1.2 m
 * in front of the viewer at chest height, mirroring how clinical tools
 * (Crisalix, VECTRA XT) present outcome previews at true-to-life scale.
 */
export function XRViewer({
  procedureType,
  color,
  wireframe = false,
  opacity = 0.8,
}: XRViewerProps) {
  // One store per mounted viewer; stable across renders.
  const store = useMemo(() => createXRStore({ hand: false }), [])
  const [support, setSupport] = useState<XRSupport>({ checked: false, ar: false, vr: false })
  const [sessionActive, setSessionActive] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function detect() {
      const xr = typeof navigator !== 'undefined' ? navigator.xr : undefined
      if (!xr) {
        if (!cancelled) setSupport({ checked: true, ar: false, vr: false })
        return
      }
      const [ar, vr] = await Promise.all([
        xr.isSessionSupported('immersive-ar').catch(() => false),
        xr.isSessionSupported('immersive-vr').catch(() => false),
      ])
      if (!cancelled) setSupport({ checked: true, ar, vr })
    }
    detect()
    return () => {
      cancelled = true
    }
  }, [])

  // Track session lifecycle so the UI can show an exit hint.
  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      setSessionActive(Boolean(state.session))
    })
    return unsubscribe
  }, [store])

  const nothingSupported = support.checked && !support.ar && !support.vr

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 0.2, 2.5], fov: 50 }}>
        <XR store={store}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[3, 2, 4]} intensity={1.1} />
          <pointLight position={[-3, -1, -2]} intensity={0.4} />
          {/*
            In XR the world origin is the viewer's starting pose, so the
            model is placed 1.2 m ahead at ~1.3 m height (chest level) and
            scaled to approximate anatomical size (~12 cm base contour).
          */}
          <group position={[0, 1.3, -1.2]}>
            <ReconstructionMesh
              procedureType={procedureType}
              color={color}
              wireframe={wireframe}
              opacity={opacity}
              scale={0.18}
            />
          </group>
          {/* Non-immersive preview copy at canvas origin for the 2D fallback view */}
          <group visible={!sessionActive}>
            <ReconstructionMesh
              procedureType={procedureType}
              color={color}
              wireframe={wireframe}
              opacity={opacity}
            />
          </group>
          <Environment preset="studio" />
        </XR>
      </Canvas>

      {/* Launch controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <Button
          onClick={() => store.enterAR()}
          disabled={!support.ar}
          className="rounded-full gap-2 shadow-lg shadow-primary/25"
        >
          <Smartphone className="w-4 h-4" />
          View in AR
        </Button>
        <Button
          onClick={() => store.enterVR()}
          disabled={!support.vr}
          variant="secondary"
          className="rounded-full gap-2"
        >
          <Glasses className="w-4 h-4" />
          Enter VR
        </Button>
        {sessionActive && (
          <Button
            onClick={() => store.getState().session?.end()}
            variant="destructive"
            size="icon"
            className="rounded-full"
            aria-label="Exit XR session"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Capability messaging */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 glass rounded-full">
        <p className="text-xs text-muted-foreground">
          {!support.checked
            ? 'Checking device AR/VR support…'
            : nothingSupported
              ? 'This device has no WebXR support — open on an AR-capable phone (Chrome on Android) or a headset like Meta Quest.'
              : support.ar && support.vr
                ? 'AR and VR available on this device'
                : support.ar
                  ? 'AR available — place the model in your room'
                  : 'VR headset detected'}
        </p>
      </div>
    </div>
  )
}
