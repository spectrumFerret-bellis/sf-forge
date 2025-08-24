---
outline: deep
---

# Trunking Channels API

The trunking channels API provides hooks for managing trunked radio system channels, including talk groups, receive channels, and channel attributes. This API supports creating, reading, updating, and deleting trunking channel configurations.

## Types

### RadioTrunkingChannel
```typescript
interface RadioTrunkingChannel {
  id: string
  tg_name: string
  tg_number: string
  created_at: string
  updated_at: string
}
```

### RadioTrunkingReceiveChannel
```typescript
interface RadioTrunkingReceiveChannel {
  id: string
  radio_intercept_id: string
  radio_trunking_channel_id: string
  created_at: string
  updated_at: string
}
```

### ChannelAttribute
```typescript
interface ChannelAttribute {
  id: string
  channel_id: string
  attribute_type: string
  attribute_value: string
  created_at: string
  updated_at: string
}
```

### CreateTrunkingChannelData
```typescript
interface CreateTrunkingChannelData {
  tg_name: string
  tg_number: string
}
```

### UpdateTrunkingChannelData
```typescript
interface UpdateTrunkingChannelData {
  tg_name?: string
  tg_number?: string
}
```

### CreateReceiveChannelData
```typescript
interface CreateReceiveChannelData {
  radio_intercept_id: string
  radio_trunking_channel_id: string
}
```

### UpdateReceiveChannelData
```typescript
interface UpdateReceiveChannelData {
  radio_intercept_id?: string
  radio_trunking_channel_id?: string
}
```

### CreateChannelAttributeData
```typescript
interface CreateChannelAttributeData {
  attribute_type: string
  attribute_value: string
}
```

### UpdateChannelAttributeData
```typescript
interface UpdateChannelAttributeData {
  attribute_type?: string
  attribute_value?: string
}
```

