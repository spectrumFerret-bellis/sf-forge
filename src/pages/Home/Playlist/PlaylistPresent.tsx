import { ChevronDown }        from 'lucide-react'

import * as Dropdown          from "@/components/ui/dropdown-menu"
import { Button }             from "@/components/ui/button"
import type { RadioPlaylist } from '@/hooks/api/playlists'

import { usePlaylistStore }   from '@/stores/playlistStore'


export function PlaylistPresent({ playlists }: { playlists: RadioPlaylist[] }) {
  const selectedPlaylist = usePlaylistStore(state => state.selectedPlaylist)
  const setSelectedPlaylist = usePlaylistStore(state => state.setSelectedPlaylist)

  return (<div className="w-full h-full flex flex-col justify-between">
    <div>
      <Dropdown.DropdownMenu>
        <Dropdown.DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex-1 w-full justify-between"
            id="playlist-selector"
          >
            {selectedPlaylist?.name || 'Select a playlist'}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </Dropdown.DropdownMenuTrigger>
        <Dropdown.DropdownMenuContent className="w-full min-w-[200px]">
          {playlists.map((playlist) => (
            <Dropdown.DropdownMenuItem 
              key={playlist.id} 
              onClick={() => setSelectedPlaylist(playlist)}
              className={selectedPlaylist?.id === playlist.id ? "bg-accent" : ""}
            >
              {playlist.name}
            </Dropdown.DropdownMenuItem>
          ))}
        </Dropdown.DropdownMenuContent>
      </Dropdown.DropdownMenu>
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