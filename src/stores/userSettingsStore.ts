import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserAccount {
  firstName: string
  lastName: string
  email: string
  username: string
  organization: string
  role: string
  timezone: string
  language: string
}

export interface UserTheming {
  theme: 'light' | 'dark' | 'system'
  primaryColor: string
  fontSize: 'small' | 'medium' | 'large'
  compactMode: boolean
  showAnimations: boolean
  customColors: Record<number, string> // index -> hex color mapping
  // Timeline Configuration
  timelineUseColorPalette: boolean // Use color palette vs alternating grayscale for rows
  timelineColoredLabels: boolean // Use colored vs gray channel labels
  timelineColoredTransmissionBars: boolean // Use colored vs grayscale transmission bars
}

export interface ReportSettings {
  defaultTimeRange: string
  autoRefresh: boolean
  refreshInterval: number // in seconds
  exportFormat: 'csv' | 'json' | 'pdf'
  includeMetadata: boolean
  emailReports: boolean
  emailFrequency: 'daily' | 'weekly' | 'monthly' | 'never'
}

interface UserSettingsState {
  // Account Settings
  account: UserAccount
  
  // Theming Settings
  theming: UserTheming
  
  // Report Settings
  reportSettings: ReportSettings
  
  // Actions
  updateAccount: (updates: Partial<UserAccount>) => void
  updateTheming: (updates: Partial<UserTheming>) => void
  updateReportSettings: (updates: Partial<ReportSettings>) => void
  updateCustomColor: (colorId: number, hexColor: string) => void
  resetAccount: () => void
  resetTheming: () => void
  resetReportSettings: () => void
  resetAllSettings: () => void
}

// Default values
const defaultAccount: UserAccount = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  organization: '',
  role: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  language: 'en'
}

const defaultTheming: UserTheming = {
  theme: 'system',
  primaryColor: '#3b82f6', // blue-500
  fontSize: 'medium',
  compactMode: false,
  showAnimations: true,
  customColors: {}, // Empty object for custom colors
  timelineUseColorPalette: true, // Default to using color palette
  timelineColoredLabels: true, // Default to colored labels
  timelineColoredTransmissionBars: true // Default to colored transmission bars
}

const defaultReportSettings: ReportSettings = {
  defaultTimeRange: '1h',
  autoRefresh: false,
  refreshInterval: 30,
  exportFormat: 'csv',
  includeMetadata: true,
  emailReports: false,
  emailFrequency: 'never'
}

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      account: defaultAccount,
      theming: defaultTheming,
      reportSettings: defaultReportSettings,
      
      // Actions
      updateAccount: (updates) => set((state) => ({
        account: { ...state.account, ...updates }
      })),
      
      updateTheming: (updates) => set((state) => ({
        theming: { ...state.theming, ...updates }
      })),
      
      updateReportSettings: (updates) => set((state) => ({
        reportSettings: { ...state.reportSettings, ...updates }
      })),
      
      updateCustomColor: (colorId, hexColor) => set((state) => ({
        theming: {
          ...state.theming,
          customColors: {
            ...state.theming.customColors,
            [colorId]: hexColor
          }
        }
      })),
      
      resetAccount: () => set({ account: defaultAccount }),
      resetTheming: () => set({ theming: defaultTheming }),
      resetReportSettings: () => set({ reportSettings: defaultReportSettings }),
      resetAllSettings: () => set({
        account: defaultAccount,
        theming: defaultTheming,
        reportSettings: defaultReportSettings
      })
    }),
    {
      name: 'user-settings-storage',
      partialize: (state) => ({
        account: state.account,
        theming: state.theming,
        reportSettings: state.reportSettings
      })
    }
  )
)
