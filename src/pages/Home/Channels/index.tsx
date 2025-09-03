import { Antenna } from 'lucide-react'

import { usePlaylistStore }    from '@/stores/playlistStore'
import { usePlaylistChannels } from '@/hooks/api/playlistChannels'

import { ChannelsLoading }     from './ChannelsLoading'
import { ChannelsPresent }     from './ChannelsPresent'
import { CardWrapper, CardEmptyContent } from './../cardComponents'


function CardBodyContent() {
  const selectedPlaylist = usePlaylistStore(state => state.selectedPlaylist)
  const timeRange = usePlaylistStore(state => state.timeRange)

  const { data: channelsData, isLoading, error } = 
    usePlaylistChannels(selectedPlaylist?.id || '', timeRange || undefined)

  if (!selectedPlaylist) {
    return (
      <CardEmptyContent 
        icon={<Antenna size={36} strokeWidth={1} />} 
        title="No playlist selected"
        description="Select a playlist to view available channels" />
    )
  }

  if (isLoading) {
    return <ChannelsLoading />
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">Error loading channels</p>
      </div>
    )
  }

  if (channelsData?.channels?.length > 0) {
    return <ChannelsPresent channels={channelsData.channels} />
  }

  return (<div className="text-center">
    <p>No channels found in this playlist</p>
  </div>)
}

export function Channels({ className }) {
  return (
    <CardWrapper title="Channels" className={className}>
      <CardBodyContent />
    </CardWrapper>
  )
}
