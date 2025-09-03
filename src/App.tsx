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


const createRoute = (path, element, auth = false, end = false) => {
  if (auth)
    element = <AuthGuard>{element}</AuthGuard>

  return ({ path, element, end }) 
}

// Routes are constant and shouldn't be calculated on component render
// avoiding useMemo() as there's no need for the overhead of a constant value
const appRoutes = {
  public: [
    createRoute('/auth/*', <PageAuthorization />)
  ],
  protected: [
    createRoute('/', <PageHome />, true),
    createRoute('/user/settings/*', <PageUserProfile />, true)
  ]
}


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div>
          <Routes>
            {appRoutes.public.map(({path, element, end}) => 
              <Route key={path} path={path} element={element} end={end} />)}
            
            {appRoutes.protected.map(({path, element, end}) => 
              <Route key={path} path={path} element={element} end={end} />)}
          </Routes>
        </div>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}