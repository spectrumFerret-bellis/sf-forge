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

import { CalendarClock, MapPin, ChevronDown, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { useState } from 'react'
import { format } from "date-fns"

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
  const [timezone, setTimezone] = useState("Eastern Time (US & Canada)")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2025, 7, 22)) // August 22, 2025
  const [startTime, setStartTime] = useState("12:07 PM")
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(2025, 7, 22)) // August 22, 2025
  const [endTime, setEndTime] = useState("01:07 PM")

  const timezones = [
    "Eastern Time (US & Canada)",
    "Central Time (US & Canada)",
    "Mountain Time (US & Canada)",
    "Pacific Time (US & Canada)",
    "UTC",
    "GMT"
  ]

  const quickRanges = [
    { label: "15m", value: "15m" },
    { label: "30m", value: "30m" },
    { label: "1h", value: "1h" },
    { label: "2h", value: "2h" },
    { label: "4h", value: "4h" },
    { label: "8h", value: "8h" },
    { label: "12h", value: "12h" },
    { label: "24h", value: "24h" },
  ]

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

            <DropdownMenu className="flex-1">
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
                    onClick={() => setTimezone(tz)}
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
                      value={startDate ? format(startDate, "MM/dd/yyyy") : ""}
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
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="relative">
                <Input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="pl-10"
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
                      value={endDate ? format(endDate, "MM/dd/yyyy") : ""}
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
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="relative">
                <Input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="pl-10"
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
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {range.label}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {quickRanges.slice(6).map((range) => (
                <Button
                  key={range.value}
                  variant="outline"
                  size="sm"
                  className="text-xs"
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

              <DropdownMenu className="flex-1">
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
                      onClick={() => setTimezone(tz)}
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

export function TimeRange({ playlist = true, className }) {
  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader>
        <CardTitle>Time Range</CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        {playlist ?
          <TimeRangePresent playlist={playlist} /> : <TimeRangeEmpty />}
      </CardContent>
    </Card>
  )
}
