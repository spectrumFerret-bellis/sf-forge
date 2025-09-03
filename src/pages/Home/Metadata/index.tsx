import { Info } from 'lucide-react'

import { usePlaylistStore } from '@/stores/playlistStore'

import { MetadataPresent } from './MetadataPresent'
import { CardWrapper, CardEmptyContent } from './../cardComponents'


export function Metadata({ className }: { className?: string }) {
  const selectedTransmission = usePlaylistStore(state => state.selectedTransmission)

  return (
    <CardWrapper title="Metadata" className={className}>
      {selectedTransmission ? (
        <MetadataPresent transmission={selectedTransmission} />
      ) : (
        <CardEmptyContent 
          icon={<Info size={36} strokeWidth={1} />} 
          title="No transmission selected"
          description="Select a transmission to view its metadata" />
      )}
    </CardWrapper>
  )
}
