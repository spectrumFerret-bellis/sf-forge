import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Types
export interface RadioTranscription {
  id: string
  radio_transmission_id: string
  language: string
  transcription: string
  created_at: string
  updated_at: string
}

export interface CreateTranscriptionData {
  radio_transmission_id: string
  language: string
  transcription: string
}

export interface UpdateTranscriptionData {
  language?: string
  transcription?: string
}

// Query keys
export const transcriptionKeys = {
  all: ['radio_transcriptions'] as const,
  lists: () => [...transcriptionKeys.all, 'list'] as const,
  list: (filters: string) => [...transcriptionKeys.lists(), { filters }] as const,
  details: () => [...transcriptionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transcriptionKeys.details(), id] as const,
  byTransmission: (transmissionId: string) => [...transcriptionKeys.all, 'transmission', transmissionId] as const,
}

// Query hooks
export function useTranscription(id: string) {
  return useQuery({
    queryKey: transcriptionKeys.detail(id),
    queryFn: () => api.get<{ radio_transcription: RadioTranscription }>(`/radio/transcriptions/${id}`),
    enabled: !!id,
  })
}

export function useTranscriptionByTransmission(transmissionId: string) {
  return useQuery({
    queryKey: transcriptionKeys.byTransmission(transmissionId),
    queryFn: () => api.get<{ radio_transcription: RadioTranscription }>(`/radio/transmissions/${transmissionId}/transcription`),
    enabled: !!transmissionId,
  })
}

// Mutation hooks
export function useCreateTranscription() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateTranscriptionData) => 
      api.post<{ radio_transcription: RadioTranscription }>('/radio/transcriptions', { radio_transcription: data }),
    onSuccess: (data) => {
      const transcription = data.radio_transcription
      queryClient.invalidateQueries({ queryKey: transcriptionKeys.detail(transcription.id) })
      queryClient.invalidateQueries({ queryKey: transcriptionKeys.byTransmission(transcription.radio_transmission_id) })
    },
  })
}

export function useUpdateTranscription() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTranscriptionData }) => 
      api.patch<{ radio_transcription: RadioTranscription }>(`/radio/transcriptions/${id}`, { radio_transcription: data }),
    onSuccess: (data, { id }) => {
      const transcription = data.radio_transcription
      queryClient.invalidateQueries({ queryKey: transcriptionKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: transcriptionKeys.byTransmission(transcription.radio_transmission_id) })
    },
  })
}

export function useDeleteTranscription() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => api.delete(`/radio/transcriptions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transcriptionKeys.all })
    },
  })
}
