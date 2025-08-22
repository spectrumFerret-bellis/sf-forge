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
  return (<><TT /></>)
}

export function TransmissionTimeline({ timeline = true, className }) {
  return (!timeline ?
    (<Card className={`w-full ${className} max-w-full`}>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 h-full justify-center items-center flex text-slate-600 dark:text-slate-300">
        <TransmissionTimelineEmpty />
      </CardContent>
    </Card>)
    : <TransmissionTimelinePresent timeline={timeline} />)
}
