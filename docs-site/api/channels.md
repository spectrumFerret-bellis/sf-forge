---
outline: deep
---

# Channels API

The channels API provides hooks for managing radio channels, including both conventional (fixed frequency) and trunking (dynamic) channels. This API supports fetching channel details, transmission counts, and channel-specific information.

## Types

### RadioConventionalChannel
```typescript
interface RadioConventionalChannel {
  id: string
  name: string
  frequency_hz: number
  created_at: string
  updated_at: string
}
```

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

### ChannelDetails
```typescript
interface ChannelDetails {
  id: string
  name: string
  channel_type: 'conventional' | 'trunking'
  tx_count?: number
  last_transmission?: string
  frequency_hz?: number
  tg_name?: string
  tg_number?: string
}
```

## Query Keys

```typescript
export const channelKeys = {
  all: ['channels'] as const,
  details: () => [...channelKeys.all, 'detail'] as const,
  detail: (id: string) => [...channelKeys.details(), id] as const,
  conventional: () => [...channelKeys.all, 'conventional'] as const,
  conventionalDetail: (id: string) => [...channelKeys.conventional(), id] as const,
  trunking: () => [...channelKeys.all, 'trunking'] as const,
  trunkingDetail: (id: string) => [...channelKeys.trunking(), id] as const,
}
```

## Hooks

### useConventionalChannel()

Fetches details for a conventional radio channel by ID.

**Parameters:**
- `id: string` - Conventional channel ID

**Returns:** `UseQueryResult<{ radio_conventional_channel: RadioConventionalChannel }, Error>`

**Example:**
```typescript
import { useConventionalChannel } from '@/hooks/api'

function ConventionalChannelDetail({ channelId }: { channelId: string }) {
  const { data, isLoading, error } = useConventionalChannel(channelId)
  
  if (isLoading) return <div>Loading channel...</div>
  if (error) return <div>Error: {error.message}</div>
  
  const channel = data?.radio_conventional_channel
  
  return (
    <div>
      <h3>Conventional Channel</h3>
      <p>Name: {channel?.name}</p>
      <p>Frequency: {channel?.frequency_hz} Hz</p>
      <p>Created: {new Date(channel?.created_at || '').toLocaleDateString()}</p>
    </div>
  )
}
```

### useTrunkingChannel()

Fetches details for a trunking radio channel by ID.

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
      <h3>Trunking Channel</h3>
      <p>Talk Group Name: {channel?.tg_name}</p>
      <p>Talk Group Number: {channel?.tg_number}</p>
      <p>Created: {new Date(channel?.created_at || '').toLocaleDateString()}</p>
    </div>
  )
}
```

### useChannelDetails()

Fetches channel details based on channel type and ID. This hook automatically determines whether to fetch conventional or trunking channel data.

**Parameters:**
- `channelId: string` - Channel ID
- `channelType: string` - Channel type (must contain 'Conventional' or 'Trunking')

**Returns:** `{ data: RadioConventionalChannel | RadioTrunkingChannel | null, isLoading: boolean, error: Error | null }`

**Example:**
```typescript
import { useChannelDetails } from '@/hooks/api'

function ChannelDetail({ channelId, channelType }: { 
  channelId: string
  channelType: string 
}) {
  const { data, isLoading, error } = useChannelDetails(channelId, channelType)
  
  if (isLoading) return <div>Loading channel details...</div>
  if (error) return <div>Error: {error.message}</div>
  
  if (!data) return <div>Channel not found</div>
  
  return (
    <div>
      <h3>Channel Details</h3>
      {channelType.includes('Conventional') ? (
        <div>
          <p>Name: {data.name}</p>
          <p>Frequency: {data.frequency_hz} Hz</p>
        </div>
      ) : (
        <div>
          <p>Talk Group: {data.tg_name}</p>
          <p>Number: {data.tg_number}</p>
        </div>
      )}
    </div>
  )
}
```

### useChannelTransmissionCount()

Fetches the transmission count for a specific channel.

**Parameters:**
- `channelId: string` - Channel ID

**Returns:** `UseQueryResult<{ count: number }, Error>`

**Example:**
```typescript
import { useChannelTransmissionCount } from '@/hooks/api'

