import { useEffect } from 'react'
import { useThemeStore } from '@/stores/themeStore'
import { useUserSettingsStore } from '@/stores/userSettingsStore'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { initializeTheme, isDark, setDarkMode } = useThemeStore()
  const { theming } = useUserSettingsStore()

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  // Watch for changes in user settings theme preference
  useEffect(() => {
    const themeSetting = theming.theme
    
    if (themeSetting === 'dark') {
      setDarkMode(true)
    } else if (themeSetting === 'light') {
      setDarkMode(false)
    } else if (themeSetting === 'system') {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(systemPrefersDark)
    }
  }, [theming.theme, setDarkMode])

  // Listen for system theme changes when theme is set to 'system'
  useEffect(() => {
    if (theming.theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theming.theme, setDarkMode])

  return <>{children}</>
}
