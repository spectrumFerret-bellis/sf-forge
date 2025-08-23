import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Textarea } from "@/components/ui/textarea"
import { Captions } from 'lucide-react'
import type { RadioTransmission } from '@/hooks/api/transmissions'
import { formatInTimeZone } from 'date-fns-tz'
import { usePlaylistStore } from '@/stores/playlistStore'
import { getChannelColorSafe } from '@/lib/colorUtils'

const TranscriptionEmpty = () => {
  return (<div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <Captions size={40} strokeWidth={1} />
      </div>

      <h3 className="font-bold mt-4 mb-2">No transmission selected</h3>
      <p>
        Select a transmission from the table or timeline to view its transcription
      </p>
    </div>)
}

const TranscriptionPresent = ({ transmission }: { transmission: RadioTransmission }) => {
  const transcription = transmission.radio_transcriptions?.[0]?.transcription || 'No transcription available'
  const audioUrl = transmission.audio_file_url
  const channelColor = getChannelColorSafe(transmission.channelable_id, '#6b7280')
  
  return (
    <div className="w-full flex flex-col justify-between h-full gap-4">
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2">
          <div 
            className="h-[8px] w-[8px] rounded-full" 
            style={{ backgroundColor: channelColor }}
          />
          <p>{transmission.sys_tg_name?.trim() || 'Unknown'}</p>
        </div>
        <p className="text-sm text-gray-500">
          {transmission.rx_started_at ? 
            formatInTimeZone(new Date(transmission.rx_started_at), 'UTC', 'MM/dd/yyyy, HH:mm:ss') : 
            'N/A'
          }
        </p>
      </div>

      <Textarea 
        className="grow resize-none" 
        value={transcription}
        readOnly
      />
      {audioUrl && (
        <audio controls src={audioUrl} className="w-full" />
      )}
    </div>
  )
}

interface TranscriptionProps {
  className?: string
}

export function Transcription({ className }: TranscriptionProps) {
  const { selectedTransmission } = usePlaylistStore()
  
  return (
    <Card className={`w-full max-w-sm ${className}`}>
      <CardHeader>
        <CardTitle>Transcription</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 h-full justify-center items-center flex text-slate-600 dark:text-slate-300">
        {selectedTransmission ? (
          <TranscriptionPresent transmission={selectedTransmission} />
        ) : (
          <TranscriptionEmpty />
        )}
      </CardContent>
    </Card>
  )
}
