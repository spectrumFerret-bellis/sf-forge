import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Types
export interface LoginCredentials {
  email_address: string
  password: string
}

export interface LoginResponse {
  status: string
  message: string | null
  data: {
    tokens: {
      access_token: string
      refresh_token: string
    }
    user: {
      id: string
      email_address: string
    }
    expires_at: {
      access_token: {
        iso8601: string
        unix: string
      }
      refresh_token: {
        iso8601: string
        unix: string
      }
    }
  }
}

export interface RefreshTokenResponse {
  status: string
  message: string | null
  data: {
    tokens: {
      access_token: string
      refresh_token: string
    }
  }
}

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  session: () => [...authKeys.all, 'session'] as const,
}

// Mutation hooks
export function useLogin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => 
      api.post<LoginResponse>('/auth/login', credentials),
    onSuccess: (data) => {
      // Store tokens in localStorage or secure storage
      localStorage.setItem('access_token', data.data.tokens.access_token)
      localStorage.setItem('refresh_token', data.data.tokens.refresh_token)
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.user() })
      queryClient.invalidateQueries({ queryKey: authKeys.session() })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => api.delete('/auth/logout'),
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      
      // Clear all queries
      queryClient.clear()
    },
  })
}

export function useRefreshToken() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }
      return api.post<RefreshTokenResponse>('/auth/refresh', { 
        refresh_token: refreshToken 
      })
    },
    onSuccess: (data) => {
      // Update tokens
      localStorage.setItem('access_token', data.data.tokens.access_token)
      localStorage.setItem('refresh_token', data.data.tokens.refresh_token)
      
      // Invalidate user queries to refetch with new token
      queryClient.invalidateQueries({ queryKey: authKeys.user() })
    },
  })
}
