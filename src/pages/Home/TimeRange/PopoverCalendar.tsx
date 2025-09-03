import { Input } from "@/components/ui/input"
import * as Popover from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from 'lucide-react'
import { formatInTimeZone } from 'date-fns-tz'
import { usePlaylistStore } from '@/stores/playlistStore'

interface PopoverCalendarProps {
  userDate: Date | undefined
  timezone: string
}

export function PopoverCalendar({ userDate, timezone }: PopoverCalendarProps) {
  const timeRange = usePlaylistStore(state => state.timeRange)
  const setTimeRange = usePlaylistStore(state => state.setTimeRange)

  const inputValue = userDate ? formatInTimeZone(userDate, timezone, "MM/dd/yyyy") : ""

  const updateTimeRange = (date: Date) => {
    if (date && timeRange) {
      const newTimeRange = {
        start: date,
        end: timeRange.end,
        timezone: timeRange.timezone
      }
      setTimeRange(newTimeRange)
    }
  }

  return (
    <div>
      <Popover.Popover>
        <Popover.PopoverTrigger asChild>
          <div className="relative">
            <Input
              type="text"
              value={inputValue}
              readOnly
              className="pl-10 cursor-pointer"
              placeholder="MM/DD/YYYY"
            />
            <CalendarIcon 
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 
                text-muted-foreground pointer-events-none`}
            />
          </div>
        </Popover.PopoverTrigger>
        
        <Popover.PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={userDate}
            onSelect={(date) => {
              if (date) {
                updateTimeRange(date)
              }
            }}
            initialFocus
          />
        </Popover.PopoverContent>
      </Popover.Popover>
    </div>
  )
}