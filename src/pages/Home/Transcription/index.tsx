import { Captions } from 'lucide-react'

import { usePlaylistStore }              from '@/stores/playlistStore'
import { TranscriptionPresent }          from './TranscriptionPresent'
import { CardWrapper, CardEmptyContent } from './../cardComponents'


export function Transcription({ className }: { className?: string }) {
  const selectedTransmission = usePlaylistStore(state => state.selectedTransmission)
  
  return (
    <CardWrapper title="Transcription" className={className}>
      {selectedTransmission ? (
        <TranscriptionPresent />
      ) : (
        <CardEmptyContent 
          icon={<Captions size={40} strokeWidth={1} />} 
          title="No transmission selected"
          description="Select a transmission from the table or timeline to view its transcription" />
      )}
    </CardWrapper>
  )
}
