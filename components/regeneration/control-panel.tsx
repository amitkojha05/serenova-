'use client'

import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Eye,
  Grid3X3,
  Palette,
  RotateCcw,
  ZoomIn,
  Layers,
} from 'lucide-react'

interface ControlPanelProps {
  wireframe: boolean
  setWireframe: (value: boolean) => void
  showGrid: boolean
  setShowGrid: (value: boolean) => void
  opacity: number
  setOpacity: (value: number) => void
  colorIndex: number
  setColorIndex: (value: number) => void
  onReset: () => void
}

const colors = [
  { name: 'Natural', value: '#ec4899' },
  { name: 'Clinical', value: '#60a5fa' },
  { name: 'Contrast', value: '#a855f7' },
  { name: 'Warm', value: '#f97316' },
]

export function ControlPanel({
  wireframe,
  setWireframe,
  showGrid,
  setShowGrid,
  opacity,
  setOpacity,
  colorIndex,
  setColorIndex,
  onReset,
}: ControlPanelProps) {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold gradient-text">Visualization Controls</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* View Mode */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="w-4 h-4" />
          <span>View Mode</span>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="wireframe" className="text-foreground">
            Wireframe Mode
          </Label>
          <Switch
            id="wireframe"
            checked={wireframe}
            onCheckedChange={setWireframe}
          />
        </div>
      </div>

      {/* Grid Overlay */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Grid3X3 className="w-4 h-4" />
          <span>Medical Overlay</span>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="grid" className="text-foreground">
            Show Grid Points
          </Label>
          <Switch
            id="grid"
            checked={showGrid}
            onCheckedChange={setShowGrid}
          />
        </div>
      </div>

      {/* Opacity */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Layers className="w-4 h-4" />
          <span>Transparency</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-foreground">Opacity</Label>
            <span className="text-sm text-muted-foreground">
              {Math.round(opacity * 100)}%
            </span>
          </div>
          <Slider
            value={[opacity]}
            onValueChange={(value) => setOpacity(value[0])}
            min={0.2}
            max={1}
            step={0.05}
            className="w-full"
          />
        </div>
      </div>

      {/* Color Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Palette className="w-4 h-4" />
          <span>Color Scheme</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {colors.map((color, index) => (
            <button
              key={color.name}
              onClick={() => setColorIndex(index)}
              className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 ${
                colorIndex === index
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color.value }}
              />
              <span className="text-sm">{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interaction Hint */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ZoomIn className="w-4 h-4" />
          <span>Drag to rotate, scroll to zoom</span>
        </div>
      </div>
    </div>
  )
}

export { colors }
