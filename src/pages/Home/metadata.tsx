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

import { Info, MapPin } from 'lucide-react'

const MetadataEmpty = () => {
  return (<div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <Info size={36} strokeWidth={1} />
      </div>

      <h3 className="font-bold mt-4 mb-2">No transmission selected</h3>
      <p>
        Select a transmission to view its metadata
      </p>
    </div>)
}

const MetadataPresent = () => {
  const tmp = [
    [<MapPin strokeWidth={1} size={24} />, "Radio System", "City of Boulder Integrated Radio System (CBIRS)"],
    [<MapPin strokeWidth={1} size={24} />, "Site", "Boulder"],
    [<MapPin strokeWidth={1} size={24} />, "Channel Name", "T-Control"],
    [<MapPin strokeWidth={1} size={24} />, "Talk Group", "Law 1"],
    [<MapPin strokeWidth={1} size={24} />, "Group ID", "45001"],
    [<MapPin strokeWidth={1} size={24} />, "Channel Type", "Not available"],
    [<MapPin strokeWidth={1} size={24} />, "RX Frequency", "771.593750 MHz"],
    [<MapPin strokeWidth={1} size={24} />, "Radio ID", "0"],
    [<MapPin strokeWidth={1} size={24} />, "TX Lat/Lon", "Not available"],
    [<MapPin strokeWidth={1} size={24} />, "RX Lat/Lon", "39.987600° N, 105.222300° W"],
  ]

  return (<Table>
    <TableBody>
      {tmp.map((v, i) => (
        <TableRow key={`metadata-card-row${i}`} className="border-0 text-xs leading-1">
          <TableCell className="py-[1px] w-[32px]">{v[0]}</TableCell>
          <TableCell>{v[1]}</TableCell>
          <TableCell className="text-right">{v[2]}</TableCell>
        </TableRow>))}
    </TableBody>
  </Table>)
}

export function Metadata({ transmission = true, className }) {
  return (
    <Card className={`w-full max-w-sm ${className}`}>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 h-full justify-center items-center flex text-slate-600 dark:text-slate-300">
        {transmission ?
          <MetadataPresent transmission={transmission} /> : <MetadataEmpty />}
      </CardContent>
    </Card>
  )
}
