'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

export type ProcedureType = 'implant' | 'diep' | 'latissimus' | 'fat-grafting'

export interface ReconstructionMeshProps {
  procedureType: ProcedureType
  color: string
  wireframe?: boolean
  opacity?: number
  /** Uniform scale applied to the whole group (used by the XR viewer). */
  scale?: number
}

/**
 * Procedurally-deformed sphere approximating post-reconstruction breast
 * contour per procedure. Shared between the desktop OrbitControls viewer
 * and the WebXR (AR/VR) viewer so both render identical geometry.
 */
export function ReconstructionMesh({
  procedureType,
  color,
  wireframe = false,
  opacity = 0.8,
  scale = 1,
}: ReconstructionMeshProps) {
  const geometry = useMemo(() => {
    const base = new THREE.SphereGeometry(0.7, 64, 64)
    const position = base.attributes.position
    const vertex = new THREE.Vector3()

    const profile = getProcedureProfile(procedureType)

    for (let i = 0; i < position.count; i += 1) {
      vertex.fromBufferAttribute(position, i)

      const yBias = 1 + vertex.y * profile.verticalBias
      const flatten = 1 - Math.max(0, vertex.z) * profile.frontFlatten
      const zStretch = 1 + Math.max(0, -vertex.z) * profile.backVolume

      vertex.x *= profile.width * yBias
      vertex.y *= profile.height
      vertex.z *= profile.depth * flatten * zStretch

      if (vertex.y < -0.15) {
        vertex.z *= 0.82
      }

      position.setXYZ(i, vertex.x, vertex.y, vertex.z)
    }

    position.needsUpdate = true
    base.computeVertexNormals()
    return base
  }, [procedureType])

  return (
    <group scale={scale}>
      <mesh geometry={geometry} position={[0, 0.05, 0]}>
        <meshStandardMaterial
          color={color}
          roughness={0.35}
          metalness={0.08}
          wireframe={wireframe}
          transparent
          opacity={opacity}
        />
      </mesh>
      {!wireframe && (
        <mesh position={[0.01, 0.03, 0.53]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.08, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} />
        </mesh>
      )}
    </group>
  )
}

export function getProcedureProfile(procedureType: ProcedureType) {
  switch (procedureType) {
    case 'diep':
      return { width: 1.05, height: 0.92, depth: 1.1, frontFlatten: 0.1, backVolume: 0.2, verticalBias: 0.08 }
    case 'latissimus':
      return { width: 0.98, height: 0.95, depth: 1.04, frontFlatten: 0.13, backVolume: 0.12, verticalBias: 0.06 }
    case 'fat-grafting':
      return { width: 1.02, height: 0.9, depth: 0.98, frontFlatten: 0.08, backVolume: 0.08, verticalBias: 0.04 }
    case 'implant':
    default:
      return { width: 0.95, height: 0.96, depth: 1.18, frontFlatten: 0.06, backVolume: 0.25, verticalBias: 0.1 }
  }
}
