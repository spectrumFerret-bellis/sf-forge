import { create } from 'zustand'
import type { RadioPlaylist } from '@/hooks/api/playlists'
import type { RadioTransmission } from '@/hooks/api/transmissions'
import { getChannelColor, COLOR_PALETTE } from '@/lib/colorUtils'
import { useUserSettingsStore } from './userSettingsStore'


export interface TimeRange {
  start: Date
  end: Date
  timezone: string
}

interface PlaylistState {
  // UI State
  selectedPlaylist: RadioPlaylist | null
  isPlaylistExpanded: boolean
  
  // Time Range State
  timeRange: TimeRange | null
  selectedQuickRange: string | null
  
  // Channel Selection State
  selectedChannelIds: string[]
  
  // Channel Colors State
  channelColors: Record<string, string> // channelableId -> hex color
  talkGroupColors: Record<string, string> // talkGroupName -> hex color
  channelNameToColorIndex: Record<string, number> // channelName -> color index
  
  // Transmission Selection State
  selectedTransmission: RadioTransmission | null
  
  // Actions
  setSelectedPlaylist: (playlist: RadioPlaylist | null) => void
  togglePlaylistExpanded: () => void
  clearSelectedPlaylist: () => void
  setTimeRange: (timeRange: TimeRange) => void
  clearTimeRange: () => void
  setSelectedQuickRange: (range: string | null) => void
  setSelectedChannelIds: (channelIds: string[]) => void
  toggleChannelSelection: (channelId: string) => void
  selectAllChannels: (channelIds: string[]) => void
  clearChannelSelection: () => void
  setChannelColors: (channelIds: string[]) => void
  setTalkGroupColors: (talkGroups: string[]) => void
  setChannelNameToColorIndex: (channelNames: string[]) => void
  getChannelColor: (channelableId: string) => string
  getTalkGroupColor: (talkGroupName: string) => string
  getChannelColorByTalkGroup: (talkGroupName: string) => string
  setSelectedTransmission: (transmission: RadioTransmission | null) => void
  clearSelectedTransmission: () => void
  refreshChannelColors: () => void
}

// Get local timezone
const getLocalTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return "UTC"
  }
}

// Default time range function
const getDefaultTimeRange = (): TimeRange => {
  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000) // 1 hour ago
  return {
    start: oneHourAgo,
    end: now,
    timezone: getLocalTimezone()
  }
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  // Initial state
  selectedPlaylist: null,
  isPlaylistExpanded: false,
  timeRange: getDefaultTimeRange(), // Set default time range
  selectedQuickRange: null,
  selectedChannelIds: [], // Start with no channels selected
  channelColors: {}, // Start with no channel colors
  talkGroupColors: {}, // Start with no talk group colors
  channelNameToColorIndex: {}, // Start with no channel name to color index mapping
  selectedTransmission: null, // Start with no transmission selected
  
  // Actions
  setSelectedPlaylist: (playlist) => {
    // Clear channel colors when a new playlist is selected
    set({ 
      selectedPlaylist: playlist, 
      channelColors: {}, 
      talkGroupColors: {},
      selectedChannelIds: [],
      selectedTransmission: null 
    })
  },
  togglePlaylistExpanded: () => set((state) => ({ 
    isPlaylistExpanded: !state.isPlaylistExpanded 
  })),
  clearSelectedPlaylist: () => set({ selectedPlaylist: null }),
  setTimeRange: (timeRange) => set({ timeRange }),
  clearTimeRange: () => set({ timeRange: null }),
  setSelectedQuickRange: (range) => set({ selectedQuickRange: range }),
  setSelectedChannelIds: (channelIds) => set({ selectedChannelIds: channelIds }),
  toggleChannelSelection: (channelId) => set((state) => ({
    selectedChannelIds: state.selectedChannelIds.includes(channelId)
      ? state.selectedChannelIds.filter(id => id !== channelId)
      : [...state.selectedChannelIds, channelId]
  })),
  selectAllChannels: (channelIds) => set({ selectedChannelIds: channelIds }),
  clearChannelSelection: () => set({ selectedChannelIds: [] }),
  setChannelColors: (channelIds) => {
    const channelColors: Record<string, string> = {}
    // Get custom colors from user settings store
    const userSettings = useUserSettingsStore.getState()
    channelIds.forEach((channelId, index) => {
      // Assign colors by index using the new color system with custom colors
      channelColors[channelId] = getChannelColor(index, userSettings.theming?.customColors)
    })

    set({ channelColors })
  },
  getChannelColor: (channelableId) => {
    const state = get()
    // Find the channel index
    const channelIndex = state.selectedChannelIds.indexOf(channelableId)
    
    // Always check for the latest custom colors first
    if (channelIndex >= 0) {
      // Get custom colors from user settings store
      const userSettings = useUserSettingsStore.getState()
      return getChannelColor(channelIndex, userSettings.theming?.customColors)
    }
    
    // If color is already assigned in store, use it (for channels not in selectedChannelIds)
    if (state.channelColors[channelableId]) {
      return state.channelColors[channelableId]
    }
    
    // Fallback to a default color for any unassigned channels
    return '#6b7280' // Default gray color
  },
  setTalkGroupColors: (talkGroups) => {
    const talkGroupColors: Record<string, string> = {}
    // Get custom colors from user settings store
    const userSettings = useUserSettingsStore.getState()
    talkGroups.forEach((talkGroup, index) => {
      // Assign colors by index using the new color system with custom colors
      talkGroupColors[talkGroup] = getChannelColor(index, userSettings.theming?.customColors)
    })

    set({ talkGroupColors })
  },
  setChannelNameToColorIndex: (channelNames) => {
    const channelNameToColorIndex: Record<string, number> = {}
    // Sort channel names to ensure consistent color assignment
    const sortedChannelNames = [...channelNames].sort()
    sortedChannelNames.forEach((channelName, index) => {
      channelNameToColorIndex[channelName] = index
    })
    set({ channelNameToColorIndex })
  },
  getTalkGroupColor: (talkGroupName) => {
    const state = get()
    // If color is already assigned in store, use it
    if (state.talkGroupColors[talkGroupName]) {
      return state.talkGroupColors[talkGroupName]
    }
    // Otherwise, fallback to a default color for any unassigned talk groups

    return '#6b7280' // Default gray color
  },
  getChannelColorByTalkGroup: (talkGroupName) => {
    const state = get()
    // Get the color index for this talk group name
    const colorIndex = state.channelNameToColorIndex[talkGroupName]
    
    if (colorIndex !== undefined) {
      // Get custom colors from user settings store
      const userSettings = useUserSettingsStore.getState()
      return getChannelColor(colorIndex, userSettings.theming?.customColors)
    }
    
    // Fallback to a default color for any unassigned talk groups
    return '#6b7280' // Default gray color
  },
  setSelectedTransmission: (transmission) => set({ selectedTransmission: transmission }),
  clearSelectedTransmission: () => set({ selectedTransmission: null }),
  
  // Refresh channel colors when custom colors are updated
  refreshChannelColors: () => {
    const state = get()
    if (state.selectedChannelIds.length > 0) {
      // Re-set channel colors with latest custom colors
      const channelColors: Record<string, string> = {}
      const userSettings = useUserSettingsStore.getState()
      state.selectedChannelIds.forEach((channelId, index) => {
        channelColors[channelId] = getChannelColor(index, userSettings.theming?.customColors)
      })
      set({ channelColors })
    }
  }
}))
