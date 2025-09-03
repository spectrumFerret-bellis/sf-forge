import { useRef } from 'react'
import { TransmissionTimeline as TT } from '@/components/custom/transmissionTimeline'
import { usePlaylistStore } from '@/stores/playlistStore'


export function TransmissionTimelinePresent() {
  const selectedPlaylist = usePlaylistStore(state => state.selectedPlaylist)
  const timelineRef = useRef<HTMLDivElement>(null)
  
  return (
    <div className="w-full">
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Selected Playlist:</strong> {selectedPlaylist?.name}
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          ID: {selectedPlaylist?.id}
        </p>
      </div>
      <div className="w-full" ref={timelineRef}>
        <TT containerRef={timelineRef as React.RefObject<HTMLDivElement>} />
      </div>
    </div>
  )
}
