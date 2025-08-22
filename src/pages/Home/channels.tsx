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

import { Antenna, MapPin } from 'lucide-react'
import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from './../../components/custom/dataTable'

const ChannelsEmpty = () => {
  return (<div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <Antenna size={36} strokeWidth={1} />
      </div>

      <h3 className="font-bold mt-4 mb-2">No playlist selected</h3>
      <p>
        Select a playlist to view available channels
      </p>
    </div>)
}

const ChannelsPresent = () => {
  // Sample data type
  interface Channel {
    id: string
    name: string
    txAmnt: number
  }

  // Sample data
  const sampleData: Channel[] = [
    { id: 'law1', name: 'Law 1', txAmnt: 100 },
    { id: 'avd', name: 'AVD Dispatch', txAmnt: 43 },
    { id: 'fire1', name: 'Fire Ops 1', txAmnt: 1 },
    { id: 'fire2', name: 'Fire Ops 2', txAmnt: 0 },
    { id: 'fire3', name: 'Fire Ops 3', txAmnt: 987 },
    { id: 'fire4', name: 'Fire Ops 4', txAmnt: 43 },
    { id: 'training', name: 'Fire Training', txAmnt: 11 },
    { id: 'dispatch', name: 'Fire Dispatch', txAmnt: 10 },
    { id: 'parks1', name: 'City Parks 1', txAmnt: 8 },
    { id: 'parks2', name: 'City Parks 2', txAmnt: 675 },
  ]

  // Column definitions
  const columns: ColumnDef<Channel>[] = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
    },
    {
      accessorKey: "txAmnt",
      header: "TX",
      enableSorting: true,
    },
  ]

  return (<DataTable
    className="w-full"
    tableClassName="rounded-none"
    headClassName="h-[10px] bg-black text-white py-1"
    rowCellClassName="h-[5px] py-0"
    columns={columns}
    data={sampleData}
    showSearch={false}
    showColumnVisibility={false}
    showPagination={false}
    showSorting={true}
    showRowSelection={true}
  />)
}

export function Channels({ playlist = true, className }) {
  return (
    <Card className={`w-full max-w-sm ${className}`}>
      <CardHeader>
        <CardTitle>Channels</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 h-full justify-center items-center flex text-slate-600 dark:text-slate-300">
        {playlist ?
          <ChannelsPresent playlist={playlist} /> : <ChannelsEmpty />}
      </CardContent>
    </Card>
  )
}
