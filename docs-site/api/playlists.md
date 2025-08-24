---
outline: deep
---

# Playlists API

The playlists API provides hooks for managing radio playlists, including creating, reading, updating, and deleting playlists with their associated channels.

## Types

### RadioPlaylist
```typescript
interface RadioPlaylist {
  id: string
  name: string
  description?: string
  configuration?: any
  user_id: string
  created_at: string
  updated_at: string
  radio_trunking_receive_channels: any[]
  radio_conventional_receive_channels: any[]
  radio_playlist_channels: RadioPlaylistChannel[]
}
```

### RadioPlaylistChannel
```typescript
interface RadioPlaylistChannel {
  id: string
  playlist_channelable_type: string
  playlist_channelable_id: string
  radio_playlist_id: string
  user_id: string
  position: number
  created_at: string
  updated_at: string
  channelable_details: {
    channel_type: string
    channel: {
      id: string
    }
  }
}
```

### CreatePlaylistData
```typescript
interface CreatePlaylistData {
  name: string
  description?: string
}
```

### UpdatePlaylistData
```typescript
interface UpdatePlaylistData {
  name?: string
  description?: string
}
```

### PaginatedPlaylists
```typescript
interface PaginatedPlaylists {
  radio_playlists: RadioPlaylist[]
  meta: {
    links: {
      first: string
      last: string
      prev: string | null
      next: string | null
    }
  }
}
```

## Query Keys

```typescript
export const playlistKeys = {
  all: ['radio_playlists'] as const,
  lists: () => [...playlistKeys.all, 'list'] as const,
  list: (filters: string) => [...playlistKeys.lists(), { filters }] as const,
  details: () => [...playlistKeys.all, 'detail'] as const,
  detail: (id: string) => [...playlistKeys.details(), id] as const,
}
```

## Hooks

### usePlaylists()

Fetches a paginated list of radio playlists.

**Parameters:**
- `params?: { page?: number; per_page?: number }` - Pagination parameters

**Returns:** `UseQueryResult<PaginatedPlaylists, Error>`

**Example:**
```typescript
import { usePlaylists } from '@/hooks/api'

function PlaylistList() {
  const { data, isLoading, error } = usePlaylists({
    page: 1,
    per_page: 20
  })
  
  if (isLoading) return <div>Loading playlists...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {data?.radio_playlists.map(playlist => (
        <div key={playlist.id}>
          <h3>{playlist.name}</h3>
          <p>{playlist.description}</p>
          <p>Channels: {playlist.radio_playlist_channels.length}</p>
        </div>
      ))}
    </div>
  )
}
```

### usePlaylist()

Fetches a single playlist by ID with all associated channels.

**Parameters:**
- `id: string` - Playlist ID

**Returns:** `UseQueryResult<{ radio_playlist: RadioPlaylist }, Error>`

**Example:**
```typescript
import { usePlaylist } from '@/hooks/api'

function PlaylistDetail({ playlistId }: { playlistId: string }) {
  const { data, isLoading, error } = usePlaylist(playlistId)
  
  if (isLoading) return <div>Loading playlist...</div>
  if (error) return <div>Error: {error.message}</div>
  
  const playlist = data?.radio_playlist
  
  return (
    <div>
      <h2>{playlist?.name}</h2>
      <p>{playlist?.description}</p>
      
      <h3>Channels ({playlist?.radio_playlist_channels.length})</h3>
      <div>
        {playlist?.radio_playlist_channels.map(channel => (
          <div key={channel.id}>
            <span>Position: {channel.position}</span>
            <span>Type: {channel.channelable_details.channel_type}</span>
          </div>
        ))}
      </div>
      
      <h3>Conventional Channels ({playlist?.radio_conventional_receive_channels.length})</h3>
      <h3>Trunking Channels ({playlist?.radio_trunking_receive_channels.length})</h3>
    </div>
  )
}
```

### useCreatePlaylist()

Creates a new radio playlist.

**Returns:** `UseMutationResult<{ radio_playlist: RadioPlaylist }, Error, CreatePlaylistData>`

**Example:**
```typescript
import { useCreatePlaylist } from '@/hooks/api'

function CreatePlaylistForm() {
  const createPlaylist = useCreatePlaylist()
  
  const handleSubmit = (formData: CreatePlaylistData) => {
    createPlaylist.mutate(formData, {
      onSuccess: (data) => {
        console.log('Playlist created:', data.radio_playlist.id)
        // Navigate to playlist detail or update list
      },
      onError: (error) => {
        console.error('Failed to create playlist:', error.message)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="name" 
        placeholder="Playlist Name" 
        required 
      />
      <textarea 
        name="description" 
        placeholder="Description (optional)"
      />
      <button type="submit" disabled={createPlaylist.isPending}>
        {createPlaylist.isPending ? 'Creating...' : 'Create Playlist'}
      </button>
    </form>
  )
}
```

### useUpdatePlaylist()

Updates an existing playlist.

**Returns:** `UseMutationResult<{ radio_playlist: RadioPlaylist }, Error, { id: string; data: UpdatePlaylistData }>`

