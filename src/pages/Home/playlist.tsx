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

import { AudioLines, MapPin, ChevronDown, AlertCircle } from 'lucide-react'
import type { RadioPlaylist } from '@/hooks/api/playlists'
import { usePlaylistStore } from '@/stores/playlistStore'

interface PlaylistProps {
  playlists  : RadioPlaylist[]
  isLoading? : boolean
  error?     : Error | null
  className? : string
}

interface CardWrapProps {
  children: React.ReactNode
  className?: string
}

const CardWrap = ({ children, className }: CardWrapProps) => {
  const CSS_CONTENT = 
    "pb-5 h-full justify-center items-center flex text-slate-600 dark:text-slate-300"

  return (<Card className={`w-full max-w-sm ${className || ''}`}>
      <CardHeader>
        <CardTitle>Playlist</CardTitle>
      </CardHeader>
      <CardContent className={CSS_CONTENT}>
        {children}
      </CardContent>
    </Card>)
}

const PlaylistLoading = () => {
  return (
    <div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <AudioLines size={36} strokeWidth={1} />
      </div>

      <h3 className="font-bold mt-4 mb-2">Loading Playlists</h3>
      
      {/* 3-dot bounce animation */}
      <div className="flex justify-center space-x-1 mt-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
            style={{
              animation: 'bounce-dots 1.4s infinite ease-in-out',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Fetching available playlists...
      </p>
    </div>
  )
}

const PlaylistError = ({ error }: { error: Error }) => {
  return (
    <div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-red-100 dark:bg-red-900/20">
        <AlertCircle size={36} strokeWidth={1} className="text-red-500" />
      </div>

      <h3 className="font-bold mt-4 mb-2 text-red-600 dark:text-red-400">
        Error Loading Playlists
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {error.message || 'Failed to load playlists. Please try again.'}
      </p>
    </div>
  )
}

const PlaylistEmpty = () => {
  return (<div className="text-center flex flex-col items-center">
      <div className="dash-card-icon bg-gray-100 dark:bg-gray-850">
        <AudioLines size={36} strokeWidth={1} />
      </div>

      <h3 className="font-bold mt-4 mb-2">No playlist selected</h3>
      <p>
        There are no playlists available for this user.
      </p>
    </div>)
}

const PlaylistPresent = ({ playlists }: { playlists: RadioPlaylist[] }) => {
  // Zustand store for UI state
  const { selectedPlaylist, setSelectedPlaylist } = usePlaylistStore()

  return (<div className="w-full h-full flex flex-col justify-between">
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex-1 w-full justify-between"
            id="playlist-selector"
          >
            {selectedPlaylist?.name || 'Select a playlist'}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px]">
          {playlists.map((playlist) => (
            <DropdownMenuItem 
              key={playlist.id} 
              onClick={() => setSelectedPlaylist(playlist)}
              className={selectedPlaylist?.id === playlist.id ? "bg-accent" : ""}
            >
              {playlist.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-right mt-1">Playlists Available: {playlists?.length || 0}</p>
    </div>

    <div>
      <h3 className="font-bold text-xl">Playlist Information</h3>
      <hr className="mb-4" />
      <div className="grid grid-cols-4">
        <h4 className="col-span-1">Name:</h4>
        <p className="col-span-3">{selectedPlaylist?.name || 'N/A (Select a playlist)'}</p>
      </div>
      <div className="grid grid-cols-4">
        <h4 className="col-span-1">Trunking Channels:</h4>
        <p className="col-span-3">
          {selectedPlaylist 
            ? selectedPlaylist.radio_trunking_receive_channels?.length || 0
            : 'N/A (Select a playlist)'
          }
        </p>
      </div>
      <div className="grid grid-cols-4">
        <h4 className="col-span-1">Conventional Channels:</h4>
        <p className="col-span-3">
          {selectedPlaylist 
            ? selectedPlaylist.radio_conventional_receive_channels?.length || 0
            : 'N/A (Select a playlist)'
          }
        </p>
      </div>
      <div className="grid grid-cols-4">
        <h4 className="col-span-1">Total Channels:</h4>
        <p className="col-span-3">
          {selectedPlaylist 
            ? selectedPlaylist.radio_playlist_channels?.length || 0
            : 'N/A (Select a playlist)'
          }
        </p>
      </div>
    </div>
  </div>)
}

export function Playlist({ playlists, isLoading, error, className }: PlaylistProps) {
  if (isLoading) 
    return <CardWrap 
      className={className} children={<PlaylistLoading />} />

  if (error) 
    return <CardWrap 
      className={className} children={<PlaylistError error={error} />} />

  if (!playlists || playlists.length === 0) 
    return <CardWrap 
      className={className} children={<PlaylistEmpty />} />

  return <CardWrap 
    className={className} children={<PlaylistPresent playlists={playlists} />} />
}
