import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { TimeRange } from '@/stores/playlistStore'

// Types for timeline summary data
export interface TransmissionSummary {
  channelId: string
  channelName: string
  channelColor: string
  transmissionCount: number
  transmissions: Array<{
    id: string
    startTime: string
    endTime: string
    duration: number // in milliseconds
  }>
}

export interface TimelineSummary {
  totalTransmissions: number
  activeChannels: number
  timeSpan: number // in minutes
  channelSummaries: TransmissionSummary[]
}

// Convert time range to UTC for API calls
const convertTimeRangeToUTC = (timeRange: TimeRange) => {
  return {
    start: timeRange.start.toISOString(),
    end: timeRange.end.toISOString()
  }
}

// Query keys
export const transmissionSummaryKeys = {
  all: ['transmission_summary'] as const,
  timeline: (channelIds: string[], timeRange: TimeRange) => 
    [...transmissionSummaryKeys.all, 'timeline', channelIds, {
      start: timeRange.start.toISOString(),
      end: timeRange.end.toISOString()
    }] as const,
}

// Hook to get timeline summary data for channels
export function useTransmissionTimelineSummary(
  channelIds: string[], 
  timeRange?: TimeRange,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: transmissionSummaryKeys.timeline(channelIds, timeRange!),
    queryFn: async (): Promise<TimelineSummary> => {
      if (!channelIds.length || !timeRange) {
        return {
          totalTransmissions: 0,
          activeChannels: 0,
          timeSpan: 0,
          channelSummaries: []
        }
      }

      const utcTimeRange = convertTimeRangeToUTC(timeRange)
      const timeSpanMinutes = Math.round((timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60))

      try {
        // Get all transmissions for the channels in the time range
        // Use a large per_page to get all transmissions in one call
        const queryParams = new URLSearchParams()
        queryParams.append('per_page', '10000') // Large number to get all transmissions
        queryParams.append('start_ts', utcTimeRange.start)
        queryParams.append('end_ts', utcTimeRange.end)
        queryParams.append('sort_direction', 'asc')
        
        // Add channel_ids as separate parameters
        channelIds.forEach(id => {
          queryParams.append('channel_ids[]', id)
        })

        const response = await api.get(`/radio/transmissions/search?${queryParams.toString()}`) as any
        
        // Handle different possible response structures
        const transmissions = response?.data?.radio_transmissions || 
                           response?.radio_transmissions ||
                           response?.data ||
                           []

        // Group transmissions by channel
        const channelMap = new Map<string, TransmissionSummary>()

        transmissions.forEach((transmission: any) => {
          const channelId = transmission.channel_details?.id
          if (!channelId) return

          const channelName = transmission.sys_tg_name || transmission.sys_channel_name || `Channel ${channelId}`
          const channelColor = transmission.channel_details?.channel_attribute?.configuration?.color || '#666666'
          
          const startTime = transmission.rx_started_at
          const endTime = transmission.rx_ended_at
          const duration = new Date(endTime).getTime() - new Date(startTime).getTime()

          if (!channelMap.has(channelId)) {
            channelMap.set(channelId, {
              channelId,
              channelName,
              channelColor,
              transmissionCount: 0,
              transmissions: []
            })
          }

          const summary = channelMap.get(channelId)!
          summary.transmissionCount++
          summary.transmissions.push({
            id: transmission.id,
            startTime,
            endTime,
            duration
          })
        })

        const channelSummaries = Array.from(channelMap.values())
        const totalTransmissions = transmissions.length
        const activeChannels = channelSummaries.length

        return {
          totalTransmissions,
          activeChannels,
          timeSpan: timeSpanMinutes,
          channelSummaries
        }
      } catch (error) {
        console.error('Failed to fetch transmission timeline summary:', error)
        return {
          totalTransmissions: 0,
          activeChannels: 0,
          timeSpan: timeSpanMinutes,
          channelSummaries: []
        }
      }
    },
    enabled: enabled && channelIds.length > 0 && !!timeRange,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 10 * 1000, // 10 seconds
  })
}

// Hook to get transmission count by channel (lighter weight)
export function useTransmissionCountsByChannel(
  channelIds: string[], 
  timeRange?: TimeRange,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['transmission_counts', 'channels', channelIds, timeRange ? {
      start: timeRange.start.toISOString(),
      end: timeRange.end.toISOString()
    } : undefined],
    queryFn: async (): Promise<Record<string, number>> => {
      if (!channelIds.length || !timeRange) {
        return {}
      }

      const utcTimeRange = convertTimeRangeToUTC(timeRange)

      try {
        // Get all transmissions for the channels in the time range
        const queryParams = new URLSearchParams()
        queryParams.append('per_page', '10000') // Large number to get all transmissions
        queryParams.append('start_ts', utcTimeRange.start)
        queryParams.append('end_ts', utcTimeRange.end)
        queryParams.append('sort_direction', 'asc')
        
        // Add channel_ids as separate parameters
        channelIds.forEach(id => {
          queryParams.append('channel_ids[]', id)
        })

        const response = await api.get(`/radio/transmissions/search?${queryParams.toString()}`) as any
        
        // Handle different possible response structures
        const transmissions = response?.data?.radio_transmissions || 
                           response?.radio_transmissions ||
                           response?.data ||
                           []

        // Count transmissions by channel
        const counts: Record<string, number> = {}
        
        transmissions.forEach((transmission: any) => {
          const channelId = transmission.channel_details?.id
          if (channelId) {
            counts[channelId] = (counts[channelId] || 0) + 1
          }
        })

        return counts
      } catch (error) {
        console.error('Failed to fetch transmission counts:', error)
        return {}
      }
    },
    enabled: enabled && channelIds.length > 0 && !!timeRange,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 10 * 1000, // 10 seconds
  })
}
