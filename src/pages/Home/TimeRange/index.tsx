import { CalendarClock } from 'lucide-react'

import { Badge }     from "@/components/ui/badge"

import { usePlaylistStore, type TimeRange } from '@/stores/playlistStore'

import { TimeRangePresent } from './TimeRangePresent'
import { CardWrapper, CardEmptyContent } from './../cardComponents'


export function TimeRange({ className }) {
  const selectedPlaylist = usePlaylistStore(state => state.selectedPlaylist)
  const timeRange = usePlaylistStore(state => state.timeRange)
  
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
