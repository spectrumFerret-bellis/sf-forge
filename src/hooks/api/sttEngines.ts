import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Types
export interface SttEngine {
  id: string
  name: string
  version: string
  configuration: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CreateSttEngineData {
  name: string
  version?: string
  configuration?: Record<string, any>
}

export interface UpdateSttEngineData {
  name?: string
  version?: string
  configuration?: Record<string, any>
}

export interface PaginatedSttEngines {
  stt_engines: SttEngine[]
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
export const sttEngineKeys = {
  all: ['stt_engines'] as const,
  lists: () => [...sttEngineKeys.all, 'list'] as const,
  list: (filters: string) => [...sttEngineKeys.lists(), { filters }] as const,
  details: () => [...sttEngineKeys.all, 'detail'] as const,
  detail: (id: string) => [...sttEngineKeys.details(), id] as const,
}

// Query hooks
export function useSttEngines(params?: {
  page?: number
  per_page?: number
}) {
  return useQuery({
    queryKey: sttEngineKeys.list(JSON.stringify(params || {})),
    queryFn: () => api.get<PaginatedSttEngines>('/stt_engines', params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useSttEngine(id: string) {
  return useQuery({
    queryKey: sttEngineKeys.detail(id),
    queryFn: () => api.get<{ stt_engine: SttEngine }>(`/stt_engines/${id}`),
    enabled: !!id,
  })
}

// Mutation hooks
export function useCreateSttEngine() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateSttEngineData) => 
      api.post<{ stt_engine: SttEngine }>('/stt_engines', { stt_engine: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sttEngineKeys.lists() })
    },
  })
}

export function useUpdateSttEngine() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSttEngineData }) => 
      api.patch<{ stt_engine: SttEngine }>(`/stt_engines/${id}`, { stt_engine: data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: sttEngineKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: sttEngineKeys.lists() })
    },
  })
}

export function useDeleteSttEngine() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => api.delete(`/stt_engines/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sttEngineKeys.lists() })
    },
  })
}