function ChannelStats({ channelId }: { channelId: string }) {
  const { data, isLoading, error } = useChannelTransmissionCount(channelId)
  
  if (isLoading) return <div>Loading stats...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      <h4>Channel Statistics</h4>
      <p>Total Transmissions: {data?.count || 0}</p>
    </div>
  )
}
```

## Channel Types

### Conventional Channels
Conventional channels are traditional radio channels with fixed frequencies:

- **Fixed Frequency**: Each channel operates on a specific frequency
- **Simple Structure**: Basic name and frequency information
- **Common Use**: Emergency services, amateur radio, business communications

### Trunking Channels
Trunking channels are part of trunked radio systems that dynamically assign frequencies:

- **Dynamic Frequencies**: Frequencies can change during operation
- **Talk Groups**: Organized by talk group names and numbers
- **Advanced Features**: Support for complex radio systems

## Usage Patterns

### Channel Type Detection
```typescript
import { useChannelDetails } from '@/hooks/api'

function ChannelTypeDetector({ channelId, channelType }: {
  channelId: string
  channelType: string
}) {
  const { data } = useChannelDetails(channelId, channelType)
  
  const isConventional = channelType.includes('Conventional')
  const isTrunking = channelType.includes('Trunking')
  
  return (
    <div>
      {isConventional && (
        <div className="conventional-channel">
          <span>📻 Conventional Channel</span>
          <span>Frequency: {data?.frequency_hz} Hz</span>
        </div>
      )}
      
      {isTrunking && (
        <div className="trunking-channel">
          <span>📡 Trunking Channel</span>
          <span>Talk Group: {data?.tg_name}</span>
        </div>
      )}
    </div>
  )
}
```

### Channel Comparison
```typescript
import { useConventionalChannel, useTrunkingChannel } from '@/hooks/api'

function ChannelComparison({ conventionalId, trunkingId }: {
  conventionalId: string
  trunkingId: string
}) {
  const conventional = useConventionalChannel(conventionalId)
  const trunking = useTrunkingChannel(trunkingId)
  
  return (
    <div className="channel-comparison">
      <div>
        <h4>Conventional Channel</h4>
        {conventional.data && (
          <div>
            <p>Name: {conventional.data.radio_conventional_channel.name}</p>
            <p>Frequency: {conventional.data.radio_conventional_channel.frequency_hz} Hz</p>
          </div>
        )}
      </div>
      
      <div>
        <h4>Trunking Channel</h4>
        {trunking.data && (
          <div>
            <p>Talk Group: {trunking.data.radio_trunking_channel.tg_name}</p>
            <p>Number: {trunking.data.radio_trunking_channel.tg_number}</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

### Channel Statistics Dashboard
```typescript
import { useChannelDetails, useChannelTransmissionCount } from '@/hooks/api'

function ChannelDashboard({ channels }: { 
  channels: Array<{ id: string; type: string }> 
}) {
  return (
    <div className="channel-dashboard">
      {channels.map(channel => (
        <ChannelCard 
          key={channel.id}
          channelId={channel.id}
          channelType={channel.type}
        />
      ))}
    </div>
  )
}

function ChannelCard({ channelId, channelType }: {
  channelId: string
  channelType: string
}) {
  const { data: channelDetails } = useChannelDetails(channelId, channelType)
  const { data: transmissionCount } = useChannelTransmissionCount(channelId)
  
  return (
    <div className="channel-card">
      <h4>{channelType}</h4>
      <p>Transmissions: {transmissionCount?.count || 0}</p>
      {channelDetails && (
        <div>
          {channelType.includes('Conventional') ? (
            <p>Frequency: {channelDetails.frequency_hz} Hz</p>
          ) : (
            <p>Talk Group: {channelDetails.tg_name}</p>
          )}
        </div>
      )}
    </div>
  )
}
```

## Error Handling

The channels API includes comprehensive error handling:
- Graceful handling of unknown channel types
- Automatic query enabling/disabling based on ID availability
- Clear error messages for debugging
- Fallback values for missing data

## Caching Strategy

Channels use an efficient caching strategy:
- Individual channel queries are cached until invalidated
- Query keys are structured for efficient cache management
- Automatic cache invalidation when channel data changes
- Background refetching for data freshness

## Integration with Other APIs

The channels API integrates with:
- **Transmissions API**: Provides channel context for transmission data
- **Playlists API**: Supplies channel information for playlist management
- **Transmission Summary API**: Provides channel metadata for summaries
- **Timeline Components**: Supplies channel details for visualizations
