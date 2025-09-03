import { Input } from "@/components/ui/input"
import { Clock } from 'lucide-react'
import { usePlaylistStore } from '@/stores/playlistStore'

interface TimeSelectInputProps {
  isStartTime?: boolean
}

export function TimeSelectInput({ isStartTime = true }: TimeSelectInputProps) {
  const timeRange = usePlaylistStore(state => state.timeRange)
  const setTimeRange = usePlaylistStore(state => state.setTimeRange)
  
  if (!timeRange) return null

  const currentTime = isStartTime ? timeRange.start : timeRange.end
  const timezone = timeRange.timezone

  const updateTimeRange = (timeStr: string) => {
    if (timeRange) {
      // Parse time string and update the appropriate field
      const [time, period] = timeStr.split(' ')
      const [hours, minutes] = time.split(':').map(Number)
      
      let hour = hours
      if (period === 'PM' && hours !== 12) hour += 12
      if (period === 'AM' && hours === 12) hour = 0
      
      const newDate = new Date(currentTime)
      newDate.setHours(hour, minutes, 0, 0)
      
      const newTimeRange = {
        ...timeRange,
        [isStartTime ? 'start' : 'end']: newDate
      }
      
      setTimeRange(newTimeRange)
    }
  }

  return (
    <div className="relative">
      <Input
        type="text"
        value={isStartTime ? "12:00 PM" : "01:00 PM"}
        onChange={(e) => updateTimeRange(e.target.value)}
        className="pl-10"
        placeholder="12:00 PM"
      />
      <Clock 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
      />
    </div>
  )
}