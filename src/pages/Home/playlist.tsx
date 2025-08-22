import { useState } from 'react'

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { AudioLines, MapPin, ChevronDown } from 'lucide-react'

const PlaylistEmpty = () => {
  return (<div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <AudioLines size={36} strokeWidth={1} />
      </div>

      <h3 className="font-bold mt-4 mb-2">No playlist selected</h3>
      <p>
        Select a playlist to configure the time range
      </p>
    </div>)
}

const PlaylistPresent = () => {
  const [timezone, setTimezone] = useState("Eastern Time (US & Canada)")
  const timezones = [
      "Eastern Time (US & Canada)",
      "Central Time (US & Canada)",
      "Mountain Time (US & Canada)",
      "Pacific Time (US & Canada)",
      "UTC",
      "GMT"
    ]

  return (<div className="w-full h-full flex flex-col justify-between">
    <div>
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
              onClick={() => setTimezone(tz)}
              className={timezone === tz ? "bg-accent" : ""}
            >
              {tz}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-right mt-1">Playlists Available: {3}</p>
    </div>

    <div>
      <h3 className="font-bold text-xl">Playlist Information</h3>
      <hr className="mb-4" />
      <div className="grid grid-cols-4">
        <h4 className="col-span-1">Name:</h4>
        <p className="col-span-3">{timezone}</p>
      </div>
      <div className="grid grid-cols-4">
        <h4 className="col-span-1">Channels:</h4>
        <p className="col-span-3">{4}</p>
      </div>
    </div>
  </div>)
}

export function Playlist({ playlist = true, className }) {
  return (
    <Card className={`w-full max-w-sm ${className}`}>
      <CardHeader>
        <CardTitle>Playlist</CardTitle>
      </CardHeader>
      <CardContent className="pb-5 h-full justify-center items-center flex text-slate-600 dark:text-slate-300">
        {playlist ?
          <PlaylistPresent playlist={playlist} /> : <PlaylistEmpty />}
      </CardContent>
    </Card>
  )
}
