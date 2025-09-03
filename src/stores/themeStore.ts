import { create }               from 'zustand'
import { persist }              from 'zustand/middleware'
import { useUserSettingsStore } from './userSettingsStore'

interface ThemeState {
  isDark          : boolean
  setDarkMode     : (isDark: boolean) => void
  toggleDarkMode  : () => void
  initializeTheme : () => void
}

export const useThemeStore = create<ThemeState>()(
  // localStorage persistence: https://zustand.docs.pmnd.rs/middlewares/persist#persist
  persist(
    (set, get) => ({
      isDark          : false,
      
      setDarkMode: (isDark: boolean) => {
        set({ isDark })
        
        // Apply theme to DOM root
        if (isDark) {
          window.document.documentElement.classList.add('dark')
        } else {
          window.document.documentElement.classList.remove('dark')
        }

        // Update user settings store to reflect the manual toggle
        /** 
         * NOTE: May want to come back to how the nav toggles darkMode and if
         * we want it overwrite the userSettings
         */
        const userSettings = useUserSettingsStore.getState()
        userSettings.updateTheming({ theme: isDark ? 'dark' : 'light' })
      },
      
      // toggleDarkMode is quick change, not a user profile setting
      toggleDarkMode: () => {
        const { isDark, setDarkMode } = get()
        setDarkMode(!isDark)
      },
      
      initializeTheme: () => {
        const { isDark, setDarkMode } = get()
        setDarkMode(isDark)
      }
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ isDark: state.isDark })
    }
  )
)
