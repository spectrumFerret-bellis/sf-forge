import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Types
export interface RadioTrunkingChannel {
  id: string
  tg_name: string
  tg_number: string
  created_at: string
  updated_at: string
}

export interface RadioTrunkingReceiveChannel {
  id: string
  radio_intercept_id: string
  radio_trunking_channel_id: string
  created_at: string
  updated_at: string
}

export interface ChannelAttribute {
  id: string
  channel_id: string
  attribute_type: string
  attribute_value: string
  created_at: string
  updated_at: string
}

export interface CreateTrunkingChannelData {
  tg_name: string
  tg_number: string
}

export interface UpdateTrunkingChannelData {
  tg_name?: string
  tg_number?: string
}

export interface CreateReceiveChannelData {
  radio_intercept_id: string
  radio_trunking_channel_id: string
}

export interface UpdateReceiveChannelData {
  radio_intercept_id?: string
  radio_trunking_channel_id?: string
}

export interface CreateChannelAttributeData {
  attribute_type: string
  attribute_value: string
}

export interface UpdateChannelAttributeData {
  attribute_type?: string
  attribute_value?: string
}

export interface PaginatedTrunkingChannels {
  radio_trunking_channels: RadioTrunkingChannel[]
  meta: {
    links: {
      first: string
      last: string
      prev: string | null
      next: string | null
    }
  }
}

export interface PaginatedTrunkingReceiveChannels {
  radio_trunking_receive_channels: RadioTrunkingReceiveChannel[]
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
export const trunkingChannelKeys = {
  all: ['radio_trunking_channels'] as const,
  lists: () => [...trunkingChannelKeys.all, 'list'] as const,
  list: (filters: string) => [...trunkingChannelKeys.lists(), { filters }] as const,
  details: () => [...trunkingChannelKeys.all, 'detail'] as const,
  detail: (id: string) => [...trunkingChannelKeys.details(), id] as const,
  attributes: (channelId: string) => [...trunkingChannelKeys.detail(channelId), 'attributes'] as const,
}

export const trunkingReceiveChannelKeys = {
  all: ['radio_trunking_receive_channels'] as const,
  lists: () => [...trunkingReceiveChannelKeys.all, 'list'] as const,
  list: (filters: string) => [...trunkingReceiveChannelKeys.lists(), { filters }] as const,
  details: () => [...trunkingReceiveChannelKeys.all, 'detail'] as const,
  detail: (id: string) => [...trunkingReceiveChannelKeys.details(), id] as const,
}

// Query hooks for Trunking Channels
export function useTrunkingChannels(params?: {
  page?: number
  per_page?: number
}) {
  return useQuery({
    queryKey: trunkingChannelKeys.list(JSON.stringify(params || {})),
    queryFn: () => api.get<PaginatedTrunkingChannels>('/radio/trunking_channels', params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useTrunkingChannel(id: string) {
  return useQuery({
    queryKey: trunkingChannelKeys.detail(id),
    queryFn: () => api.get<{ radio_trunking_channel: RadioTrunkingChannel }>(`/radio/trunking_channels/${id}`),
    enabled: !!id,
  })
}

// Query hooks for Trunking Receive Channels
export function useTrunkingReceiveChannels(params?: {
  page?: number
  per_page?: number
}) {
  return useQuery({
    queryKey: trunkingReceiveChannelKeys.list(JSON.stringify(params || {})),
    queryFn: () => api.get<PaginatedTrunkingReceiveChannels>('/radio/trunking_receive_channels', params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useTrunkingReceiveChannel(id: string) {
  return useQuery({
    queryKey: trunkingReceiveChannelKeys.detail(id),
    queryFn: () => api.get<{ radio_trunking_receive_channel: RadioTrunkingReceiveChannel }>(`/radio/trunking_receive_channels/${id}`),
    enabled: !!id,
  })
}

// Query hook for Channel Attributes
export function useChannelAttributes(channelId: string) {
  return useQuery({
    queryKey: trunkingChannelKeys.attributes(channelId),
    queryFn: () => api.get<{ channel_attributes: ChannelAttribute[] }>(`/radio/trunking_receive_channels/${channelId}/channel_attribute`),
    enabled: !!channelId,
  })
}

// Mutation hooks for Trunking Channels
export function useCreateTrunkingChannel() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateTrunkingChannelData) => 
      api.post<{ radio_trunking_channel: RadioTrunkingChannel }>('/radio/trunking_channels', { radio_trunking_channel: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trunkingChannelKeys.lists() })
    },
  })
}

export function useUpdateTrunkingChannel() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTrunkingChannelData }) => 
      api.patch<{ radio_trunking_channel: RadioTrunkingChannel }>(`/radio/trunking_channels/${id}`, { radio_trunking_channel: data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: trunkingChannelKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: trunkingChannelKeys.lists() })
    },
  })
}

export function useDeleteTrunkingChannel() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => api.delete(`/radio/trunking_channels/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trunkingChannelKeys.lists() })
    },
  })
}

// Mutation hooks for Trunking Receive Channels
export function useCreateTrunkingReceiveChannel() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateReceiveChannelData) => 
      api.post<{ radio_trunking_receive_channel: RadioTrunkingReceiveChannel }>('/radio/trunking_receive_channels', { radio_trunking_receive_channel: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trunkingReceiveChannelKeys.lists() })
    },
  })
}

export function useUpdateTrunkingReceiveChannel() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReceiveChannelData }) => 
      api.patch<{ radio_trunking_receive_channel: RadioTrunkingReceiveChannel }>(`/radio/trunking_receive_channels/${id}`, { radio_trunking_receive_channel: data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: trunkingReceiveChannelKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: trunkingReceiveChannelKeys.lists() })
    },
  })
}

export function useDeleteTrunkingReceiveChannel() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => api.delete(`/radio/trunking_receive_channels/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trunkingReceiveChannelKeys.lists() })
    },
  })
}

// Mutation hooks for Channel Attributes
export function useCreateChannelAttribute() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ channelId, data }: { channelId: string; data: CreateChannelAttributeData }) => 
      api.post<{ channel_attribute: ChannelAttribute }>(`/radio/trunking_receive_channels/${channelId}/channel_attribute`, { channel_attribute: data }),
    onSuccess: (_, { channelId }) => {
      queryClient.invalidateQueries({ queryKey: trunkingChannelKeys.attributes(channelId) })
    },
  })
}

export function useUpdateChannelAttribute() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ channelId, data }: { channelId: string; data: UpdateChannelAttributeData }) => 
      api.patch<{ channel_attribute: ChannelAttribute }>(`/radio/trunking_receive_channels/${channelId}/channel_attribute`, { channel_attribute: data }),
    onSuccess: (_, { channelId }) => {
      queryClient.invalidateQueries({ queryKey: trunkingChannelKeys.attributes(channelId) })
    },
  })
}
