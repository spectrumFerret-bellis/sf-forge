import * as Dropdown from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from 'lucide-react'
import { usePlaylistStore, type TimeRange } from '@/stores/playlistStore'

export function TimezoneDropdown() {
  const timeRange = usePlaylistStore(state => state.timeRange)
  const setTimeRange = usePlaylistStore(state => state.setTimeRange)
  const timezone = timeRange?.timezone || "UTC"
  
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

  return (
    <Dropdown.DropdownMenu>
      <Dropdown.DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex-1 w-full justify-between"
          id="timezone"
        >
          {timezone}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </Dropdown.DropdownMenuTrigger>
    
      <Dropdown.DropdownMenuContent className="w-full min-w-[200px]">
        {timezones.map((tz) => (
          <Dropdown.DropdownMenuItem 
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
          </Dropdown.DropdownMenuItem>
        ))}
      </Dropdown.DropdownMenuContent>
    </Dropdown.DropdownMenu>
  )
}