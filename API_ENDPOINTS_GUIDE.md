# API Endpoints Guide

This document provides a comprehensive guide to all the API endpoints available in the application, organized by module and including usage examples with TanStack Query.

## Table of Contents

1. [Authentication](#authentication)
2. [Radio Playlists](#radio-playlists)
3. [Radio Transmissions](#radio-transmissions)
4. [Radio Trunking Channels](#radio-trunking-channels)
5. [Radio Transcriptions](#radio-transcriptions)
6. [STT Engines](#stt-engines)

## Authentication

### Endpoints
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `DELETE /api/v1/auth/logout` - User logout

### Usage Examples

```tsx
import { useLogin, useLogout, useRefreshToken } from '@/hooks/api'

function LoginComponent() {
  const login = useLogin()
  const logout = useLogout()

  const handleLogin = () => {
    login.mutate({
      email: 'user@example.com',
      password: 'password123'
    })
  }

  const handleLogout = () => {
    logout.mutate()
  }

  return (
    <div>
      <button onClick={handleLogin} disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Login'}
      </button>
      <button onClick={handleLogout} disabled={logout.isPending}>
        {logout.isPending ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  )
}
```

## Radio Playlists

### Endpoints
- `GET /api/v1/radio/playlists` - List all playlists
- `GET /api/v1/radio/playlists/{id}` - Get specific playlist
- `POST /api/v1/radio/playlists` - Create playlist
- `PATCH /api/v1/radio/playlists/{id}` - Update playlist
- `DELETE /api/v1/radio/playlists/{id}` - Delete playlist

### Usage Examples

```tsx
import { usePlaylists, usePlaylist, useCreatePlaylist } from '@/hooks/api'

function PlaylistsComponent() {
  const { data: playlists, isLoading } = usePlaylists({ per_page: 20 })
  const createPlaylist = useCreatePlaylist()

  const handleCreate = () => {
    createPlaylist.mutate({
      name: 'New Playlist',
      description: 'Description here'
    })
  }

  if (isLoading) return <div>Loading playlists...</div>

  return (
    <div>
      {playlists?.radio_playlists.map(playlist => (
        <div key={playlist.id}>{playlist.name}</div>
      ))}
      <button onClick={handleCreate}>Create Playlist</button>
    </div>
  )
}
```

## Radio Transmissions

### Endpoints
- `GET /api/v1/radio/transmissions` - List transmissions
- `GET /api/v1/radio/transmissions/search` - Search transmissions
- `GET /api/v1/radio/transmissions/{id}` - Get specific transmission
- `POST /api/v1/radio/transmissions` - Create transmission
- `PATCH /api/v1/radio/transmissions/{id}` - Update transmission
- `DELETE /api/v1/radio/transmissions/{id}` - Delete transmission

### Search Parameters
- `page` - Page number
- `per_page` - Items per page
- `audio_filename` - Filter by audio filename
- `start_ts` - Filter by start timestamp (YYYY-MM-DD)
- `end_ts` - Filter by end timestamp (YYYY-MM-DD)
- `radio_intercept_id` - Filter by radio intercept ID
- `talkgroup_name` - Filter by talkgroup name
- `channel_ids` - Filter by channel IDs array
- `sort_direction` - Sort direction (asc/desc)

### Usage Examples

```tsx
import { 
  useTransmissions, 
  useSearchTransmissions, 
  useTransmission,
  useTransmissionsByTimeRange 
} from '@/hooks/api'

function TransmissionsComponent() {
  // Basic list
  const { data: transmissions } = useTransmissions({ per_page: 50 })

  // Search with filters
  const { data: searchResults } = useSearchTransmissions({
    start_ts: '2025-01-01',
    end_ts: '2025-01-02',
    talkgroup_name: 'Fire Dispatch',
    sort_direction: 'desc'
  })

  // Get specific transmission
  const { data: transmission } = useTransmission('transmission-id')

  // Get by time range
  const { data: timeRangeResults } = useTransmissionsByTimeRange(
    '2025-01-01',
    '2025-01-02'
  )

  return (
    <div>
      <h3>Recent Transmissions</h3>
      {transmissions?.radio_transmissions.map(tx => (
        <div key={tx.id}>
          {tx.sys_channel_name} - {tx.rx_started_at}
        </div>
      ))}
    </div>
  )
}
```

## Radio Trunking Channels

### Endpoints
- `GET /api/v1/radio/trunking_channels` - List trunking channels
- `GET /api/v1/radio/trunking_channels/{id}` - Get specific trunking channel
- `POST /api/v1/radio/trunking_channels` - Create trunking channel
- `PATCH /api/v1/radio/trunking_channels/{id}` - Update trunking channel
- `DELETE /api/v1/radio/trunking_channels/{id}` - Delete trunking channel

### Trunking Receive Channels
- `GET /api/v1/radio/trunking_receive_channels` - List receive channels
- `GET /api/v1/radio/trunking_receive_channels/{id}` - Get specific receive channel
- `POST /api/v1/radio/trunking_receive_channels` - Create receive channel
- `PATCH /api/v1/radio/trunking_receive_channels/{id}` - Update receive channel
- `DELETE /api/v1/radio/trunking_receive_channels/{id}` - Delete receive channel

### Channel Attributes
- `POST /api/v1/radio/trunking_receive_channels/{channelId}/channel_attribute` - Create channel attribute
- `PATCH /api/v1/radio/trunking_receive_channels/{channelId}/channel_attribute` - Update channel attribute

### Usage Examples

```tsx
import { 
  useTrunkingChannels, 
  useTrunkingReceiveChannels,
  useChannelAttributes,
  useCreateTrunkingChannel 
} from '@/hooks/api'

function ChannelsComponent() {
  const { data: trunkingChannels } = useTrunkingChannels()
  const { data: receiveChannels } = useTrunkingReceiveChannels()
  const createChannel = useCreateTrunkingChannel()

  const handleCreateChannel = () => {
    createChannel.mutate({
      tg_name: 'Fire Dispatch',
      tg_number: '12345'
    })
  }

  return (
    <div>
      <h3>Trunking Channels</h3>
      {trunkingChannels?.radio_trunking_channels.map(channel => (
        <div key={channel.id}>
          {channel.tg_name} ({channel.tg_number})
        </div>
      ))}
      <button onClick={handleCreateChannel}>Create Channel</button>
    </div>
  )
}

function ChannelAttributesComponent({ channelId }: { channelId: string }) {
  const { data: attributes } = useChannelAttributes(channelId)

  return (
    <div>
      <h4>Channel Attributes</h4>
      {attributes?.channel_attributes.map(attr => (
        <div key={attr.id}>
          {attr.attribute_type}: {attr.attribute_value}
        </div>
      ))}
    </div>
  )
}
```

## Radio Transcriptions

### Endpoints
- `GET /api/v1/radio/transcriptions/{id}` - Get specific transcription
- `POST /api/v1/radio/transcriptions` - Create transcription
- `PATCH /api/v1/radio/transcriptions/{id}` - Update transcription
- `DELETE /api/v1/radio/transcriptions/{id}` - Delete transcription

### Usage Examples

```tsx
import { 
  useTranscription, 
  useTranscriptionByTransmission,
  useCreateTranscription 
} from '@/hooks/api'

function TranscriptionComponent({ transmissionId }: { transmissionId: string }) {
  const { data: transcription } = useTranscriptionByTransmission(transmissionId)
  const createTranscription = useCreateTranscription()

  const handleCreate = () => {
    createTranscription.mutate({
      radio_transmission_id: transmissionId,
      language: 'en',
      transcription: 'This is the transcribed text...'
    })
  }

  return (
    <div>
      <h4>Transcription</h4>
      {transcription?.radio_transcription ? (
        <div>
          <p>Language: {transcription.radio_transcription.language}</p>
          <p>Text: {transcription.radio_transcription.transcription}</p>
        </div>
      ) : (
        <button onClick={handleCreate}>Add Transcription</button>
      )}
    </div>
  )
}
```

## STT Engines

### Endpoints
- `GET /api/v1/stt_engines` - List STT engines
- `GET /api/v1/stt_engines/{id}` - Get specific STT engine
- `POST /api/v1/stt_engines` - Create STT engine
- `PATCH /api/v1/stt_engines/{id}` - Update STT engine
- `DELETE /api/v1/stt_engines/{id}` - Delete STT engine

### Usage Examples

```tsx
import { useSttEngines, useSttEngine, useCreateSttEngine } from '@/hooks/api'

function SttEnginesComponent() {
  const { data: engines } = useSttEngines()
  const createEngine = useCreateSttEngine()

  const handleCreate = () => {
    createEngine.mutate({
      name: 'Whisper Large',
      version: '1.0.0',
      configuration: {
        model: 'whisper-large-v3',
        language: 'en'
      }
    })
  }

  return (
    <div>
      <h3>STT Engines</h3>
      {engines?.stt_engines.map(engine => (
        <div key={engine.id}>
          {engine.name} v{engine.version}
        </div>
      ))}
      <button onClick={handleCreate}>Create Engine</button>
    </div>
  )
}
```

## Error Handling

All API hooks include built-in error handling:

```tsx
function MyComponent() {
  const { data, error, isError, isLoading } = useTransmissions()

  if (isLoading) return <div>Loading...</div>
  
  if (isError) {
    return (
      <div className="error">
        <h3>Error loading transmissions</h3>
        <p>{error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    )
  }

  return (
    <div>
      {data?.radio_transmissions.map(tx => (
        <div key={tx.id}>{tx.sys_channel_name}</div>
      ))}
    </div>
  )
}
```

## Query Key Management

Each module has its own query keys for proper cache management:

```tsx
import { transmissionKeys, playlistKeys } from '@/hooks/api'

// Invalidate specific queries
queryClient.invalidateQueries({ queryKey: transmissionKeys.lists() })
queryClient.invalidateQueries({ queryKey: playlistKeys.detail('playlist-id') })

// Invalidate all queries for a module
queryClient.invalidateQueries({ queryKey: transmissionKeys.all })
```

## Authentication Flow

The API automatically handles authentication:

1. **Login**: Stores tokens in localStorage
2. **API Calls**: Automatically includes Authorization header
3. **Token Refresh**: Handled automatically when needed
4. **Logout**: Clears tokens and invalidates all queries

## Best Practices

1. **Use the provided hooks** instead of creating custom ones
2. **Handle loading and error states** in your components
3. **Use appropriate stale times** for different data types
4. **Invalidate related queries** after mutations
5. **Use query keys consistently** for cache management
6. **Enable queries conditionally** when parameters are required

## Migration from Old API

To migrate from the old `useApi.ts` file:

1. Replace imports:
   ```tsx
   // Old
   import { useChannels } from '@/hooks/useApi'
   
   // New
   import { useTrunkingChannels } from '@/hooks/api'
   ```

2. Update hook names and parameters to match the new API structure
3. Update TypeScript interfaces to match the new response formats
4. Test thoroughly with real API endpoints
