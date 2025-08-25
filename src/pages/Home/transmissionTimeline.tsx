import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { SquareChartGantt, MapPin } from 'lucide-react'
import { TransmissionTimeline as TT } from './../../components/custom/transmissionTimeline'
import { usePlaylistStore } from '@/stores/playlistStore'
import { useRef } from 'react'

const TransmissionTimelineEmpty = () => {
  return (<div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <SquareChartGantt size={36} strokeWidth={1} />
      </div>

      <h3 className="font-bold mt-4 mb-2">No playlist selected</h3>
      <p>
        Select a playlist to view transmission timeline
      </p>
    </div>)
}

const TransmissionTimelinePresent = () => {
  const { selectedPlaylist } = usePlaylistStore()
  const timelineRef = useRef<HTMLDivElement>(null)
  
  return (
    <div className="w-full">
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Selected Playlist:</strong> {selectedPlaylist?.name}
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          ID: {selectedPlaylist?.id}
        </p>
      </div>
      <div className="w-full" ref={timelineRef}>
        <TT containerRef={timelineRef} />
      </div>
    </div>
  )
}

interface TransmissionTimelineProps {
  className?: string
}

export function TransmissionTimeline({ className }: TransmissionTimelineProps) {
  const { selectedPlaylist } = usePlaylistStore()
  
  return (
    <Card className={`w-full ${className || ''} max-w-full`}>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 h-full text-slate-600 dark:text-slate-300">
        {!selectedPlaylist ? (
          <TransmissionTimelineEmpty />
        ) : (
          <TransmissionTimelinePresent />
        )}
      </CardContent>
    </Card>
  )
}
