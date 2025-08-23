import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Types
export interface RadioConventionalChannel {
  id: string
  name: string
  frequency_hz: number
  created_at: string
  updated_at: string
}

export interface RadioTrunkingChannel {
  id: string
  tg_name: string
  tg_number: string
  created_at: string
  updated_at: string
}

export interface ChannelDetails {
  id: string
  name: string
  channel_type: 'conventional' | 'trunking'
  tx_count?: number
  last_transmission?: string
  frequency_hz?: number
  tg_name?: string
  tg_number?: string
}

// Query keys
export const channelKeys = {
  all: ['channels'] as const,
  details: () => [...channelKeys.all, 'detail'] as const,
  detail: (id: string) => [...channelKeys.details(), id] as const,
  conventional: () => [...channelKeys.all, 'conventional'] as const,
  conventionalDetail: (id: string) => [...channelKeys.conventional(), id] as const,
  trunking: () => [...channelKeys.all, 'trunking'] as const,
  trunkingDetail: (id: string) => [...channelKeys.trunking(), id] as const,
}

// Query hooks
export function useConventionalChannel(id: string) {
  return useQuery({
    queryKey: channelKeys.conventionalDetail(id),
    queryFn: () => api.get<{ radio_conventional_channel: RadioConventionalChannel }>(`/radio/conventional_channels/${id}`),
    enabled: !!id,
  })
}

export function useTrunkingChannel(id: string) {
  return useQuery({
    queryKey: channelKeys.trunkingDetail(id),
    queryFn: () => api.get<{ radio_trunking_channel: RadioTrunkingChannel }>(`/radio/trunking_channels/${id}`),
    enabled: !!id,
  })
}

// Hook to get channel details by type and ID
export function useChannelDetails(channelId: string, channelType: string) {
  const conventionalQuery = useConventionalChannel(channelId)
  const trunkingQuery = useTrunkingChannel(channelId)

  // Determine which query to use based on channel type
  const isConventional = channelType.includes('Conventional')
  const isTrunking = channelType.includes('Trunking')

  if (isConventional) {
    return {
      data: conventionalQuery.data?.radio_conventional_channel,
      isLoading: conventionalQuery.isLoading,
      error: conventionalQuery.error,
    }
  }

  if (isTrunking) {
    return {
      data: trunkingQuery.data?.radio_trunking_channel,
      isLoading: trunkingQuery.isLoading,
      error: trunkingQuery.error,
    }
  }

  return {
    data: null,
    isLoading: false,
    error: new Error('Unknown channel type'),
  }
}

// Hook to get transmission count for a channel
export function useChannelTransmissionCount(channelId: string) {
  return useQuery({
    queryKey: ['transmissions', 'count', channelId],
    queryFn: () => api.get<{ count: number }>(`/radio/transmissions/count`, { 
      params: { channel_id: channelId } 
    }),
    enabled: !!channelId,
  })
}
