import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '@/lib/api'

// Query keys for different data types
export const queryKeys = {
  channels: ['channels'] as const,
  transmissions: ['transmissions'] as const,
  textLogs: ['textLogs'] as const,
  playlists: ['playlists'] as const,
  metadata: ['metadata'] as const,
  location: ['location'] as const,
  transcription: ['transcription'] as const,
  
  // With parameters
  channel: (id: string) => ['channel', id] as const,
  transmission: (id: string) => ['transmission', id] as const,
  textLog: (id: string) => ['textLog', id] as const,
  transmissionsByChannel: (channelId: string) => ['transmissions', 'channel', channelId] as const,
  transmissionsByTimeRange: (start: string, end: string) => ['transmissions', 'timerange', start, end] as const,
}

// Custom hooks for data fetching
export function useChannels() {
  return useQuery({
    queryKey: queryKeys.channels,
    queryFn: () => api.get<Channel[]>('/channels'),
    staleTime: 2 * 60 * 1000, // 2 minutes for channels
  })
}

export function useTransmissions(params?: {
  channelId?: string
  startTime?: string
  endTime?: string
  limit?: number
}) {
  return useQuery({
    queryKey: [...queryKeys.transmissions, params],
    queryFn: () => api.get<Transmission[]>('/transmissions', params),
    staleTime: 30 * 1000, // 30 seconds for real-time data
    refetchInterval: 10 * 1000, // Refetch every 10 seconds
  })
}

export function useTextLogs(params?: {
  channelId?: string
  startTime?: string
  endTime?: string
  limit?: number
}) {
  return useQuery({
    queryKey: [...queryKeys.textLogs, params],
    queryFn: () => api.get<TextLog[]>('/text-logs', params),
    staleTime: 30 * 1000,
    refetchInterval: 5 * 1000, // More frequent for text logs
  })
}

export function usePlaylists() {
  return useQuery({
    queryKey: queryKeys.playlists,
    queryFn: () => api.get<Playlist[]>('/playlists'),
    staleTime: 5 * 60 * 1000, // 5 minutes for playlists
  })
}

export function useMetadata(transmissionId: string) {
  return useQuery({
    queryKey: [...queryKeys.metadata, transmissionId],
    queryFn: () => api.get<Metadata>(`/transmissions/${transmissionId}/metadata`),
    enabled: !!transmissionId,
  })
}

export function useLocation(transmissionId: string) {
  return useQuery({
    queryKey: [...queryKeys.location, transmissionId],
    queryFn: () => api.get<Location>(`/transmissions/${transmissionId}/location`),
    enabled: !!transmissionId,
  })
}

export function useTranscription(transmissionId: string) {
  return useQuery({
    queryKey: [...queryKeys.transcription, transmissionId],
    queryFn: () => api.get<Transcription>(`/transmissions/${transmissionId}/transcription`),
    enabled: !!transmissionId,
  })
}

// Mutation hooks
export function useCreateTransmission() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateTransmissionData) => api.post<Transmission>('/transmissions', data),
    onSuccess: () => {
      // Invalidate and refetch transmissions
      queryClient.invalidateQueries({ queryKey: queryKeys.transmissions })
    },
  })
}

export function useUpdateTransmission() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transmission> }) => 
      api.put<Transmission>(`/transmissions/${id}`, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific transmission and list
      queryClient.invalidateQueries({ queryKey: queryKeys.transmission(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.transmissions })
    },
  })
}

export function useDeleteTransmission() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => api.delete(`/transmissions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transmissions })
    },
  })
}

// Types (you can move these to a separate types file)
export interface Channel {
  id: string
  name: string
  txAmnt: number
  frequency?: string
  color?: string
}

export interface Transmission {
  id: string
  channelId: string
  startTime: string
  endTime: string
  duration: number
  type: 'voice' | 'data' | 'emergency'
  signalStrength: number
}

export interface TextLog {
  id: string
  channelId: string
  timestamp: string
  text: string
  userId?: string
}

export interface Playlist {
  id: string
  name: string
  channels: string[]
}

export interface Metadata {
  id: string
  transmissionId: string
  // Add specific metadata fields
}

export interface Location {
  id: string
  transmissionId: string
  latitude: number
  longitude: number
  accuracy?: number
}

export interface Transcription {
  id: string
  transmissionId: string
  text: string
  confidence: number
  language?: string
}

export interface CreateTransmissionData {
  channelId: string
  startTime: string
  endTime: string
  type: 'voice' | 'data' | 'emergency'
  signalStrength: number
}