### PaginatedTrunkingChannels
```typescript
interface PaginatedTrunkingChannels {
  radio_trunking_channels: RadioTrunkingChannel[]
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

### PaginatedTrunkingReceiveChannels
```typescript
interface PaginatedTrunkingReceiveChannels {
  radio_trunking_receive_channels: RadioTrunkingReceiveChannel[]
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
export const trunkingChannelKeys = {
  all: ['radio_trunking_channels'] as const,
  lists: () => [...trunkingChannelKeys.all, 'list'] as const,
  list: (filters: string) => [...trunkingChannelKeys.lists(), { filters }] as const,
  details: () => [...trunkingChannelKeys.all, 'detail'] as const,
  detail: (id: string) => [...trunkingChannelKeys.details(), id] as const,
  attributes: (channelId: string) => [...trunkingChannelKeys.detail(channelId), 'attributes'] as const,
}

export const trunkingReceiveChannelKeys = {
  all: ['radio_trunking_receive_channels'] as const,
  lists: () => [...trunkingReceiveChannelKeys.all, 'list'] as const,
  list: (filters: string) => [...trunkingReceiveChannelKeys.lists(), { filters }] as const,
  details: () => [...trunkingReceiveChannelKeys.all, 'detail'] as const,
  detail: (id: string) => [...trunkingReceiveChannelKeys.details(), id] as const,
}
```

## Hooks

### useTrunkingChannels()

Fetches a paginated list of trunking channels.

**Parameters:**
- `params?: { page?: number; per_page?: number }` - Pagination parameters

**Returns:** `UseQueryResult<PaginatedTrunkingChannels, Error>`

**Example:**
```typescript
import { useTrunkingChannels } from '@/hooks/api'

function TrunkingChannelList() {
  const { data, isLoading, error } = useTrunkingChannels({
    page: 1,
    per_page: 20
  })
  
  if (isLoading) return <div>Loading trunking channels...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {data?.radio_trunking_channels.map(channel => (
        <div key={channel.id}>
          <h3>{channel.tg_name}</h3>
          <p>Talk Group Number: {channel.tg_number}</p>
          <p>Created: {new Date(channel.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )
}
```

### useTrunkingChannel()

Fetches a single trunking channel by ID.

**Parameters:**
- `id: string` - Trunking channel ID

**Returns:** `UseQueryResult<{ radio_trunking_channel: RadioTrunkingChannel }, Error>`

**Example:**
```typescript
import { useTrunkingChannel } from '@/hooks/api'

function TrunkingChannelDetail({ channelId }: { channelId: string }) {
  const { data, isLoading, error } = useTrunkingChannel(channelId)
  
  if (isLoading) return <div>Loading channel...</div>
  if (error) return <div>Error: {error.message}</div>
  
  const channel = data?.radio_trunking_channel
  
  return (
    <div>
      <h2>Trunking Channel Details</h2>
      <p><strong>Talk Group Name:</strong> {channel?.tg_name}</p>
      <p><strong>Talk Group Number:</strong> {channel?.tg_number}</p>
      <p><strong>Created:</strong> {new Date(channel?.created_at || '').toLocaleString()}</p>
      <p><strong>Updated:</strong> {new Date(channel?.updated_at || '').toLocaleString()}</p>
    </div>
  )
}
```

### useTrunkingReceiveChannels()

Fetches a paginated list of trunking receive channels.

**Parameters:**
- `params?: { page?: number; per_page?: number }` - Pagination parameters

**Returns:** `UseQueryResult<PaginatedTrunkingReceiveChannels, Error>`

**Example:**
```typescript
import { useTrunkingReceiveChannels } from '@/hooks/api'

function TrunkingReceiveChannelList() {
  const { data, isLoading, error } = useTrunkingReceiveChannels({
    page: 1,
    per_page: 20
  })
  
  if (isLoading) return <div>Loading receive channels...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {data?.radio_trunking_receive_channels.map(receiveChannel => (
        <div key={receiveChannel.id}>
          <h3>Receive Channel {receiveChannel.id}</h3>
          <p>Radio Intercept ID: {receiveChannel.radio_intercept_id}</p>
          <p>Trunking Channel ID: {receiveChannel.radio_trunking_channel_id}</p>
        </div>
      ))}
    </div>
  )
}
```

### useChannelAttributes()

Fetches attributes for a specific trunking channel.

**Parameters:**
- `channelId: string` - Trunking channel ID

**Returns:** `UseQueryResult<ChannelAttribute[], Error>`

**Example:**
```typescript
import { useChannelAttributes } from '@/hooks/api'

function ChannelAttributes({ channelId }: { channelId: string }) {
  const { data, isLoading, error } = useChannelAttributes(channelId)
  
  if (isLoading) return <div>Loading attributes...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      <h3>Channel Attributes</h3>
      {data?.map(attribute => (
        <div key={attribute.id}>
          <p><strong>{attribute.attribute_type}:</strong> {attribute.attribute_value}</p>
        </div>
      ))}
    </div>
  )
}
```

### useCreateTrunkingChannel()

Creates a new trunking channel.

**Returns:** `UseMutationResult<{ radio_trunking_channel: RadioTrunkingChannel }, Error, CreateTrunkingChannelData>`

**Example:**
```typescript
import { useCreateTrunkingChannel } from '@/hooks/api'

function CreateTrunkingChannelForm() {
  const createChannel = useCreateTrunkingChannel()
  
  const handleSubmit = (formData: CreateTrunkingChannelData) => {
    createChannel.mutate(formData, {
      onSuccess: (data) => {
        console.log('Trunking channel created:', data.radio_trunking_channel.id)
        // Navigate to channel detail or update list
      },
      onError: (error) => {
        console.error('Failed to create trunking channel:', error.message)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="tg_name" 
        placeholder="Talk Group Name" 
        required 
      />
      <input 
        type="text" 
        name="tg_number" 
        placeholder="Talk Group Number" 
        required 
      />
      <button type="submit" disabled={createChannel.isPending}>
        {createChannel.isPending ? 'Creating...' : 'Create Trunking Channel'}
      </button>
    </form>
  )
}
```

### useUpdateTrunkingChannel()

Updates an existing trunking channel.

**Returns:** `UseMutationResult<{ radio_trunking_channel: RadioTrunkingChannel }, Error, { id: string; data: UpdateTrunkingChannelData }>`

**Example:**
```typescript
import { useUpdateTrunkingChannel } from '@/hooks/api'

function UpdateTrunkingChannelForm({ channelId }: { channelId: string }) {
  const updateChannel = useUpdateTrunkingChannel()
  
  const handleSubmit = (data: UpdateTrunkingChannelData) => {
    updateChannel.mutate({ id: channelId, data }, {
      onSuccess: (response) => {
        console.log('Trunking channel updated:', response.radio_trunking_channel.id)
      },
      onError: (error) => {
        console.error('Failed to update trunking channel:', error.message)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="tg_name" 
        placeholder="Talk Group Name"
      />
      <input 
        type="text" 
        name="tg_number" 
        placeholder="Talk Group Number"
      />
      <button type="submit" disabled={updateChannel.isPending}>
        {updateChannel.isPending ? 'Updating...' : 'Update Trunking Channel'}
      </button>
    </form>
  )
}
```

### useDeleteTrunkingChannel()

Deletes a trunking channel.

**Returns:** `UseMutationResult<any, Error, string>`

**Example:**
```typescript
import { useDeleteTrunkingChannel } from '@/hooks/api'

function DeleteTrunkingChannelButton({ channelId }: { channelId: string }) {
  const deleteChannel = useDeleteTrunkingChannel()
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this trunking channel?')) {
      deleteChannel.mutate(channelId, {
        onSuccess: () => {
          console.log('Trunking channel deleted successfully')
          // Navigate away or update list
        },
        onError: (error) => {
          console.error('Failed to delete trunking channel:', error.message)
        }
      })
    }
  }
  
  return (
    <button 
      onClick={handleDelete}
      disabled={deleteChannel.isPending}
      className="text-red-600"
    >
      {deleteChannel.isPending ? 'Deleting...' : 'Delete Trunking Channel'}
    </button>
  )
}
```

## Usage Patterns

### Trunking Channel Management Dashboard
```typescript
import { useTrunkingChannels, useTrunkingReceiveChannels } from '@/hooks/api'

function TrunkingChannelDashboard() {
  const { data: channels } = useTrunkingChannels()
  const { data: receiveChannels } = useTrunkingReceiveChannels()
  
  const totalChannels = channels?.radio_trunking_channels.length || 0
  const totalReceiveChannels = receiveChannels?.radio_trunking_receive_channels.length || 0
  
  return (
    <div className="trunking-dashboard">
      <div className="dashboard-stats">
        <div className="stat-card">
          <h4>Total Trunking Channels</h4>
          <p>{totalChannels}</p>
        </div>
        <div className="stat-card">
          <h4>Total Receive Channels</h4>
          <p>{totalReceiveChannels}</p>
        </div>
      </div>
      
      <div className="channel-list">
        {channels?.radio_trunking_channels.map(channel => (
          <TrunkingChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  )
}

function TrunkingChannelCard({ channel }: { channel: RadioTrunkingChannel }) {
  return (
    <div className="trunking-channel-card">
      <div className="card-header">
        <h4>{channel.tg_name}</h4>
        <span className="tg-number">#{channel.tg_number}</span>
      </div>
      
      <div className="card-content">
        <p><strong>Talk Group:</strong> {channel.tg_name}</p>
        <p><strong>Number:</strong> {channel.tg_number}</p>
        <p><strong>Created:</strong> {new Date(channel.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  )
}
```

### Talk Group Organization
```typescript
import { useTrunkingChannels } from '@/hooks/api'

function TalkGroupOrganization() {
  const { data } = useTrunkingChannels()
  
  const channels = data?.radio_trunking_channels || []
  
  // Group by talk group name prefix
  const groupedChannels = channels.reduce((groups, channel) => {
    const prefix = channel.tg_name.split(' ')[0]
    if (!groups[prefix]) {
      groups[prefix] = []
    }
    groups[prefix].push(channel)
    return groups
  }, {} as Record<string, RadioTrunkingChannel[]>)
  
  return (
    <div className="talk-group-organization">
      <h3>Talk Group Organization</h3>
      
      {Object.entries(groupedChannels).map(([prefix, groupChannels]) => (
        <div key={prefix} className="talk-group-section">
          <h4>{prefix} ({groupChannels.length} channels)</h4>
          <div className="channel-grid">
            {groupChannels.map(channel => (
              <div key={channel.id} className="channel-item">
                <span>{channel.tg_name}</span>
                <span className="number">#{channel.tg_number}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Channel Attribute Management
```typescript
import { useChannelAttributes, useCreateChannelAttribute, useUpdateChannelAttribute } from '@/hooks/api'

function ChannelAttributeManager({ channelId }: { channelId: string }) {
  const { data: attributes } = useChannelAttributes(channelId)
  const createAttribute = useCreateChannelAttribute()
  const updateAttribute = useUpdateChannelAttribute()
  
  const handleCreateAttribute = (type: string, value: string) => {
    createAttribute.mutate({
      channelId,
      data: { attribute_type: type, attribute_value: value }
    })
  }
  
  const handleUpdateAttribute = (attributeId: string, type: string, value: string) => {
    updateAttribute.mutate({
      channelId,
      attributeId,
      data: { attribute_type: type, attribute_value: value }
    })
  }
  
  return (
    <div className="attribute-manager">
      <h3>Channel Attributes</h3>
      
      <div className="attribute-list">
        {attributes?.map(attribute => (
          <div key={attribute.id} className="attribute-item">
            <span className="type">{attribute.attribute_type}</span>
            <span className="value">{attribute.attribute_value}</span>
            <button onClick={() => handleUpdateAttribute(attribute.id, 'color', '#ff0000')}>
              Update
            </button>
          </div>
        ))}
      </div>
      
      <button onClick={() => handleCreateAttribute('color', '#3b82f6')}>
        Add Color Attribute
      </button>
    </div>
  )
}
```

## Error Handling

The trunking channels API includes comprehensive error handling:
- Graceful handling of missing channel data
- Validation of talk group names and numbers
- Clear error messages for debugging
- Automatic query invalidation on mutations

## Caching Strategy

Trunking channels use an efficient caching strategy:
- List queries are cached for 5 minutes with background refetching
- Detail queries are cached until invalidated
- Mutations automatically invalidate related queries
- Attribute updates trigger cache invalidation

## Integration with Other APIs

The trunking channels API integrates with:
- **Channels API**: Provides channel type context
- **Playlists API**: Supplies trunking channel information for playlists
- **Transmissions API**: Provides channel context for transmission data
- **System Administration**: Supports trunking system configuration
