import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toZonedTime } from 'date-fns-tz'
import type { TimeRange } from '@/stores/playlistStore'
import type { RadioTranscription } from './transcriptions'

// Types
export interface RadioTransmission {
  id: string
  channelable_type: string
  channelable_id: string
  confidence?: number
  dsp_processed_at?: string
  dsp_engine_id?: string
  rip_demod_version?: string
  rip_rx_latitude?: number
  rip_rx_longitude?: number
  radio_intercept_id: string
  rx_channel_number?: number
  rx_decoder?: string
  rx_ended_at?: string
  rx_frequency_hz?: number
  rx_signal_quality?: number
  rx_started_at?: string
  stt_engine_id?: string
  sys_channel_name?: string
  sys_radio_system?: string
  sys_site?: string
  sys_tg_name?: string
  sys_tg_number?: number
  transcribed_at?: string
  tx_latitude?: number
  tx_longitude?: number
  tx_radio_id?: number
  audio_file_url?: string
  audio_local_file_path?: string
  created_at: string
  updated_at: string
  radio_transcriptions?: RadioTranscription[]
}

export interface CreateTransmissionData {
  audio_file: {
    content: string // base64 encoded
    file_name: string
    content_type: string
  }
  dsp_engine_id?: string
  rip_demod_version?: string
  rip_rx_latitude?: number
  rip_rx_longitude?: number
  rx_channel_number?: number
  rx_decoder?: string
  rx_ended_at?: string
  rx_frequency_hz?: number
  rx_signal_quality?: number
  rx_started_at?: string
  stt_engine_id?: string
  sys_channel_name?: string
  sys_radio_system?: string
  sys_site?: string
  sys_tg_name?: string
  sys_tg_number?: string
  tx_latitude?: number
  tx_longitude?: number
  radio_intercept_id: string
  tx_radio_id?: number
}

export interface UpdateTransmissionData {
  sys_radio_system?: string
}

export interface TransmissionSearchParams {
  page?: number
  per_page?: number
  audio_filename?: string
  start_ts?: string // YYYY-MM-DD format
  end_ts?: string // YYYY-MM-DD format
  radio_intercept_id?: string
  talkgroup_name?: string
  channel_ids?: string[] // Array of channel IDs - API client converts to channel_ids[]=id1&channel_ids[]=id2
  sort_direction?: 'asc' | 'desc'
}

export interface PaginatedTransmissions {
  radio_transmissions: RadioTransmission[]
  meta: {
    links: {
      first: string
      last: string
      prev: string | null
      next: string | null
    }
  }
}

// Convert time range to UTC for API calls
const convertTimeRangeToUTC = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return {
    start: start.toISOString(), // Already in UTC
    end: end.toISOString()      // Already in UTC
  }
}

// Query keys
export const transmissionKeys = {
  all: ['radio_transmissions'] as const,
  lists: () => [...transmissionKeys.all, 'list'] as const,
  list: (filters: string) => [...transmissionKeys.lists(), { filters }] as const,
  details: () => [...transmissionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transmissionKeys.details(), id] as const,
  search: (params: string) => [...transmissionKeys.all, 'search', params] as const,
  byChannel: (channelId: string) => [...transmissionKeys.all, 'channel', channelId] as const,
  byTimeRange: (start: string, end: string) => [...transmissionKeys.all, 'timerange', start, end] as const,
}

// Query hooks
export function useTransmissions(params?: {
  page?: number
  per_page?: number
  sort_direction?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: transmissionKeys.list(JSON.stringify(params || {})),
    queryFn: () => api.get<PaginatedTransmissions>('/radio/transmissions', params),
    staleTime: 30 * 1000, // 30 seconds for real-time data
    refetchInterval: 10 * 1000, // Refetch every 10 seconds
  })
}

export function useTransmission(id: string) {
  return useQuery({
    queryKey: transmissionKeys.detail(id),
    queryFn: () => api.get<{ radio_transmission: RadioTransmission }>(`/radio/transmissions/${id}`),
    enabled: !!id,
  })
}

export function useSearchTransmissions(params: TransmissionSearchParams) {
  return useQuery({
    queryKey: transmissionKeys.search(JSON.stringify(params)),
    queryFn: () => {
      // Convert time range to UTC if provided
      const apiParams = { ...params }
      if (params.start_ts && params.end_ts) {
        const utcTimeRange = convertTimeRangeToUTC(params.start_ts, params.end_ts)
        apiParams.start_ts = utcTimeRange.start
        apiParams.end_ts = utcTimeRange.end
      }
      return api.get<PaginatedTransmissions>('/radio/transmissions/search', apiParams)
    },
    staleTime: 30 * 1000,
    refetchInterval: 10 * 1000,
  })
}

