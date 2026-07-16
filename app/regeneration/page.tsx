'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ControlPanel, colors } from '@/components/regeneration/control-panel'
import { ProcedureCards } from '@/components/regeneration/procedure-cards'
import { ModelViewer } from '@/components/regeneration/model-viewer'
import { XRViewer } from '@/components/regeneration/xr-viewer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Box,
  FileText,
  Info,
  Sparkles,
  MonitorSmartphone,
  AlertCircle,
  Play,
} from 'lucide-react'

type ProcedureType = 'implant' | 'diep' | 'latissimus' | 'fat-grafting'

export default function RegenerationPage() {
  const [wireframe, setWireframe] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [opacity, setOpacity] = useState(0.8)
  const [colorIndex, setColorIndex] = useState(0)
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureType>('implant')

  const handleReset = () => {
    setWireframe(false)
    setShowGrid(true)
    setOpacity(0.8)
    setColorIndex(0)
    setSelectedProcedure('implant')
  }

  // React to 3D-Orchestration agent commands from the chat
  useViewerCommand((cmd) => {
    setSelectedProcedure(cmd.procedure as ProcedureType)
    if (cmd.wireframe !== undefined) setWireframe(cmd.wireframe)
    // Map command color to closest palette index
    const colorMap: Record<string, number> = {
      '#ec4899': 0,
      '#60a5fa': 1,
      '#a855f7': 2,
      '#f97316': 3,
    }
    const ci = colorMap[cmd.color]
    if (ci !== undefined) setColorIndex(ci)
  })


  const procedures: { id: ProcedureType; name: string; color: string }[] = [
    { id: 'implant', name: 'Implant', color: '#ec4899' },
    { id: 'diep', name: 'DIEP Flap', color: '#60a5fa' },
    { id: 'latissimus', name: 'Latissimus', color: '#34d399' },
    { id: 'fat-grafting', name: 'Fat Grafting', color: '#f59e0b' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                AR/VR Visualization Technology
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">Breast </span>
              <span className="gradient-text">Regeneration</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Explore breast reconstruction options with our interactive 3D visualization tool.
              Understand different procedures and make informed decisions about your care.
            </p>
          </div>

          {/* AR Notice */}
          <div className="glass-card rounded-xl p-4 mb-8 flex items-start gap-3 max-w-2xl mx-auto">
            <MonitorSmartphone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium">Interactive 3D Model</p>
              <p className="text-sm text-muted-foreground">
                Use your mouse or finger to rotate the model and explore different reconstruction visualization modes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="visualization" className="space-y-8">
            <TabsList className="glass w-full justify-start p-1 overflow-x-auto">
              <TabsTrigger
                value="visualization"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Box className="w-4 h-4 mr-2" />
                3D Visualization
              </TabsTrigger>
              <TabsTrigger
                value="xr"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <MonitorSmartphone className="w-4 h-4 mr-2" />
                AR / VR Mode
              </TabsTrigger>
              <TabsTrigger
                value="procedures"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FileText className="w-4 h-4 mr-2" />
                Procedures
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Info className="w-4 h-4 mr-2" />
                About AR/VR
              </TabsTrigger>
            </TabsList>

            {/* 3D Visualization Tab */}
            <TabsContent value="visualization" className="space-y-6">
              {/* Procedure Selector */}
              <div className="glass-card rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-3">Select Procedure to Visualize</p>
                <div className="flex flex-wrap gap-2">
                  {procedures.map((proc) => (
                    <button
                      key={proc.id}
                      onClick={() => setSelectedProcedure(proc.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                        selectedProcedure === proc.id
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border hover:border-primary/50 text-muted-foreground'
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: proc.color }}
                      />
                      <span className="text-sm font-medium">{proc.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 3D Canvas */}
                <div className="lg:col-span-2 h-[500px]">
                  <ModelViewer
                    wireframe={wireframe}
                    color={colors[colorIndex].value}
                    opacity={opacity}
                    showGrid={showGrid}
                    procedureType={selectedProcedure}
                  />
                </div>

                {/* Control Panel */}
                <div className="lg:col-span-1">
                  <ControlPanel
                    wireframe={wireframe}
                    setWireframe={setWireframe}
                    showGrid={showGrid}
                    setShowGrid={setShowGrid}
                    opacity={opacity}
                    setOpacity={setOpacity}
                    colorIndex={colorIndex}
                    setColorIndex={setColorIndex}
                    onReset={handleReset}
                  />
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card rounded-xl p-4">
                  <h4 className="font-medium text-foreground mb-2">Wireframe Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    View the structural mesh to understand tissue distribution and surgical planning areas.
                  </p>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <h4 className="font-medium text-foreground mb-2">Grid Overlay</h4>
                  <p className="text-sm text-muted-foreground">
                    Medical grid points help surgeons map precise locations for incisions and implant placement.
                  </p>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <h4 className="font-medium text-foreground mb-2">Procedure Overlay</h4>
                  <p className="text-sm text-muted-foreground">
                    Different overlays show tissue paths, donor sites, and transfer areas for each procedure type.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Procedures Tab */}
            {/* AR / VR Tab */}
            <TabsContent value="xr" className="space-y-6">
              <div className="glass-card rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  AR mode uses your device camera to place the selected reconstruction model in
                  your real environment (WebXR — Chrome on Android, or headsets like Meta Quest).
                  VR mode opens an immersive view on a connected headset. These previews are
                  educational visualizations, similar in spirit to clinical planning tools such as
                  Crisalix and VECTRA XT — always discuss actual outcomes with your surgeon.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[500px]">
                  <XRViewer
                    procedureType={selectedProcedure}
                    color={colors[colorIndex].value}
                    wireframe={wireframe}
                    opacity={opacity}
                  />
                </div>
                <div className="lg:col-span-1">
                  <ControlPanel
                    wireframe={wireframe}
                    setWireframe={setWireframe}
                    showGrid={showGrid}
                    setShowGrid={setShowGrid}
                    opacity={opacity}
                    setOpacity={setOpacity}
                    colorIndex={colorIndex}
                    setColorIndex={setColorIndex}
                    onReset={handleReset}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="procedures">
              <ProcedureCards />
            </TabsContent>

            {/* About AR/VR Tab */}
            <TabsContent value="about" className="space-y-6">
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-semibold gradient-text mb-6">
                  How AR/VR Transforms Breast Reconstruction
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">
                      For Patients
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        Visualize potential outcomes before surgery
                      </li>
                      <li className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        Make informed decisions with realistic simulations
                      </li>
                      <li className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        Reduce anxiety by understanding the procedure
                      </li>
                      <li className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        Compare different reconstruction options interactively
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">
                      For Surgeons
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                        Precise surgical planning with 3D mapping
                      </li>
                      <li className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                        Analyze anatomical data for optimal outcomes
                      </li>
                      <li className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                        Improve communication with patients during consultations
                      </li>
                      <li className="flex items-start gap-3 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                        Identify optimal blood vessel paths for DIEP flap surgery
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Note:</span> This visualization is for educational purposes only.
                    Always consult with a qualified plastic surgeon to discuss your specific reconstruction options and expected outcomes.
                  </p>
                </div>
              </div>

              {/* Technology Stack */}
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Technology Behind the Visualization
                </h3>
                <p className="text-muted-foreground mb-6">
                  Our 3D breast model is rendered with Three.js and WebGL, allowing smooth interaction directly
                  in your browser without downloads or plugins.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                    <p className="text-2xl font-bold gradient-text">Three.js</p>
                    <p className="text-sm text-muted-foreground">Rendering</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                    <p className="text-2xl font-bold gradient-text">60 FPS</p>
                    <p className="text-sm text-muted-foreground">Smooth Animation</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                    <p className="text-2xl font-bold gradient-text">Touch</p>
                    <p className="text-sm text-muted-foreground">Mobile Support</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
                    <p className="text-2xl font-bold gradient-text">Real-time</p>
                    <p className="text-sm text-muted-foreground">Interaction</p>
                  </div>
                </div>
              </div>

              {/* Future Vision */}
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  The Future of Medical AR/VR
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <Play className="w-4 h-4 text-primary" />
                      Current Capabilities
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>- 3D visualization of reconstruction options</li>
                      <li>- Interactive procedure exploration</li>
                      <li>- Educational overlays and guides</li>
                      <li>- Color-coded surgical planning</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      Coming Soon
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>- AR overlay on patient photos</li>
                      <li>- AI-powered outcome prediction</li>
                      <li>- VR surgical simulation training</li>
                      <li>- Real-time surgeon collaboration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  )
}
