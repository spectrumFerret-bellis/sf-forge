
import * as Tabs from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { usePlaylistStore } from '@/stores/playlistStore'
import { TimezoneDropdown } from './TimezoneDropdown'
import { PopoverCalendar } from './PopoverCalendar'
import { TimeSelectInput } from './TimeSelectInput'
import { QuickRangeButtons } from './QuickRangeButtons'

export function TimeRangePresent() {
  const timeRange = usePlaylistStore(state => state.timeRange)
  
  // Get current values from store (no local state syncing)
  const timezone  = timeRange?.timezone || "UTC"
  const startDate = timeRange?.start
  const endDate   = timeRange?.end


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
            <PopoverCalendar userDate={startDate || undefined} timezone={timezone} />
            <TimeSelectInput />
          </div>

          {/* End Date/Time */}
          <div className="mb-4 flex items-center">
            <Label className="my-0 w-12">End</Label>
            <div className="grid grid-cols-2 gap-2">
              <PopoverCalendar userDate={endDate || undefined} timezone={timezone} />
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
              <TimezoneDropdown />
            </div>
          </div>
        </Tabs.TabsContent>
      </Tabs.Tabs>
    </div>
  )
}