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

import { CalendarClock, MapPin } from 'lucide-react'

const TimeRangeEmpty = () => {
  return (<div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <CalendarClock size={36} strokeWidth={1} />
      </div>

      <h3 className="font-bold mt-4 mb-2">No playlist selected</h3>
      <p>
        Select a playlist to configure the time range
      </p>
    </div>)
}

const TimeRangePresent = () => {
  return (<></>)
}

export function TimeRange({ playlist, className }) {
  return (
    <Card className={`w-full max-w-sm ${className}`}>
      <CardHeader>
        <CardTitle>Time Range</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 h-full justify-center items-center flex text-slate-600 dark:text-slate-300">
        {playlist ?
          <TimeRangePresent playlist={playlist} /> : <TimeRangeEmpty />}
      </CardContent>
    </Card>
  )
}
