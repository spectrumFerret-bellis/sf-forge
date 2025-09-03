import { Map } from 'lucide-react'

import { usePlaylistStore } from '@/stores/playlistStore'
import { LocationPresent }  from './LocationPresent'

import { CardWrapper, CardEmptyContent } from './../cardComponents'


export function Location({ className }) {
  const selectedTransmission = usePlaylistStore(state => state.selectedTransmission)
  
  return (
    <CardWrapper title="Location" className={className}>
      {selectedTransmission ? (
        <LocationPresent transmission={selectedTransmission} />
      ) : (
        <CardEmptyContent 
          icon={<Map size={36} strokeWidth={1} />} 
          title="No transmission selected"
          description="Select a transmission to view its location information" />
      )}
    </CardWrapper>
  )
}
