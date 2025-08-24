import React             from 'react'
import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PageHome }      from './pages'
import { PageAuthorization } from './pages/Authorization'
import { AuthGuard }     from './components/auth/AuthGuard'
import { queryClient }   from './lib/queryClient'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Routes>
          <Route path="/auth/*" element={<PageAuthorization />} />
          <Route path="/" element={
            <AuthGuard>
              <PageHome />
            </AuthGuard>
          } />
        </Routes>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App