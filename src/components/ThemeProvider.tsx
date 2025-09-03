import { useEffect }     from 'react'
import { useThemeStore } from '@/stores/themeStore'


export function ThemeProvider({ children }: React.ReactNode) {
  const initializeTheme = useThemeStore(state => state.initializeTheme)

  // Initialize theme on mount, empty [] subscriptions to ensure on calc once
  useEffect(() => {
    initializeTheme()
  }, [])

  return <>{children}</>
}