**Example:**
```typescript
import { useUpdatePlaylist } from '@/hooks/api'

function UpdatePlaylistForm({ playlistId }: { playlistId: string }) {
  const updatePlaylist = useUpdatePlaylist()
  
  const handleSubmit = (data: UpdatePlaylistData) => {
    updatePlaylist.mutate({ id: playlistId, data }, {
      onSuccess: (response) => {
        console.log('Playlist updated:', response.radio_playlist.id)
      },
      onError: (error) => {
        console.error('Failed to update playlist:', error.message)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="name" 
        placeholder="Playlist Name" 
      />
      <textarea 
        name="description" 
        placeholder="Description"
      />
      <button type="submit" disabled={updatePlaylist.isPending}>
        {updatePlaylist.isPending ? 'Updating...' : 'Update Playlist'}
      </button>
    </form>
  )
}
```

### useDeletePlaylist()

Deletes a playlist.

**Returns:** `UseMutationResult<any, Error, string>`

**Example:**
```typescript
import { useDeletePlaylist } from '@/hooks/api'

function DeletePlaylistButton({ playlistId }: { playlistId: string }) {
  const deletePlaylist = useDeletePlaylist()
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      deletePlaylist.mutate(playlistId, {
        onSuccess: () => {
          console.log('Playlist deleted successfully')
          // Navigate away or update list
        },
        onError: (error) => {
          console.error('Failed to delete playlist:', error.message)
        }
      })
    }
  }
  
  return (
    <button 
      onClick={handleDelete}
      disabled={deletePlaylist.isPending}
      className="text-red-600"
    >
      {deletePlaylist.isPending ? 'Deleting...' : 'Delete Playlist'}
    </button>
  )
}
```

## Playlist Channel Management

Playlists can contain both conventional and trunking channels. The playlist structure includes:

### Channel Types
- **Conventional Channels**: Standard radio channels with fixed frequencies
- **Trunking Channels**: Dynamic channels that can change frequencies
- **Playlist Channels**: Association records linking channels to playlists

### Channel Association
```typescript
// Playlist channels are ordered by position
interface RadioPlaylistChannel {
  position: number // Determines order in playlist
  channelable_type: string // Type of channel (conventional/trunking)
  channelable_id: string // ID of the specific channel
}
```

## Caching Strategy

Playlists use an efficient caching strategy:
- List queries are cached for 5 minutes with background refetching
- Detail queries are cached until invalidated
- Mutations automatically invalidate related queries
- Optimistic updates for better UX

## Error Handling

All playlist hooks include comprehensive error handling:
- Network errors are automatically caught and formatted
- HTTP error responses include status codes and error details
- Query invalidation ensures data consistency after mutations
- User-friendly error messages for common scenarios

## Integration with Channel APIs

Playlists integrate with the channel APIs:
- Use `usePlaylistChannels()` for managing channel associations
- Use `useConventionalChannel()` and `useTrunkingChannel()` for channel details
- Automatic query invalidation when channels are modified

## Usage Patterns

### Creating a Playlist with Channels
```typescript
import { useCreatePlaylist, usePlaylistChannels } from '@/hooks/api'

function CreatePlaylistWithChannels() {
  const createPlaylist = useCreatePlaylist()
  const addChannelToPlaylist = usePlaylistChannels().useAddChannelToPlaylist()
  
  const handleCreateWithChannels = async (playlistData: CreatePlaylistData, channelIds: string[]) => {
    // Create playlist first
    const playlist = await createPlaylist.mutateAsync(playlistData)
    
    // Add channels to playlist
    for (let i = 0; i < channelIds.length; i++) {
      await addChannelToPlaylist.mutateAsync({
        playlistId: playlist.radio_playlist.id,
        channelId: channelIds[i],
        position: i + 1
      })
    }
  }
  
  return (
    <div>
      {/* Form implementation */}
    </div>
  )
}
```

### Managing Playlist Channels
```typescript
import { usePlaylist, usePlaylistChannels } from '@/hooks/api'

function PlaylistChannelManager({ playlistId }: { playlistId: string }) {
  const { data: playlist } = usePlaylist(playlistId)
  const { useRemoveChannelFromPlaylist, useReorderPlaylistChannels } = usePlaylistChannels()
  
  const removeChannel = useRemoveChannelFromPlaylist()
  const reorderChannels = useReorderPlaylistChannels()
  
  const handleRemoveChannel = (channelId: string) => {
    removeChannel.mutate({ playlistId, channelId })
  }
  
  const handleReorder = (channelId: string, newPosition: number) => {
    reorderChannels.mutate({ playlistId, channelId, position: newPosition })
  }
  
  return (
    <div>
      {playlist?.radio_playlist.radio_playlist_channels.map(channel => (
        <div key={channel.id}>
          <span>{channel.position}. {channel.channelable_details.channel_type}</span>
          <button onClick={() => handleRemoveChannel(channel.id)}>Remove</button>
        </div>
      ))}
    </div>
  )
}
```
