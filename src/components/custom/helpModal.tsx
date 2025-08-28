import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface HelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HelpModal({ open, onOpenChange }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-9/10">
        <DialogHeader className="border-b-1">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-gray-700 bg-clip-text text-transparent">
            SF Echo
          </DialogTitle>
          <DialogDescription className="text-base italic text-slate-600">
            Radio Transmission Monitoring & Analysis Platform
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-3 border-b-2 border-slate-200 pb-2">
            📖 What is SF Echo?
          </h2>
          <div className="space-y-6 mt-4">
            {/* What is SF Echo */}
            <section className="flex gap-4">
              <div className="flex-1 items-start">
                <p className="text-slate-700 leading-relaxed w-8/10">
                  SF Echo is a web-based application for monitoring, viewing, and analyzing radio transmissions in real-time. 
                  It provides a comprehensive interface for browsing transmission data, viewing transcriptions, and managing audio playback.
                </p>

                <h3 className="text-lg font-medium text-slate-700 mt-4 mb-2">Data Sources</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4">
                  <li><strong>Live Transmissions:</strong> Real-time monitoring of radio communications</li>
                  <li><strong>Transcriptions:</strong> Automatic speech-to-text conversion of audio</li>
                  <li><strong>Metadata:</strong> Timestamp, duration, channel, and location information</li>
                  <li><strong>Playlists:</strong> Organized collections of related transmissions</li>
                </ul>
              </div>
            </section>

            {/* Keyboard Navigation */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3 border-b-2 border-slate-200 pb-2">
                ⌨️ Keyboard Navigation
              </h2>
              
              <div className="flex">
                <div className="flex-1 text-sm">
                  <h3 className="text-lg font-medium text-slate-700 mt-4 mb-2">Table Navigation</h3>

                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary" className="font-mono">↑ ↓</Badge>
                    <span>Navigate up/down through transmissions</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary" className="font-mono">← →</Badge>
                    <span>Navigate left/right through transmissions</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary" className="font-mono">Enter</Badge>
                    <span>Play audio for selected transmission</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary" className="font-mono">Home</Badge>
                    <span>Jump to first transmission in current view</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary" className="font-mono">End</Badge>
                    <span>Jump to last transmission in current view</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary" className="font-mono">Page Up</Badge>
                    <span>Navigate up by page (10 transmissions)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="font-mono">Page Down</Badge>
                    <span>Navigate down by page (10 transmissions)</span>
                  </div>
                </div>

                <div className="flex-1 text-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-slate-700 mt-4 mb-2">General</h3>

                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="font-mono">Ctrl/Cmd + F</Badge>
                      <span>Focus search filter</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="font-mono">Esc</Badge>
                      <span>Clear current filter or selection</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-slate-700 mt-4 mb-2">Advanced Navigation</h3>

                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="font-mono">[ ]</Badge>
                      <span>Navigate between transmissions in the same talk group</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="font-mono">↑ ↓</Badge>
                      <span>in filter box - Select first/last transmission and exit filter</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Interface Guide */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3 border-b-2 border-slate-200 pb-2">
                🎛️ Interface Guide
              </h2>
              
              <div className="flex">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-slate-700 mt-4 mb-2">Transmissions Table</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4 text-base">
                    <li><strong>Date/Time:</strong> When the transmission was received</li>
                    <li><strong>Talk Group:</strong> Channel or group identifier (color-coded)</li>
                    <li><strong>Duration:</strong> Length of the transmission</li>
                    <li><strong>Transcription:</strong> Automatic speech-to-text content</li>
                    <li><strong>Color Coding:</strong> Each talk group has a unique color</li>
                  </ul>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-medium text-slate-700 mt-4 mb-2">Filtering & Search</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4 text-base">
                    <li><strong>Text Filter:</strong> Search within transcription content</li>
                    <li><strong>Channel Filter:</strong> Show only selected talk groups</li>
                    <li><strong>Playlist Filter:</strong> Filter by playlist selection</li>
                    <li><strong>Real-time Updates:</strong> New transmissions appear automatically</li>
                  </ul>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-medium text-slate-700 mt-4 mb-2">Audio Player</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4 text-base">
                    <li><strong>Waveform:</strong> Visual representation of audio</li>
                    <li><strong>Scrubbing:</strong> Click anywhere to jump to that time</li>
                    <li><strong>Playback Speed:</strong> Adjust speed from 0.5x to 2x</li>
                    <li><strong>Loop Mode:</strong> Repeat current transmission</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Tips */}
            <section>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">💡 Navigation Tips</h3>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 ml-4">
                    <li>Arrow keys work globally - no need to click in the table first</li>
                    <li>Up/Down arrows follow your current table sort order</li>
                    <li>Left/Right arrows always use chronological order</li>
                    <li>Home/End respect current filters and sort order</li>
                    <li>All navigation works with filtered data when a search is active</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200 mt-4">
                <CardContent className="pt-4">
                  <h3 className="text-lg font-medium text-green-800 mb-2">💡 Pro Tip</h3>
                  <p className="text-green-700">
                    Use the keyboard shortcuts for efficient navigation. Double-click any transmission to start playback immediately, 
                    or use the arrow keys to browse and Enter to play.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Data Export */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3 border-b-2 border-slate-200 pb-2">
                📊 Data Export
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Export your filtered transmission data to CSV format for external analysis. 
                The export includes all visible columns and respects your current filters.
              </p>
            </section>

            {/* Technical Notes */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3 border-b-2 border-slate-200 pb-2">
                🔧 Technical Notes
              </h2>
              <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4">
                <li><strong>Browser Support:</strong> Modern browsers with audio support required</li>
                <li><strong>Performance:</strong> Optimized for large datasets with virtual scrolling</li>
                <li><strong>Security:</strong> All data is transmitted securely over HTTPS</li>
                <li><strong>Privacy:</strong> No personal data is stored or transmitted</li>
              </ul>
            </section>

            <Separator />
            
            <div className="text-center text-sm text-slate-500">
              <strong>Spectrum Ferret</strong> • SF Echo v1.0<br />
              For support, contact your system administrator
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
