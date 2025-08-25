import React, { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AudioLines } from 'lucide-react'
import { usePlaylistStore } from '@/stores/playlistStore'
import { useInfiniteTransmissionsForChannels } from '@/hooks/api/transmissions'
import type { RadioTransmission } from '@/hooks/api/transmissions'
import { formatInTimeZone } from 'date-fns-tz'
import { DataTable } from '@/components/custom/dataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { getChannelColorSafe } from '@/lib/colorUtils'

// Component to render talk group with channel color
const TalkGroupCell = ({ channelId, talkGroupName }: { channelId: string, talkGroupName: string }) => {
  const { getChannelColorByTalkGroup } = usePlaylistStore.getState()
  const channelColor = getChannelColorByTalkGroup(talkGroupName)
  
  return (
    <span 
      className="font-medium"
      style={{ color: channelColor }}
    >
      {talkGroupName?.trim() || 'Unknown'}
    </span>
  )
}

// Helper function to format duration
const formatDuration = (startTime: string, endTime: string): string => {
  try {
    if (!startTime || !endTime) return '0s'
    
    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    const durationMs = end - start
    
    if (isNaN(durationMs) || durationMs < 0) return '0s'
    
    const seconds = Math.floor(durationMs / 1000)
    if (seconds < 60) return `${seconds}s`
    
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  } catch {
    return '0s'
  }
}

// Component to display transcription from transmission data
const TranscriptionCell = ({ transmission }: { transmission: RadioTransmission }) => {
  const transcription = transmission.radio_transcriptions?.[0]?.transcription
  
  if (!transcription) {
    return <span className="text-gray-400 dark:text-gray-500 italic">No transcription</span>
  }
  
  return <span>{transcription}</span>
}

interface TransmissionsTableProps {
  className?: string
  onTransmissionSelect?: (transmission: RadioTransmission | null) => void
  selectedTransmissionId?: string | null
}

const TransmissionsTableEmpty = () => {
  return (
    <div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <AudioLines size={36} strokeWidth={1} />
      </div>
      <h3 className="font-bold mt-4 mb-2">No transmissions</h3>
      <p>Select channels and time range to view transmissions</p>
    </div>
  )
}

const TransmissionsTableLoading = () => {
  return (
    <div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <AudioLines size={36} strokeWidth={1} />
      </div>
      <h3 className="font-bold mt-4 mb-2">Loading Transmissions</h3>
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
        Fetching transmission data...
      </p>
    </div>
  )
}

