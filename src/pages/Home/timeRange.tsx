import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"

import { CalendarClock, MapPin, ChevronDown, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { useCallback } from 'react'
import { format, subHours } from "date-fns"
import { fromZonedTime, toZonedTime, formatInTimeZone } from "date-fns-tz"
import { usePlaylistStore, type TimeRange } from '@/stores/playlistStore'

const TimeRangeEmpty = () => {
  return (<div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <CalendarClock size={36} strokeWidth={1} />
      </div>

      <h3 className="font-bold mt-4 mb-2">No playlist selected</h3>
      <p>
        Select a playlist to configure the time range
      </p>
    </div>)
}

const TimeRangePresent = () => {
  const { timeRange, setTimeRange, selectedQuickRange, setSelectedQuickRange } = usePlaylistStore()
  
  // Get current values from store (no local state syncing)
  const timezone = timeRange?.timezone || "UTC"
  const startDate = timeRange?.start
  const endDate = timeRange?.end
  const startTime = timeRange?.start ? formatInTimeZone(timeRange.start, timezone, "hh:mm a") : "12:00 PM"
  const endTime = timeRange?.end ? formatInTimeZone(timeRange.end, timezone, "hh:mm a") : "01:00 PM"

  // Get local timezone
  const getLocalTimezone = () => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch {
      return "UTC"
    }
  }

  const timezones = [
    "UTC",
    getLocalTimezone(),
    "America/New_York", // Eastern Time
    "America/Chicago",  // Central Time
    "America/Denver",   // Mountain Time
    "America/Los_Angeles", // Pacific Time
    "Europe/London",    // GMT
  ].filter((tz, index, arr) => arr.indexOf(tz) === index) // Remove duplicates

  const quickRanges = [
    { label: "15m", value: "15m", hours: 0.25 },
    { label: "30m", value: "30m", hours: 0.5 },
    { label: "1h", value: "1h", hours: 1 },
    { label: "2h", value: "2h", hours: 2 },
    { label: "4h", value: "4h", hours: 4 },
    { label: "8h", value: "8h", hours: 8 },
    { label: "12h", value: "12h", hours: 12 },
    { label: "24h", value: "24h", hours: 24 },
  ]

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
  const updateTimeRange = useCallback((newStartDate?: Date, newEndDate?: Date, newStartTime?: string, newEndTime?: string, newTimezone?: string) => {
    const currentStartDate = newStartDate || startDate
    const currentEndDate = newEndDate || endDate
    const currentStartTime = newStartTime || startTime
    const currentEndTime = newEndTime || endTime
    const currentTimezone = newTimezone || timezone

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
      <Tabs defaultValue="jump" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jump">Jump to Time</TabsTrigger>
          <TabsTrigger value="realtime">Real-Time</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jump" className="space-y-4 mt-4">
          {/* Timezone Selection */}
          <div className="mb-2 flex items-center">
            <Label htmlFor="timezone" className="mr-2 my-0">Timezone</Label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 w-full justify-between"
                  id="timezone"
                >
                  {timezone === getLocalTimezone() ? `${timezone} (Local)` : timezone}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[200px]">
                {timezones.map((tz) => (
                  <DropdownMenuItem 
                    key={tz} 
                    onClick={() => {
                      if (timeRange) {
                        // When changing timezone, preserve the same absolute moment
                        // but represent it in the new timezone
                        const newTimeRange: TimeRange = {
                          start: timeRange.start,  // Keep same absolute time
                          end: timeRange.end,      // Keep same absolute time
                          timezone: tz
                        }
                        setTimeRange(newTimeRange)
                      }
                    }}
                    className={timezone === tz ? "bg-accent" : ""}
                  >
                    {tz}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Start Date/Time */}
          <div className="mb-2 flex items-center">
            <Label className="my-0 w-12">Start</Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Input
                      type="text"
                      value={startDate ? formatInTimeZone(startDate, timezone, "MM/dd/yyyy") : ""}
                      readOnly
                      className="pl-10 cursor-pointer"
                      placeholder="MM/DD/YYYY"
                    />
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date && timeRange) {
                        updateTimeRange(date, timeRange.end, undefined, undefined, timeRange.timezone)
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="relative">
                <Input
                  type="text"
                  value={startTime}
                  onChange={(e) => {
                    if (timeRange) {
                      updateTimeRange(timeRange.start, timeRange.end, e.target.value, undefined, timeRange.timezone)
                    }
                  }}
                  className="pl-10"
                  placeholder="12:00 PM"
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* End Date/Time */}
          <div className="mb-4 flex items-center">
            <Label className="my-0 w-12">End</Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Input
                      type="text"
                      value={endDate ? formatInTimeZone(endDate, timezone, "MM/dd/yyyy") : ""}
                      readOnly
                      className="pl-10 cursor-pointer"
                      placeholder="MM/DD/YYYY"
                    />
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      if (date && timeRange) {
                        updateTimeRange(timeRange.start, date, undefined, undefined, timeRange.timezone)
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="relative">
                <Input
                  type="text"
                  value={endTime}
                  onChange={(e) => {
                    if (timeRange) {
                      updateTimeRange(timeRange.start, timeRange.end, undefined, e.target.value, timeRange.timezone)
                    }
                  }}
                  className="pl-10"
                  placeholder="01:00 PM"
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Quick Selection */}
          <div className="flex">
            <Label className="mr-2">Quick</Label>
            <div className="grid grid-cols-6 gap-1">
              {quickRanges.slice(0, 6).map((range) => (
                <Button
                  key={range.value}
                  variant={isQuickRangeActive(range.hours) ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => handleQuickRange(range.hours, range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {quickRanges.slice(6).map((range) => (
                <Button
                  key={range.value}
                  variant={isQuickRangeActive(range.hours) ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => handleQuickRange(range.hours, range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4 mt-4">
          <div className="text-center">
            {/* Timezone Selection */}
            <div className="mb-2 flex items-center">
              <Label htmlFor="timezone" className="mr-2 my-0">Timezone</Label>

                          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 w-full justify-between"
                  id="timezone"
                >
                  {timezone}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[200px]">
                {timezones.map((tz) => (
                  <DropdownMenuItem 
                    key={tz} 
                    onClick={() => {
                      if (timeRange) {
                        // When changing timezone, preserve the same absolute moment
                        // but represent it in the new timezone
                        const newTimeRange: TimeRange = {
                          start: timeRange.start,  // Keep same absolute time
                          end: timeRange.end,      // Keep same absolute time
                          timezone: tz
                        }
                        setTimeRange(newTimeRange)
                      }
                    }}
                    className={timezone === tz ? "bg-accent" : ""}
                  >
                    {tz}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function TimeRange({ className }: { className?: string }) {
  const { selectedPlaylist, timeRange } = usePlaylistStore()
  
  return (
    <Card className={`w-full ${className || ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Time Range
          {timeRange && (
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        {selectedPlaylist ?
          <TimeRangePresent /> : <TimeRangeEmpty />}
      </CardContent>
    </Card>
  )
}
