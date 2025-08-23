import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Types
export interface RadioPlaylistChannel {
  id: string
  playlist_channelable_type: string
  playlist_channelable_id: string
  radio_playlist_id: string
  user_id: string
  position: number
  created_at: string
  updated_at: string
  channelable_details: {
    channel_type: string
    channel: {
      id: string
    }
  }
}

export interface RadioPlaylist {
  id: string
  name: string
  description?: string
  configuration?: any
  user_id: string
  created_at: string
  updated_at: string
  radio_trunking_receive_channels: any[]
  radio_conventional_receive_channels: any[]
  radio_playlist_channels: RadioPlaylistChannel[]
}

export interface CreatePlaylistData {
  name: string
  description?: string
}

export interface UpdatePlaylistData {
  name?: string
  description?: string
}

export interface PaginatedPlaylists {
  radio_playlists: RadioPlaylist[]
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
export const playlistKeys = {
  all: ['radio_playlists'] as const,
  lists: () => [...playlistKeys.all, 'list'] as const,
  list: (filters: string) => [...playlistKeys.lists(), { filters }] as const,
  details: () => [...playlistKeys.all, 'detail'] as const,
  detail: (id: string) => [...playlistKeys.details(), id] as const,
}

// Query hooks
export function usePlaylists(params?: {
  page?: number
  per_page?: number
}) {
  return useQuery({
    queryKey: playlistKeys.list(JSON.stringify(params || {})),
    queryFn: () => api.get<PaginatedPlaylists>('/radio/playlists', params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePlaylist(id: string) {
  return useQuery({
    queryKey: playlistKeys.detail(id),
    queryFn: () => api.get<{ radio_playlist: RadioPlaylist }>(`/radio/playlists/${id}`),
    enabled: !!id,
  })
}

// Mutation hooks
export function useCreatePlaylist() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreatePlaylistData) => 
      api.post<{ radio_playlist: RadioPlaylist }>('/radio/playlists', { radio_playlist: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() })
    },
  })
}

export function useUpdatePlaylist() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlaylistData }) => 
      api.patch<{ radio_playlist: RadioPlaylist }>(`/radio/playlists/${id}`, { radio_playlist: data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() })
    },
  })
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => api.delete(`/radio/playlists/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.lists() })
    },
  })
}