export function TransmissionsTable({ className, onTransmissionSelect, selectedTransmissionId }: TransmissionsTableProps) {
  const { selectedPlaylist, timeRange, selectedChannelIds } = usePlaylistStore()
  
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteTransmissionsForChannels(
    selectedChannelIds, // Use selectedChannelIds from the store
    timeRange || undefined,
    !!selectedPlaylist && selectedChannelIds.length > 0 && !!timeRange
  )

  // Flatten all pages of transmissions into a single array
  const transmissions = useMemo(() => {
    if (!data?.pages) return []
    const flattened = data.pages.flatMap(page => page.radio_transmissions || [])
    console.log('Transmissions data:', {
      pages: data.pages.length,
      totalTransmissions: flattened.length,
      hasNextPage,
      isFetchingNextPage,
      pageCounts: data.pages.map((page, index) => ({
        page: index + 1,
        count: page.radio_transmissions?.length || 0,
        firstId: page.radio_transmissions?.[0]?.id,
        lastId: page.radio_transmissions?.[page.radio_transmissions.length - 1]?.id
      }))
    })
    return flattened
  }, [data?.pages, hasNextPage, isFetchingNextPage])

  // Define columns for the DataTable
  const columns: ColumnDef<RadioTransmission>[] = useMemo(() => [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const tx = row.original
        return tx.rx_started_at ? formatInTimeZone(new Date(tx.rx_started_at), timeRange?.timezone || 'UTC', 'MMM dd, yyyy') : 'N/A'
      },
    },
    {
      accessorKey: 'time',
      header: 'Time',
      cell: ({ row }) => {
        const tx = row.original
        return tx.rx_started_at ? formatInTimeZone(new Date(tx.rx_started_at), timeRange?.timezone || 'UTC', 'HH:mm:ss') : 'N/A'
      },
    },
    {
      accessorKey: 'sys_tg_name',
      header: 'Talk Group',
      cell: ({ row }) => {
        const tx = row.original
        return (
          <TalkGroupCell 
            channelId={tx.channelable_id || ''} 
            talkGroupName={tx.sys_tg_name || ''} 
          />
        )
      },
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: ({ row }) => {
        const tx = row.original
        return formatDuration(tx.rx_started_at || '', tx.rx_ended_at || tx.rx_started_at || '')
      },
    },
    {
      accessorKey: 'transcription',
      header: 'Transcription',
      cell: ({ row }) => {
        const tx = row.original
        return (
          <div className="max-w-md truncate">
            <TranscriptionCell transmission={tx} />
          </div>
        )
      },
    },
  ], [timeRange?.timezone])

  const handleLoadMore = useCallback(async () => {
    console.log('handleLoadMore called:', { hasNextPage, isFetchingNextPage })
    if (hasNextPage && !isFetchingNextPage) {
      console.log('Fetching next page...')
      await fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <Card className={`w-full ${className || ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          TX Log
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {transmissions.length} transmissions
            </Badge>
            {selectedChannelIds.length > 0 && (
              <Badge variant="secondary">
                {selectedChannelIds.length} channel{selectedChannelIds.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-5">
        {!selectedPlaylist ? (
          <TransmissionsTableEmpty />
        ) : !timeRange ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Please set a time range to view transmissions
          </div>
        ) : selectedChannelIds.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Please select at least one channel to view transmissions
          </div>
        ) : isLoading ? (
          <TransmissionsTableLoading />
        ) : error ? (
          <div className="text-center text-red-500">
            Error loading transmissions
          </div>
        ) : (
          <div className="w-full">
            {/* Search input */}
            <div className="flex items-center py-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by talk group..."
                  className="pl-8 max-w-sm"
                />
              </div>
            </div>

            {/* Table with infinite scroll */}
            <div 
              className="overflow-auto border rounded-md"
              style={{ height: '400px' }}
              onScroll={(e) => {
                const target = e.target as HTMLDivElement
                const { scrollTop, scrollHeight, clientHeight } = target
                const threshold = 100
                if (scrollTop + clientHeight >= scrollHeight - threshold && hasNextPage && !isFetchingNextPage) {
                  handleLoadMore()
                }
              }}
            >
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-left p-3 font-medium">Time</th>
                    <th className="text-left p-3 font-medium">Talk Group</th>
                    <th className="text-left p-3 font-medium">Duration</th>
                    <th className="text-left p-3 font-medium">Transcription</th>
                  </tr>
                </thead>
                <tbody>
                  {transmissions.map((tx) => {
                    const { getChannelColorByTalkGroup } = usePlaylistStore.getState()
                    const channelColor = getChannelColorByTalkGroup(tx.sys_tg_name || '')
                    
                    const isSelected = selectedTransmissionId === tx.id
                    return (
                      <tr 
                        key={tx.id}
                        className={`border-t hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                          isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        style={{ borderLeftColor: channelColor, borderLeftWidth: '4px', backgroundColor: `${channelColor}20` }}
                        onClick={() => onTransmissionSelect?.(tx)}
                      >
                        <td className="px-3 py-0">
                          {tx.rx_started_at ? formatInTimeZone(new Date(tx.rx_started_at), timeRange?.timezone || 'UTC', 'MMM dd, yyyy') : 'N/A'}
                        </td>
                        <td className="px-3 py-0">
                          {tx.rx_started_at ? formatInTimeZone(new Date(tx.rx_started_at), timeRange?.timezone || 'UTC', 'HH:mm:ss') : 'N/A'}
                        </td>
                        <td className="px-3 py-0">
                          <span 
                            className="font-medium"
                            style={{ color: channelColor }}
                          >
                            {tx.sys_tg_name?.trim() || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-3 py-0">
                          {formatDuration(tx.rx_started_at || '', tx.rx_ended_at || tx.rx_started_at || '')}
                        </td>
                        <td className="px-3 py-0">
                          <div className="max-w-md truncate">
                            <TranscriptionCell transmission={tx} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {isFetchingNextPage && (
                    <tr>
                      <td colSpan={5} className="p-3 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-gray-100"></div>
                          <span className="ml-2">Loading more...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
