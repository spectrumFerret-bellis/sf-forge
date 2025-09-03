import { useCallback } from 'react'
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'
import { subHours } from 'date-fns'
import * as Tabs from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { usePlaylistStore, type TimeRange } from '@/stores/playlistStore'
import { TimezoneDropdown } from './TimezoneDropdown'
import { PopoverCalendar } from './PopoverCalendar'
import { TimeSelectInput } from './TimeSelectInput'
import { QuickRangeButtons } from './QuickRangeButtons'

export function TimeRangePresent() {
  const timeRange = usePlaylistStore(state => state.timeRange)
  const setTimeRange = usePlaylistStore(state => state.setTimeRange)
  const selectedQuickRange = usePlaylistStore(state => state.selectedQuickRange)
  const setSelectedQuickRange = usePlaylistStore(state => state.setSelectedQuickRange)
  
  // Get current values from store (no local state syncing)
  const timezone  = timeRange?.timezone || "UTC"
  const startDate = timeRange?.start
  const endDate   = timeRange?.end
  const startTime = timeRange?.start ? formatInTimeZone(timeRange.start, timezone, "hh:mm a") : "12:00 PM"
  const endTime   = timeRange?.end ? formatInTimeZone(timeRange.end, timezone, "hh:mm a") : "01:00 PM"

  // Parse time string and combine with date in the specified timezone
  const parseTime = useCallback((timeStr: string, baseDate: Date, targetTimezone: string): Date => {
    const [time, period] = timeStr.split(' ')
    const [hours, minutes] = time.split(':').map(Number)
    
    let hour = hours
    if (period === 'PM' && hours !== 12) hour += 12
    if (period === 'AM' && hours === 12) hour = 0
    
    // Create a date string in the target timezone
    const year = baseDate.getFullYear()
    const month = String(baseDate.getMonth() + 1).padStart(2, '0')
    const day = String(baseDate.getDate()).padStart(2, '0')
    const hourStr = String(hour).padStart(2, '0')
    const minuteStr = String(minutes).padStart(2, '0')
    
    // Create ISO string in target timezone
    const dateString = `${year}-${month}-${day}T${hourStr}:${minuteStr}:00`
    
    // Convert to UTC using the target timezone
    return fromZonedTime(dateString, targetTimezone)
  }, [])

  // Update time range in store
  const updateTimeRange = useCallback((
    newStartDate?: Date,
    newEndDate?: Date,
    newStartTime?: string,
    newEndTime?: string,
    newTimezone?: string
  ) => {
    const currentStartDate = newStartDate || startDate
    const currentEndDate   = newEndDate || endDate
    const currentStartTime = newStartTime || startTime
    const currentEndTime   = newEndTime || endTime
    const currentTimezone  = newTimezone || timezone

    if (!currentStartDate || !currentEndDate) return

    try {
      const startDateTime = parseTime(currentStartTime, currentStartDate, currentTimezone)
      const endDateTime = parseTime(currentEndTime, currentEndDate, currentTimezone)
      
      const newTimeRange: TimeRange = {
        start: startDateTime,
        end: endDateTime,
        timezone: currentTimezone
      }
      
      setTimeRange(newTimeRange)
    } catch (error) {
      console.error('Error parsing time:', error)
    }
  }, [startDate, endDate, startTime, endTime, timezone, setTimeRange, parseTime])

  // Handle quick range selection
  const handleQuickRange = useCallback((hours: number, rangeValue: string) => {
    // Create time range - always use UTC for consistency
    const now = new Date()
    const start = subHours(now, hours)
    
    const newTimeRange: TimeRange = {
      start,
      end: now,
      timezone
    }
    
    setTimeRange(newTimeRange)
    setSelectedQuickRange(rangeValue)
  }, [timezone, setTimeRange, setSelectedQuickRange])

  // Check if a quick range is currently active
  const isQuickRangeActive = useCallback((hours: number) => {
    if (!timeRange) return false
    const now = new Date()
    const expectedStart = subHours(now, hours)
    const startDiff = Math.abs(timeRange.start.getTime() - expectedStart.getTime())
    const endDiff = Math.abs(timeRange.end.getTime() - now.getTime())
    // Allow 1 minute tolerance for rounding
    return startDiff < 60000 && endDiff < 60000
  }, [timeRange])

  return (
    <div className="space-y-6">
      <Tabs.Tabs defaultValue="jump" className="w-full">
        <Tabs.TabsList className="grid w-full grid-cols-2">
          <Tabs.TabsTrigger value="jump">Jump to Time</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="realtime">Real-Time</Tabs.TabsTrigger>
        </Tabs.TabsList>
        
        <Tabs.TabsContent value="jump" className="space-y-4 mt-4">
          {/* Timezone Selection */}
          <div className="mb-2 flex items-center">
            <Label htmlFor="timezone" className="mr-2 my-0">Timezone</Label>
            <TimezoneDropdown />
          </div>

          {/* Start Date/Time */}
          <div className="mb-2 flex items-center">
            <Label className="my-0 w-12">Start</Label>
            <PopoverCalendar userDate={startDate} timezone={timezone} />
            <TimeSelectInput />
          </div>

          {/* End Date/Time */}
          <div className="mb-4 flex items-center">
            <Label className="my-0 w-12">End</Label>
            <div className="grid grid-cols-2 gap-2">
              <PopoverCalendar userDate={endDate} timezone={timezone} />
              <TimeSelectInput />
            </div>
          </div>

          {/* Quick Selection */}
          <div className="flex">
            <Label className="mr-2">Quick</Label>
            <QuickRangeButtons />
          </div>
        </Tabs.TabsContent>

        <Tabs.TabsContent value="realtime" className="space-y-4 mt-4">
          <div className="text-center">
            {/* Timezone Selection */}
            <div className="mb-2 flex items-center">
              <Label htmlFor="timezone" className="mr-2 my-0">Timezone</Label>
              <TimezoneDropdown timezone={timezone} />
            </div>
          </div>
        </Tabs.TabsContent>
      </Tabs.Tabs>
    </div>
  )
}