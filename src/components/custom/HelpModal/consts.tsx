export const ListInfo = {
  technicalNotes: {
    tite: "🔧 Technical Notes",
    items: [
      <li><strong>Browser Support:</strong> Modern browsers with audio support required</li>,
      <li><strong>Performance:</strong> Optimized for large datasets with virtual scrolling</li>,
      <li><strong>Security:</strong> All data is transmitted securely over HTTPS</li>,
      <li><strong>Privacy:</strong> No personal data is stored or transmitted</li>,
    ]
  },
  dataSources: {
    title: "Data Sources",
    items: [
      <li><strong>Live Transmissions:</strong> Real-time monitoring of radio communications</li>,
      <li><strong>Transcriptions:</strong> Automatic speech-to-text conversion of audio</li>,
      <li><strong>Metadata:</strong> Timestamp, duration, channel, and location information</li>,
      <li><strong>Playlists:</strong> Organized collections of related transmissions</li>,
    ]
  },
  navigationTips: {
    title: "💡 Navigation Tips",
    items: [
      <li>Arrow keys work globally - no need to click in the table first</li>,
      <li>Up/Down arrows follow your current table sort order</li>,
      <li>Left/Right arrows always use chronological order</li>,
      <li>Home/End respect current filters and sort order</li>,
      <li>All navigation works with filtered data when a search is active</li>,
    ]
  },
  interfaceGuide: {
    title: "🎛️ Interface Guide",
    items: [
      {
        title: "Transmissions Table",
        items: [
          <li><strong>Date/Time:</strong> When the transmission was received</li>,
          <li><strong>Talk Group:</strong> Channel or group identifier (color-coded)</li>,
          <li><strong>Duration:</strong> Length of the transmission</li>,
          <li><strong>Transcription:</strong> Automatic speech-to-text content</li>,
          <li><strong>Color Coding:</strong> Each talk group has a unique color</li>,
        ]
      },
      {
        title: "Audio Player",
        items: [
          <li><strong>Waveform:</strong> Visual representation of audio</li>,
          <li><strong>Scrubbing:</strong> Click anywhere to jump to that time</li>,
          <li><strong>Playback Speed:</strong> Adjust speed from 0.5x to 2x</li>,
          <li><strong>Loop Mode:</strong> Repeat current transmission</li>,
        ]
      },
      {
        title: "Audio Player",
        items: [
          <li><strong>Waveform:</strong> Visual representation of audio</li>,
          <li><strong>Scrubbing:</strong> Click anywhere to jump to that time</li>,
          <li><strong>Playback Speed:</strong> Adjust speed from 0.5x to 2x</li>,
          <li><strong>Loop Mode:</strong> Repeat current transmission</li>,
        ]
      }
    ]
  }
}

export const keyboardNav = {
  tableNavigation: {
    title: "Table Navigation",
    items: [
      {
        badge: "↑ ↓",
        description: "Navigate up/down through transmissions"
      },
      {
        badge: "← →",
        description: "Navigate left/right through transmissions"
      },
      {
        badge: "Enter",
        description: "Play audio for selected transmission"
      },
      {
        badge: "Home",
        description: "Jump to first transmission in current view"
      },
      {
        badge: "End",
        description: "Jump to last transmission in current view"
      },
      {
        badge: "Page Up",
        description: "Navigate up by page (10 transmissions)"
      },
      {
        badge: "Page Down",
        description: "Navigate down by page (10 transmissions)"
      },
    ]
  },
  general: {
    title: "General",
    items: [
      {
        badge: "Ctrl/Cmd + F",
        description: "Focus search filter"
      },
      {
        badge: "Esc",
        description: "Clear current filter or selection"
      },
    ]
  },
  advanced: {
    title: "Advanced Navigation",
    items: [
      {
        badge: "[ ]",
        description: "Navigate between transmissions in the same talk group"
      },
      {
        badge: "↑ ↓",
        description: "in filter box - Select first/last transmission and exit filter"
      },
    ]
  },
}

export const CSS_H2 = "text-xl font-semibold text-slate-800 mb-3 border-b-2 border-slate-200 pb-2"
export const CSS_H3 = "text-lg font-medium text-slate-700 mt-4 mb-2"
export const CSS_UL = "list-disc list-inside space-y-1 ml-4"