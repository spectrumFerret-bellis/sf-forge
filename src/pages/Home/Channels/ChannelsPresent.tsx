import { useEffect }                       from 'react'
import type { PlaylistChannelWithDetails } from '@/hooks/api/playlistChannels'
import { type ColumnDef }                  from "@tanstack/react-table"

import { usePlaylistStore }                from '@/stores/playlistStore'

import { Badge }                           from "@/components/ui/badge"
import { Checkbox }                        from "@/components/ui/checkbox"
import * as Table                          from "@/components/ui/table"


export function ChannelsPresent ({ channels }: { channels: PlaylistChannelWithDetails[] }) {
  const setChannelColors = usePlaylistStore(state => state.setChannelColors)
  const setTalkGroupColors = usePlaylistStore(state => state.setTalkGroupColors)
  const setChannelNameToColorIndex = usePlaylistStore(state => state.setChannelNameToColorIndex)
  const selectedChannelIds = usePlaylistStore(state => state.selectedChannelIds)
  const selectAllChannels = usePlaylistStore(state => state.selectAllChannels)
  const toggleChannelSelection = usePlaylistStore(state => state.toggleChannelSelection)

  const channelColors = usePlaylistStore(state => state.channelColors)
  const talkGroupColors = usePlaylistStore(state => state.talkGroupColors)
  const channelNameToColorIndex = usePlaylistStore(state => state.channelNameToColorIndex)
  const getChannelColor = usePlaylistStore(state => state.getChannelColor)

  // Auto-select all channels and set channel colors when channels are loaded
  useEffect(() => {
    if (channels.length > 0) {
      // Sort channels by name to ensure consistent order
      const sortedChannels = [...channels].sort((a, b) => a.channel_name.localeCompare(b.channel_name))
      const channelIds = sortedChannels.map(channel => channel.channel_id)
      const talkGroups = sortedChannels.map(channel => channel.channel_name.trim())
      const channelNames = sortedChannels.map(channel => channel.channel_name.trim())
      
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
  }, [channels, selectedChannelIds.length, selectAllChannels])

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
      <Table.Table className="rounded-none">
        <Table.TableHeader className="h-[10px] bg-muted text-black py-1">
          <Table.TableRow>
            <Table.TableHead className="w-12 text-black dark:text-white pl-[20px]">
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
            </Table.TableHead>
            <Table.TableHead className="text-left text-black dark:text-white">Type</Table.TableHead>
            <Table.TableHead className="text-left text-black dark:text-white">Name</Table.TableHead>
            <Table.TableHead className="text-left text-black dark:text-white">TX</Table.TableHead>
          </Table.TableRow>
        </Table.TableHeader>
        <Table.TableBody>
          {channels
            .sort((a, b) => a.channel_name.localeCompare(b.channel_name))
            .map((channel, index) => {
              const channelColor = getChannelColor(channel.channel_id)
              const isSelected = selectedChannelIds.includes(channel.channel_id)
              
              return (
                <Table.TableRow 
                  key={channel.channel_id}
                  className="hover:opacity-80 transition-opacity outline-offset-[10px]"
                  style={{ backgroundColor: `${channelColor}20` }} // 20% opacity
                >
                  <Table.TableCell className="h-[5px] py-1 relative pl-[20px]">
                    <div className="absolute left-0 top-0 w-[10px] h-full" style={{
                      borderLeft: `6px solid ${channelColor}`,
                    }} />
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleChannelSelection(channel.channel_id)}
                      aria-label="Select row"
                    />
                  </Table.TableCell>
                  <Table.TableCell className="h-[5px] py-1">
                    <Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-850">
                      {channel.channel_type}
                    </Badge>
                  </Table.TableCell>
                  <Table.TableCell className="h-[5px] py-1">
                    <div className="font-medium">
                      {channel.channel_name}
                    </div>
                  </Table.TableCell>
                  <Table.TableCell className="h-[5px] py-1">
                    <div className="text-left font-mono text-sm">
                      {channel.tx_count}
                    </div>
                  </Table.TableCell>
                </Table.TableRow>
              )
            })}
        </Table.TableBody>
      </Table.Table>
    </div>
  )
}