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
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from './../../components/custom/dataTable'
import { usePlaylistStore } from '@/stores/playlistStore'
import { usePlaylistChannels } from '@/hooks/api/playlistChannels'
import type { PlaylistChannelWithDetails } from '@/hooks/api/playlistChannels'
import { useEffect } from 'react'
import { getChannelColorSafe } from '@/lib/colorUtils'

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

const ChannelsLoading = () => {
  return (<div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <Antenna size={36} strokeWidth={1} />
      </div>

      <h3 className="font-bold mt-4 mb-2">Loading Channels</h3>
      
      {/* 3-dot bounce animation */}
      <div className="flex justify-center space-x-1 mt-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
            style={{
              animation: 'bounce-dots 1.4s infinite ease-in-out',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Fetching channel details...
      </p>
    </div>)
}

const ChannelsPresent = ({ channels }: { channels: PlaylistChannelWithDetails[] }) => {
  const { selectedChannelIds, selectAllChannels, toggleChannelSelection, setChannelColors, setTalkGroupColors, setChannelNameToColorIndex } = usePlaylistStore()

  // Auto-select all channels and set channel colors when channels are loaded
  useEffect(() => {
    if (channels.length > 0) {
      // Sort channels by name to ensure consistent order
      const sortedChannels = [...channels].sort((a, b) => a.channel_name.localeCompare(b.channel_name))
      const channelIds = sortedChannels.map(channel => channel.channel_id)
      const talkGroups = sortedChannels.map(channel => channel.channel_name.trim())
      const channelNames = sortedChannels.map(channel => channel.channel_name.trim())
      
      // Only set channel colors if they haven't been set yet for this playlist
      const { channelColors, talkGroupColors, channelNameToColorIndex } = usePlaylistStore.getState()
      if (Object.keys(channelColors).length === 0) {
        setChannelColors(channelIds)
      }
      if (Object.keys(talkGroupColors).length === 0) {
        setTalkGroupColors(talkGroups)
      }
      if (Object.keys(channelNameToColorIndex).length === 0) {
        setChannelNameToColorIndex(channelNames)
      }
      
      // Auto-select all channels if none are selected
      if (selectedChannelIds.length === 0) {
        selectAllChannels(channelIds)
      }
    }
  }, [channels, selectedChannelIds.length, selectAllChannels, setChannelColors, setTalkGroupColors, setChannelNameToColorIndex])

  // Column definitions
  const columns: ColumnDef<PlaylistChannelWithDetails>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: boolean) => {
            const channelIds = channels.map(channel => channel.channel_id)
            if (value) {
              selectAllChannels(channelIds)
            } else {
              selectAllChannels([])
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedChannelIds.includes(row.original.channel_id)}
          onCheckedChange={() => toggleChannelSelection(row.original.channel_id)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "channel_type",
      header: "Type",
      enableSorting: true,
      cell: ({ row }) => {
        const type = row.getValue("channel_type") as string
        return (
          <Badge variant="outline" className="text-xs">
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "channel_name",
      header: "Name",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("channel_name")}
        </div>
      ),
    },
    {
      accessorKey: "tx_count",
      header: "TX",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-center font-mono text-sm">
          {row.getValue("tx_count")}
        </div>
      ),
    },
  ]

  return (
    <div className="w-full">
      <Table className="rounded-none">
        <TableHeader className="h-[10px] bg-muted text-black py-1">
          <TableRow>
            <TableHead className="w-12 text-black dark:text-white pl-[20px]">
              <Checkbox
                checked={selectedChannelIds.length === channels.length && channels.length > 0}
                onCheckedChange={(value: boolean) => {
                  const channelIds = channels.map(channel => channel.channel_id)
                  if (value) {
                    selectAllChannels(channelIds)
                  } else {
                    selectAllChannels([])
                  }
                }}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="text-left text-black dark:text-white">Type</TableHead>
            <TableHead className="text-left text-black dark:text-white">Name</TableHead>
            <TableHead className="text-left text-black dark:text-white">TX</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {channels
            .sort((a, b) => a.channel_name.localeCompare(b.channel_name))
            .map((channel, index) => {
            const { getChannelColor: getStoreChannelColor } = usePlaylistStore.getState()
            const channelColor = getStoreChannelColor(channel.channel_id)
            const isSelected = selectedChannelIds.includes(channel.channel_id)
            
            return (
              <TableRow 
                key={channel.channel_id}
                className="hover:opacity-80 transition-opacity outline-offset-[10px]"
                style={{ backgroundColor: `${channelColor}20` }} // 20% opacity
              >
                <TableCell className="h-[5px] py-1 relative pl-[20px]">
                  <div className="absolute left-0 top-0 w-[10px] h-full" style={{
                    borderLeft: `6px solid ${channelColor}`,
                  }} />
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleChannelSelection(channel.channel_id)}
                    aria-label="Select row"
                  />
                </TableCell>
                <TableCell className="h-[5px] py-1">
                  <Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-850">
                    {channel.channel_type}
                  </Badge>
                </TableCell>
                <TableCell className="h-[5px] py-1">
                  <div className="font-medium">
                    {channel.channel_name}
                  </div>
                </TableCell>
                <TableCell className="h-[5px] py-1">
                  <div className="text-left font-mono text-sm">
                    {channel.tx_count}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

interface ChannelsProps {
  className?: string
}

export function Channels({ className }: ChannelsProps) {
  const { selectedPlaylist, timeRange } = usePlaylistStore()
  const { data: channelsData, isLoading, error } = usePlaylistChannels(selectedPlaylist?.id || '', timeRange || undefined)
  
  return (
    <Card className={`w-full max-w-sm ${className || ''}`}>
      <CardHeader>
        <CardTitle>Channels</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 h-full justify-center items-center flex text-slate-600 dark:text-slate-300">
        {!selectedPlaylist ? (
          <ChannelsEmpty />
        ) : isLoading ? (
          <ChannelsLoading />
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500">Error loading channels</p>
          </div>
        ) : channelsData?.channels && channelsData.channels.length > 0 ? (
          <ChannelsPresent channels={channelsData.channels} />
        ) : (
          <div className="text-center">
            <p>No channels found in this playlist</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
