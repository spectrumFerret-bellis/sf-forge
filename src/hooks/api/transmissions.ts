import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

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
  channel_ids?: string[]
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
    queryFn: () => api.get<PaginatedTransmissions>('/radio/transmissions/search', params),
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
    queryFn: () => api.get<PaginatedTransmissions>('/radio/transmissions/search', {
      start_ts: startDate,
      end_ts: endDate,
    }),
    enabled: !!startDate && !!endDate,
    staleTime: 30 * 1000,
    refetchInterval: 10 * 1000,
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
