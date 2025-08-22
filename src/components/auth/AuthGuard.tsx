import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useRefreshToken } from '@/hooks/api'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()
  const queryClient = useQueryClient()
  const refreshToken = useRefreshToken()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token')
      const refreshTokenValue = localStorage.getItem('refresh_token')

      if (!token && !refreshTokenValue) {
        setIsAuthenticated(false)
        setIsChecking(false)
        return
      }

      if (token) {
        // Check if token is valid (you might want to add token expiration check here)
        setIsAuthenticated(true)
        setIsChecking(false)
        return
      }

      // Try to refresh token if we have a refresh token but no access token
      if (refreshTokenValue) {
        try {
          await refreshToken.mutateAsync()
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Token refresh failed:', error)
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          setIsAuthenticated(false)
        }
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [refreshToken])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login with the current location as the return path
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
