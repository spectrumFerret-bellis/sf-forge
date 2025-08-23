import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { RadioPlaylistChannel } from './playlists'
import type { RadioConventionalChannel, RadioTrunkingChannel } from './channels'
import type { TimeRange } from '@/stores/playlistStore'
import { toZonedTime } from 'date-fns-tz'

export interface PlaylistChannelWithDetails {
  id: string
  position: number
  channel_type: string
  channel_id: string
  channel_name: string
  tx_count: number
  frequency_hz?: number
  tg_name?: string
  tg_number?: string
}

// Convert time range to UTC for API calls
const convertTimeRangeToUTC = (timeRange: TimeRange) => {
  return {
    start: timeRange.start.toISOString(), // Already in UTC
    end: timeRange.end.toISOString()      // Already in UTC
  }
}

// Hook to get all channel details for a playlist
export function usePlaylistChannels(playlistId: string, timeRange?: TimeRange) {
  // Create a stable key for the time range to prevent infinite re-renders
  // Only include UTC times, not timezone (since timezone doesn't affect API data)
  const timeRangeKey = timeRange ? {
    start: timeRange.start.toISOString(),
    end: timeRange.end.toISOString()
  } : undefined

  return useQuery({
    queryKey: ['playlist', 'channels', playlistId, timeRangeKey],
    queryFn: async (): Promise<{ channels: PlaylistChannelWithDetails[] }> => {
      if (!playlistId) {
        return { channels: [] }
      }

      // Check authentication status
      const token = localStorage.getItem('access_token')

      try {
        // Get playlist details with channels
        const playlistResponse = await api.get(`/radio/playlists/${playlistId}`) as any
        
        // Try to get the playlist from different possible response structures
        let playlist: any = null
        
        if (playlistResponse?.data?.radio_playlist) {
          playlist = playlistResponse.data.radio_playlist
        } else if (playlistResponse?.radio_playlist) {
          playlist = playlistResponse.radio_playlist
        } else {
          return { channels: [] }
        }
        
        
        if (!playlist.radio_playlist_channels || playlist.radio_playlist_channels.length === 0) {
          return { channels: [] }
        }

        // Step 1: Get all channel details first
        const channelDetailsPromises = playlist.radio_playlist_channels.map(async (channel: RadioPlaylistChannel) => {
          const receiveChannelId = channel.playlist_channelable_id
          const channelType = channel.playlist_channelable_type
          
          try {
            let channelDetails: any = null

            // Get the receive channel details to find the actual channel ID
            if (channelType.includes('Conventional')) {
              try {
                // Get conventional receive channel
                const receiveResponse = await api.get(`/radio/conventional_receive_channels/${receiveChannelId}`) as any
                
                // Handle different possible response structures
                const receiveChannel = receiveResponse?.data?.radio_conventional_receive_channel || 
                                     receiveResponse?.radio_conventional_receive_channel ||
                                     receiveResponse?.data
                
                if (!receiveChannel) {
                  return {
                    id: channel.id,
                    position: channel.position,
                    channel_type: channelType.replace('Radio::', '').replace('ReceiveChannel', ''),
                    channel_id: receiveChannelId,
                    channel_name: `Channel ${receiveChannelId}`,
                  }
                }
                
                
                const conventionalChannelId = receiveChannel.radio_conventional_channel_id
                if (!conventionalChannelId) {
                  return {
                    id: channel.id,
                    position: channel.position,
                    channel_type: channelType.replace('Radio::', '').replace('ReceiveChannel', ''),
                    channel_id: receiveChannelId,
                    channel_name: `Channel ${receiveChannelId}`,
                  }
                }
                
                // Get the actual conventional channel
                const channelResponse = await api.get(`/radio/conventional_channels/${conventionalChannelId}`) as any
                
                // Handle different possible response structures
                channelDetails = channelResponse?.data?.radio_conventional_channel || 
                               channelResponse?.radio_conventional_channel ||
                               channelResponse?.data
                
              } catch (error) {
                console.warn(`Failed to fetch conventional channel details for ${receiveChannelId}:`, error)
              }
            } else if (channelType.includes('Trunking')) {
              try {
                // Get trunking receive channel
                const receiveResponse = await api.get(`/radio/trunking_receive_channels/${receiveChannelId}`) as any
                
                // Handle different possible response structures
                const receiveChannel = receiveResponse?.data?.radio_trunking_receive_channel || 
                                     receiveResponse?.radio_trunking_receive_channel ||
                                     receiveResponse?.data
                
                if (!receiveChannel) {
                  return {
                    id: channel.id,
                    position: channel.position,
                    channel_type: channelType.replace('Radio::', '').replace('ReceiveChannel', ''),
                    channel_id: receiveChannelId,
                    channel_name: `Channel ${receiveChannelId}`,
                  }
                }
                
                
                const trunkingChannelId = receiveChannel.radio_trunking_channel_id
                if (!trunkingChannelId) {
                  return {
                    id: channel.id,
                    position: channel.position,
                    channel_type: channelType.replace('Radio::', '').replace('ReceiveChannel', ''),
                    channel_id: receiveChannelId,
                    channel_name: `Channel ${receiveChannelId}`,
                  }
                }
                
                // Get the actual trunking channel
                const channelResponse = await api.get(`/radio/trunking_channels/${trunkingChannelId}`) as any
                
                // Handle different possible response structures
                channelDetails = channelResponse?.data?.radio_trunking_channel || 
                               channelResponse?.radio_trunking_channel ||
                               channelResponse?.data
              } catch (error) {
                console.warn(`Failed to fetch trunking channel details for ${receiveChannelId}:`, error)
              }
            }

            const result = {
              id: channel.id,
              position: channel.position,
              channel_type: channelType.replace('Radio::', '').replace('ReceiveChannel', ''),
              channel_id: receiveChannelId,
              channel_name: channelDetails?.name || channelDetails?.tg_name || `Channel ${receiveChannelId}`,
              frequency_hz: channelDetails?.frequency_hz,
              tg_name: channelDetails?.tg_name,
              tg_number: channelDetails?.tg_number,
            }
            
            return result
          } catch (error) {
            console.error(`Failed to fetch details for channel ${receiveChannelId}:`, error)
            return {
              id: channel.id,
              position: channel.position,
              channel_type: channelType.replace('Radio::', '').replace('ReceiveChannel', ''),
              channel_id: receiveChannelId,
              channel_name: `Error loading channel ${receiveChannelId}`,
            }
          }
        })

        const channelDetails = await Promise.all(channelDetailsPromises)

        // Step 2: Get all transmissions for all channels in one call
        // Use the receive channel IDs (playlist_channelable_id) for the transmission search
        const receiveChannelIds = playlist.radio_playlist_channels.map((ch: RadioPlaylistChannel) => ch.playlist_channelable_id)
        
        let allTransmissions: any[] = []
        
        try {
          const queryParams = receiveChannelIds.map((id: string) => `channel_ids[]=${id}`).join('&')
          
          // Add time range parameters if provided (always use UTC for API)
          let transmissionQuery = `per_page=1000&${queryParams}`
          if (timeRange) {
            const utcTimeRange = convertTimeRangeToUTC(timeRange)
            transmissionQuery += `&start_ts=${utcTimeRange.start}&end_ts=${utcTimeRange.end}`
          }
          
          const transmissionsResponse = await api.get(`/radio/transmissions/search?${transmissionQuery}`) as any
          
          // Handle different possible response structures
          allTransmissions = transmissionsResponse?.data?.radio_transmissions || 
                           transmissionsResponse?.radio_transmissions ||
                           transmissionsResponse?.data ||
                           []
          
        } catch (error) {
          console.warn('Failed to fetch transmissions:', error)
        }

        // Step 3: Count transmissions per channel
        const transmissionCounts = new Map<string, number>()
        allTransmissions.forEach(transmission => {
          const channelId = transmission.channel_details?.id
          if (channelId) {
            transmissionCounts.set(channelId, (transmissionCounts.get(channelId) || 0) + 1)
          }
        })

        // Step 4: Combine channel details with transmission counts
        const channels = channelDetails.map((channel: any) => {
          // Match by the receive channel ID (playlist_channelable_id)
          const txCount = transmissionCounts.get(channel.channel_id) || 0
          
          return {
            ...channel,
            tx_count: txCount
          }
        })

        return { channels }
      } catch (error) {
        console.error('Failed to fetch playlist channels:', error)
        return { channels: [] }
      }
    },
    enabled: !!playlistId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
