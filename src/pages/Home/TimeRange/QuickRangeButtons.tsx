import { Button } from "@/components/ui/button"
import { usePlaylistStore } from '@/stores/playlistStore'

export function QuickRangeButtons() {
  const timeRange = usePlaylistStore(state => state.timeRange)
  const setTimeRange = usePlaylistStore(state => state.setTimeRange)
  const setSelectedQuickRange = usePlaylistStore(state => state.setSelectedQuickRange)
  const timezone = timeRange?.timezone || "UTC"
  
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

  // Handle quick range selection
  const handleQuickRange = (hours: number, rangeValue: string) => {
    // Create time range - always use UTC for consistency
    const now = new Date()
    const start = new Date(now.getTime() - (hours * 60 * 60 * 1000))
    
    const newTimeRange = {
      start,
      end: now,
      timezone
    }
    
    setTimeRange(newTimeRange)
    setSelectedQuickRange(rangeValue)
  }

  // Check if a quick range is currently active
  const isQuickRangeActive = (hours: number) => {
    if (!timeRange) return false
    const now = new Date()
    const expectedStart = new Date(now.getTime() - (hours * 60 * 60 * 1000))
    const startDiff = Math.abs(timeRange.start.getTime() - expectedStart.getTime())
    const endDiff = Math.abs(timeRange.end.getTime() - now.getTime())
    // Allow 1 minute tolerance for rounding
    return startDiff < 60000 && endDiff < 60000
  }
  
  return (
    <div className="flex">
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
  )
}