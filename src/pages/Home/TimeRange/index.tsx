import { CalendarClock } from 'lucide-react'

import { usePlaylistStore } from '@/stores/playlistStore'

import { TimeRangePresent } from './TimeRangePresent'
import { CardWrapper, CardEmptyContent } from './../cardComponents'


export function TimeRange({ className }: { className?: string }) {
  const selectedPlaylist = usePlaylistStore(state => state.selectedPlaylist)
  
  return (
    <CardWrapper title="Time Range" className={className}>
      {selectedPlaylist ? (
        <TimeRangePresent /> 
      ) : (
        <CardEmptyContent 
          icon={<CalendarClock size={36} strokeWidth={1} />} 
          title="No playlist selected"
          description="Select a playlist to configure the time range" />
      )}
    </CardWrapper>
  )
}
