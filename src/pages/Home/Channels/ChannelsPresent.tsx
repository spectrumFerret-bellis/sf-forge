import { useMemo, useEffect } from 'react'
import type { PlaylistChannelWithDetails } from '@/hooks/api/playlistChannels'

import { usePlaylistStore }                from '@/stores/playlistStore'

import { Checkbox }                        from "@/components/ui/checkbox"
import * as Table                          from "@/components/ui/table"





export function ChannelsPresent ({ channels }: { channels: PlaylistChannelWithDetails[] }) {
  const selectedChannelIds = usePlaylistStore(state => state.selectedChannelIds)
  const selectAllChannels = usePlaylistStore(state => state.selectAllChannels)
  const toggleChannelSelection = usePlaylistStore(state => state.toggleChannelSelection)
  const initializeChannelData = usePlaylistStore(state => state.initializeChannelData)

  const channelColors = usePlaylistStore(state => state.channelColors)
  const getChannelColor = usePlaylistStore(state => state.getChannelColor)

  // Initialize channel data when channels change - store handles the logic internally
  useEffect(() => {
    if (channels.length > 0) {
      initializeChannelData(channels)
    }
  }, [channels, initializeChannelData])

  // Memoize sorted channels to prevent unnecessary re-sorting
  const sortedChannels = useMemo(() => 
    [...channels].sort((a, b) => a.channel_name.localeCompare(b.channel_name)),
    [channels]
  )

  // Memoize channel IDs for the select all functionality
  const channelIds = useMemo(() => 
    sortedChannels.map(channel => channel.channel_id),
    [sortedChannels]
  )

  return (
    <div className="w-full">
      <Table.Table className="rounded-none">
        <Table.TableHeader className="h-[10px] bg-muted text-black py-1">
          <Table.TableRow>
            <Table.TableHead className="w-12 text-black dark:text-white pl-[20px]">
              <Checkbox
                checked={selectedChannelIds.length === channels.length && channels.length > 0}
                onCheckedChange={(value: boolean) => {
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
          {sortedChannels
            .map((channel) => {
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
                    <div className="text-xs bg-gray-100 dark:bg-gray-850 border border-gray-300 dark:border-gray-600 rounded px-2 py-1">
                      {channel.channel_type}
                    </div>
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