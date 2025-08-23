import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

import {
  AudioLines,
  Drill,
  Mic,
  RadioReceiver,
  Menu,
  MessagesSquare,
  Hash,
  Info, 
  MapPin,
  Blocks,
  Wifi,
  FileText,
  MessageCircle,
  List,
  Radio,
  Grid,
} from 'lucide-react'

import type { RadioTransmission } from '@/hooks/api/transmissions'
import { usePlaylistStore } from '@/stores/playlistStore'
import { formatInTimeZone } from 'date-fns-tz'

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

const MetadataPresent = ({ transmission }: { transmission: RadioTransmission }) => {
  // Helper function to format coordinates
  const formatCoordinates = (lat: number | null | undefined, lon: number | null | undefined) => {
    if (lat === null || lat === undefined || lon === null || lon === undefined) return "Not available"
    const latDir = lat >= 0 ? 'N' : 'S'
    const lonDir = lon >= 0 ? 'E' : 'W'
    return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lon).toFixed(6)}° ${lonDir}`
  }

  // Helper function to format frequency
  const formatFrequency = (freq: number | null | undefined) => {
    if (freq === null || freq === undefined) return "Not available"
    return `${(freq / 1000000).toFixed(6)} MHz`
  }

  const metadataItems = [
    [<Wifi strokeWidth={1} size={20} />, "Radio System", transmission.sys_radio_system || "Not available"],
    [<Drill strokeWidth={1} size={20} />, "Site", transmission.sys_site || "Not available"],
    [<FileText strokeWidth={1} size={20} />, "Channel Name", transmission.sys_channel_name || "Not available"],
    [<MessageCircle strokeWidth={1} size={20} />, "Talk Group", transmission.sys_tg_name?.trim() || "Not available"],
    [<Hash strokeWidth={1} size={20} />, "Group ID", transmission.sys_tg_number?.toString() || "Not available"],
    [<List strokeWidth={1} size={20} />, "Channel Type", transmission.channelable_type || "Not available"],
    [<Radio strokeWidth={1} size={20} />, "RX Frequency", formatFrequency(transmission.rx_frequency_hz)],
    [<Grid strokeWidth={1} size={20} />, "Radio ID", transmission.tx_radio_id?.toString() || "Not available"],
    [<MapPin strokeWidth={1} size={20} />, "TX Lat/Lon", formatCoordinates(transmission.tx_latitude, transmission.tx_longitude)],
    [<MapPin strokeWidth={1} size={20} />, "RX Lat/Lon", formatCoordinates(transmission.rip_rx_latitude, transmission.rip_rx_longitude)],
  ]

  return (
    <Table>
      <TableBody>
        {metadataItems.map((item, i) => (
          <TableRow key={`metadata-card-row${i}`} className="border-b-1 text-xs leading-1 h-7">
            <TableCell className="py-[1px] w-[32px]">{item[0]}</TableCell>
            <TableCell>{item[1]}</TableCell>
            <TableCell className={`text-right ${
              item[2] === "Not available" ? "text-gray-400" : 
              item[1] === "Talk Group" ? "text-green-500" : ""
            }`}>
              {item[2]}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

interface MetadataProps {
  className?: string
}

export function Metadata({ className }: MetadataProps) {
  const { selectedTransmission } = usePlaylistStore()
  
  return (
    <Card className={`w-full max-w-sm ${className}`}>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 h-full justify-center items-center flex text-slate-600 dark:text-slate-300">
        {selectedTransmission ? (
          <MetadataPresent transmission={selectedTransmission} />
        ) : (
          <MetadataEmpty />
        )}
      </CardContent>
    </Card>
  )
}
