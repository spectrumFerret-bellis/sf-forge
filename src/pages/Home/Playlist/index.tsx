import { AudioLines } from 'lucide-react'

import type { RadioPlaylist } from '@/hooks/api/playlists'
import { usePlaylists }       from '@/hooks/api'

import { PlaylistLoading }    from './PlaylistLoading'
import { PlaylistError }      from './PlaylistError'
import { PlaylistPresent }    from './PlaylistPresent'

import { CardWrapper, CardEmptyContent } from './../cardComponents'


export function Playlist({ className }) {
  const { data, isLoading, error } = usePlaylists()

  const getCardContent = (state) => {
    if (isLoading) {
      return <PlaylistLoading />
    } else if (error) {
      return <PlaylistError error={error} />
    } else if (!data || data.length === 0) {
      return (
        <CardEmptyContent 
          icon={<AudioLines size={36} strokeWidth={1} />} 
          title="No playlist selected"
          description="There are no playlists available for this user." />
      )
    }

    return <PlaylistPresent playlists={data.radio_playlists} />
  }

  return (
    <CardWrapper title="Playlist" className={className}>
      {getCardContent()}
    </CardWrapper>
  )
}
