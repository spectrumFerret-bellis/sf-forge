import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useUserSettingsStore } from './userSettingsStore'

interface ThemeState {
  isDark: boolean
  setDarkMode: (isDark: boolean) => void
  toggleDarkMode: () => void
  initializeTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,
      
      setDarkMode: (isDark: boolean) => {
        set({ isDark })
        
        // Apply theme to DOM
        const root = window.document.documentElement
        if (isDark) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
        
        // Update localStorage for backward compatibility
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
      },
      
      toggleDarkMode: () => {
        const { isDark, setDarkMode } = get()
        const newDarkMode = !isDark
        setDarkMode(newDarkMode)
        
        // Update user settings store to reflect the manual toggle
        const userSettings = useUserSettingsStore.getState()
        const newTheme = newDarkMode ? 'dark' : 'light'
        userSettings.updateTheming({ theme: newTheme })
      },
      
      initializeTheme: () => {
        const { setDarkMode } = get()
        const userSettings = useUserSettingsStore.getState()
        
        // Check if theme is stored in localStorage first (for backward compatibility)
        const storedTheme = localStorage.getItem('theme')
        
        if (storedTheme) {
          // Use stored theme preference
          setDarkMode(storedTheme === 'dark')
        } else {
          // Use theme from user settings store
          const themeSetting = userSettings.theming.theme
          
          if (themeSetting === 'dark') {
            setDarkMode(true)
          } else if (themeSetting === 'light') {
            setDarkMode(false)
          } else if (themeSetting === 'system') {
            // Check system preference
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setDarkMode(systemPrefersDark)
          }
        }
      }
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ isDark: state.isDark })
    }
  )
)
