import { create } from 'zustand'
import type { RadioPlaylist } from '@/hooks/api/playlists'
import type { RadioTransmission } from '@/hooks/api/transmissions'
import { getChannelColor, COLORBLIND_SAFE_PALETTE } from '@/lib/colorUtils'

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
  getChannelColor: (channelableId: string) => string
  getTalkGroupColor: (talkGroupName: string) => string
  setSelectedTransmission: (transmission: RadioTransmission | null) => void
  clearSelectedTransmission: () => void
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
    channelIds.forEach((channelId, index) => {
      // Assign colors by index (0-47) to get sequential, predictable colors
      // Index 0 = Red, Index 1 = Green, Index 2 = Blue, etc.
      if (index < COLORBLIND_SAFE_PALETTE.length) {
        channelColors[channelId] = COLORBLIND_SAFE_PALETTE[index].hex
      } else {
        // Fallback to a default color if we exceed the palette
        channelColors[channelId] = '#6b7280'
      }
    })

    set({ channelColors })
  },
  getChannelColor: (channelableId) => {
    const state = get()
    // If color is already assigned in store, use it
    if (state.channelColors[channelableId]) {
      return state.channelColors[channelableId]
    }
    // Otherwise, fallback to a default color for any unassigned channels

    return '#6b7280' // Default gray color
  },
  setTalkGroupColors: (talkGroups) => {
    const talkGroupColors: Record<string, string> = {}
    talkGroups.forEach((talkGroup, index) => {
      // Assign colors by index (0-47) to get sequential, predictable colors
      if (index < COLORBLIND_SAFE_PALETTE.length) {
        talkGroupColors[talkGroup] = COLORBLIND_SAFE_PALETTE[index].hex
      } else {
        // Fallback to a default color if we exceed the palette
        talkGroupColors[talkGroup] = '#6b7280'
      }
    })

    set({ talkGroupColors })
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
  setSelectedTransmission: (transmission) => set({ selectedTransmission: transmission }),
  clearSelectedTransmission: () => set({ selectedTransmission: null })
}))