export function useTransmissionsByChannel(channelId: string) {
  return useQuery({
    queryKey: transmissionKeys.byChannel(channelId),
    queryFn: () => api.get<PaginatedTransmissions>(`/radio/trunking_channels/${channelId}/transmissions`),
    enabled: !!channelId,
    staleTime: 30 * 1000,
    refetchInterval: 10 * 1000,
  })
}

export function useTransmissionsByTimeRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: transmissionKeys.byTimeRange(startDate, endDate),
    queryFn: () => {
      const utcTimeRange = convertTimeRangeToUTC(startDate, endDate)
      return api.get<PaginatedTransmissions>('/radio/transmissions/search', {
        start_ts: utcTimeRange.start,
        end_ts: utcTimeRange.end,
      })
    },
    enabled: !!startDate && !!endDate,
    staleTime: 30 * 1000,
    refetchInterval: 10 * 1000,
  })
}

export function useTransmissionsForChannels(
  channelIds: string[], 
  timeRange?: TimeRange,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['transmissions', 'channels', channelIds, timeRange ? {
      start: timeRange.start.toISOString(),
      end: timeRange.end.toISOString()
    } : undefined],
    queryFn: async () => {
      if (!channelIds.length || !timeRange) {
        return { radio_transmissions: [], meta: { links: { first: '', last: '', prev: null, next: null } } }
      }

      const utcTimeRange = convertTimeRangeToUTC(timeRange.start.toISOString(), timeRange.end.toISOString())

      const params: TransmissionSearchParams = {
        per_page: 1000, // Get all transmissions in time range
        channel_ids: channelIds,
        start_ts: utcTimeRange.start,
        end_ts: utcTimeRange.end,
        sort_direction: 'asc' // Chronological order
      }

      return api.get<PaginatedTransmissions>('/radio/transmissions/search', params)
    },
    enabled: enabled && channelIds.length > 0 && !!timeRange,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 10 * 1000, // 10 seconds
  })
}

export function useInfiniteTransmissionsForChannels(
  channelIds: string[], 
  timeRange?: TimeRange,
  enabled: boolean = true
) {
  return useInfiniteQuery({
    queryKey: ['transmissions', 'infinite', 'channels', channelIds, timeRange ? {
      start: timeRange.start.toISOString(),
      end: timeRange.end.toISOString()
    } : undefined],
    queryFn: async ({ pageParam = 1 }) => {
      if (!channelIds.length || !timeRange) {
        return { radio_transmissions: [], meta: { links: { first: '', last: '', prev: null, next: null } } }
      }

      const utcTimeRange = convertTimeRangeToUTC(timeRange.start.toISOString(), timeRange.end.toISOString())

      // Build query parameters manually to handle channel_ids array correctly
      const queryParams = new URLSearchParams()
      queryParams.append('page', pageParam.toString())
      queryParams.append('per_page', '20')
      queryParams.append('start_ts', utcTimeRange.start)
      queryParams.append('end_ts', utcTimeRange.end)
      queryParams.append('sort_direction', 'asc')
      
      // Add channel_ids as separate parameters
      channelIds.forEach(id => {
        queryParams.append('channel_ids[]', id)
      })

      // Debug: Log the API parameters
      console.log('API call params:', Object.fromEntries(queryParams))

      const result = await api.get<PaginatedTransmissions>(`/radio/transmissions/search?${queryParams.toString()}`)
      
      // Debug: Log the API response
      console.log('API response - talk groups:', result.radio_transmissions?.map(tx => tx.sys_tg_name) || [])
      
      return result
    },
    enabled: enabled && channelIds.length > 0 && !!timeRange,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 10 * 1000, // 10 seconds
    getNextPageParam: (lastPage, allPages) => {
      // Check if there's a next page based on the meta links
      if (lastPage.meta?.links?.next) {
        return allPages.length + 1
      }
      
      // Fallback: check if we got a full page of results (20 items)
      // If we got less than 20 items, we've reached the end
      if (lastPage.radio_transmissions && lastPage.radio_transmissions.length < 20) {
        return undefined
      }
      
      // If we got exactly 20 items, there might be more
      return allPages.length + 1
    },
    initialPageParam: 1,
  })
}

// Mutation hooks
export function useCreateTransmission() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateTransmissionData) => 
      api.post<{ radio_transmission: RadioTransmission }>('/radio/transmissions', { radio_transmission: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transmissionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transmissionKeys.all })
    },
  })
}

export function useUpdateTransmission() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransmissionData }) => 
      api.patch<{ radio_transmission: RadioTransmission }>(`/radio/transmissions/${id}`, { radio_transmission: data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: transmissionKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: transmissionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transmissionKeys.all })
    },
  })
}

export function useDeleteTransmission() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => api.delete(`/radio/transmissions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transmissionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transmissionKeys.all })
    },
  })
}
