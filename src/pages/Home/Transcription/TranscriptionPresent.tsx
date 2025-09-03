import { formatInTimeZone } from 'date-fns-tz'
import { Textarea }               from "@/components/ui/textarea"
import { getChannelColorSafe }    from '@/lib/colorUtils'
import { usePlaylistStore }       from '@/stores/playlistStore'


export function TranscriptionPresent() {
  const selectedTransmission = usePlaylistStore(state => state.selectedTransmission)
  if (!selectedTransmission) return null

  const audioUrl = selectedTransmission.audio_file_url

  const transcription = 
    selectedTransmission.radio_transcriptions?.[0]?.transcription || 'No transcription available'
  
  const channelColor = 
    getChannelColorSafe(Number(selectedTransmission.channelable_id), '#6b7280')
  
  return (
    <div className="w-full flex flex-col justify-between h-full gap-4">
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2">
          <div 
            className="h-[8px] w-[8px] rounded-full" 
            style={{ backgroundColor: channelColor }}
          />
          <p>{selectedTransmission.sys_tg_name?.trim() || 'Unknown'}</p>
        </div>
        <p className="text-sm text-gray-500">
          {selectedTransmission.rx_started_at ? 
            formatInTimeZone(new Date(selectedTransmission.rx_started_at), 'UTC', 'MM/dd/yyyy, HH:mm:ss') : 
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