import React                                from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools }               from '@tanstack/react-query-devtools'
import { Routes, Route }                    from 'react-router-dom'
import { Toaster }                          from 'sonner'

import { queryClient }                      from './lib/queryClient'
import { AuthGuard }                        from './components/auth/AuthGuard'
import { ThemeProvider }                    from './components/ThemeProvider'
import { 
  PageAuthorization, 
  PageHome,
  PageUserProfile,
}      from './pages'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div>
          <Routes>
            {/* Public routes */}
            <Route path="/auth/*" element={<PageAuthorization />} />
            
            {/* Protected routes */}
            <Route 
              path="/"
              element={<AuthGuard><PageHome /></AuthGuard>} />
            <Route 
              path="/user/settings/*"
              element={<AuthGuard><PageUserProfile /></AuthGuard>} />
          </Routes>
        </div>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App