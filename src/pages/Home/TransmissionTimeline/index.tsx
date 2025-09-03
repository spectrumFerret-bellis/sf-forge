import { SquareChartGantt } from 'lucide-react'

import { usePlaylistStore }              from '@/stores/playlistStore'
import { TransmissionTimelinePresent }   from './TransmissionTimelinePresent'
import { CardWrapper, CardEmptyContent } from './../cardComponents'


export function TransmissionTimeline({ className }) {
  const selectedPlaylist = usePlaylistStore(state => state.selectedPlaylist)
  
  return (
    <CardWrapper title="Timeline" className={className}>
      {!selectedPlaylist ? (
        <CardEmptyContent 
          icon={<SquareChartGantt size={36} strokeWidth={1} />} 
          title="No playlist selected"
          description="Select a playlist to view transmission timeline" />
      ) : (
        <TransmissionTimelinePresent />
      )}
    </CardWrapper>
  )
}
