---
outline: deep
---

# Playlist Channels API

The playlist channels API provides hooks for managing channel associations within radio playlists, including fetching channel details, transmission counts, and playlist-specific channel information.

## Types

### PlaylistChannelWithDetails
```typescript
interface PlaylistChannelWithDetails {
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
```

## Hooks

### usePlaylistChannels()

Fetches all channel details for a specific playlist with optional time range filtering.

**Parameters:**
- `playlistId: string` - Playlist ID
- `timeRange?: TimeRange` - Optional time range for transmission counting

**Returns:** `UseQueryResult<{ channels: PlaylistChannelWithDetails[] }, Error>`

**Example:**
```typescript
import { usePlaylistChannels } from '@/hooks/api'
import { subHours } from 'date-fns'

function PlaylistChannelList({ playlistId }: { playlistId: string }) {
  const timeRange = {
    start: subHours(new Date(), 24), // Last 24 hours
    end: new Date()
  }
  
  const { data, isLoading, error } = usePlaylistChannels(playlistId, timeRange)
  
  if (isLoading) return <div>Loading playlist channels...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      <h3>Playlist Channels</h3>
      {data?.channels.map(channel => (
        <div key={channel.id} className="channel-item">
          <div className="channel-header">
            <span className="position">{channel.position}</span>
            <span className="channel-name">{channel.channel_name}</span>
            <span className="channel-type">{channel.channel_type}</span>
          </div>
          
          <div className="channel-details">
            {channel.frequency_hz && (
              <span>Frequency: {channel.frequency_hz} Hz</span>
            )}
            {channel.tg_name && (
              <span>Talk Group: {channel.tg_name}</span>
            )}
            <span>Transmissions: {channel.tx_count}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
```

## Channel Type Handling

The API automatically handles different channel types:

### Conventional Channels
- Fetches conventional receive channel details
- Extracts frequency information
- Provides channel name and type

### Trunking Channels
- Fetches trunking receive channel details
- Extracts talk group information
- Provides channel name and type

## Usage Patterns

### Playlist Channel Dashboard
```typescript
import { usePlaylistChannels } from '@/hooks/api'

function PlaylistChannelDashboard({ playlistId }: { playlistId: string }) {
  const { data, isLoading, error } = usePlaylistChannels(playlistId)
  
  if (isLoading) return <div>Loading dashboard...</div>
  if (error) return <div>Error: {error.message}</div>
  
  const channels = data?.channels || []
  const totalTransmissions = channels.reduce((sum, channel) => sum + channel.tx_count, 0)
  const conventionalChannels = channels.filter(c => c.channel_type === 'Conventional')
  const trunkingChannels = channels.filter(c => c.channel_type === 'Trunking')
  
  return (
    <div className="playlist-dashboard">
      <div className="dashboard-stats">
        <div className="stat-card">
          <h4>Total Channels</h4>
          <p>{channels.length}</p>
        </div>
        <div className="stat-card">
          <h4>Total Transmissions</h4>
          <p>{totalTransmissions}</p>
        </div>
        <div className="stat-card">
          <h4>Conventional</h4>
          <p>{conventionalChannels.length}</p>
        </div>
        <div className="stat-card">
          <h4>Trunking</h4>
          <p>{trunkingChannels.length}</p>
        </div>
      </div>
      
      <div className="channel-list">
        {channels.map(channel => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  )
}

function ChannelCard({ channel }: { channel: PlaylistChannelWithDetails }) {
  return (
    <div className="channel-card">
      <div className="card-header">
        <span className="position-badge">#{channel.position}</span>
        <h4>{channel.channel_name}</h4>
        <span className="type-badge">{channel.channel_type}</span>
      </div>
      
      <div className="card-content">
        {channel.frequency_hz && (
          <p><strong>Frequency:</strong> {channel.frequency_hz.toLocaleString()} Hz</p>
        )}
        {channel.tg_name && (
          <p><strong>Talk Group:</strong> {channel.tg_name} ({channel.tg_number})</p>
        )}
        <p><strong>Transmissions:</strong> {channel.tx_count}</p>
      </div>
    </div>
  )
}
```

### Channel Activity Timeline
```typescript
import { usePlaylistChannels } from '@/hooks/api'

function ChannelActivityTimeline({ playlistId }: { playlistId: string }) {
  const timeRanges = [
    { label: 'Last Hour', start: new Date(Date.now() - 60 * 60 * 1000), end: new Date() },
    { label: 'Last 24 Hours', start: new Date(Date.now() - 24 * 60 * 60 * 1000), end: new Date() },
    { label: 'Last Week', start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), end: new Date() }
  ]
  
  return (
    <div className="activity-timeline">
      <h3>Channel Activity</h3>
      
      {timeRanges.map((range, index) => (
        <TimeRangeActivity 
          key={index}
          playlistId={playlistId}
          timeRange={range}
          label={range.label}
        />
      ))}
    </div>
  )
}

function TimeRangeActivity({ 
  playlistId, 
  timeRange, 
  label 
}: { 
  playlistId: string
  timeRange: TimeRange
  label: string
}) {
  const { data } = usePlaylistChannels(playlistId, timeRange)
  
  const channels = data?.channels || []
  const totalActivity = channels.reduce((sum, channel) => sum + channel.tx_count, 0)
  
  return (
    <div className="time-range-activity">
      <h4>{label}</h4>
      <p>Total Activity: {totalActivity} transmissions</p>
      
      <div className="activity-chart">
        {channels.map(channel => (
          <div 
            key={channel.id}
            className="activity-bar"
            style={{ 
              width: `${(channel.tx_count / Math.max(...channels.map(c => c.tx_count))) * 100}%`,
              backgroundColor: channel.channel_type === 'Conventional' ? '#3b82f6' : '#10b981'
            }}
          >
            <span>{channel.channel_name}: {channel.tx_count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Channel Comparison
```typescript
import { usePlaylistChannels } from '@/hooks/api'

function ChannelComparison({ playlistId }: { playlistId: string }) {
  const { data } = usePlaylistChannels(playlistId)
  
  const channels = data?.channels || []
  const conventionalChannels = channels.filter(c => c.channel_type === 'Conventional')
  const trunkingChannels = channels.filter(c => c.channel_type === 'Trunking')
  
  const conventionalAvg = conventionalChannels.length > 0 
    ? conventionalChannels.reduce((sum, c) => sum + c.tx_count, 0) / conventionalChannels.length 
    : 0
  
  const trunkingAvg = trunkingChannels.length > 0
    ? trunkingChannels.reduce((sum, c) => sum + c.tx_count, 0) / trunkingChannels.length
    : 0
  
  return (
    <div className="channel-comparison">
      <h3>Channel Type Comparison</h3>
      
      <div className="comparison-grid">
        <div className="comparison-card">
          <h4>Conventional Channels</h4>
          <p>Count: {conventionalChannels.length}</p>
          <p>Average Activity: {conventionalAvg.toFixed(1)} transmissions</p>
          <p>Total Activity: {conventionalChannels.reduce((sum, c) => sum + c.tx_count, 0)}</p>
        </div>
        
        <div className="comparison-card">
          <h4>Trunking Channels</h4>
          <p>Count: {trunkingChannels.length}</p>
          <p>Average Activity: {trunkingAvg.toFixed(1)} transmissions</p>
          <p>Total Activity: {trunkingChannels.reduce((sum, c) => sum + c.tx_count, 0)}</p>
        </div>
      </div>
      
      <div className="frequency-distribution">
        <h4>Frequency Distribution</h4>
        {conventionalChannels.map(channel => (
          <div key={channel.id} className="frequency-item">
            <span>{channel.channel_name}</span>
            <span>{channel.frequency_hz?.toLocaleString()} Hz</span>
            <span>{channel.tx_count} transmissions</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Time Range Processing

The API automatically converts time ranges to UTC for API calls:

```typescript
// Convert time range to UTC for API calls
const convertTimeRangeToUTC = (timeRange: TimeRange) => {
  return {
    start: timeRange.start.toISOString(), // Already in UTC
    end: timeRange.end.toISOString()      // Already in UTC
  }
}
```

## Error Handling

The playlist channels API includes comprehensive error handling:
- Graceful handling of missing playlist data
- Fallback values for missing channel information
- Authentication status checking
- Clear error messages for debugging

## Caching Strategy

Playlist channels use an efficient caching strategy:
- Queries are cached based on playlist ID and time range
- Time range changes trigger cache invalidation
- Authentication changes clear cached data
- Background refetching ensures data freshness

## Integration with Other APIs

The playlist channels API integrates with:
- **Playlists API**: Provides playlist context and structure
- **Channels API**: Fetches detailed channel information
- **Transmissions API**: Provides transmission count data
- **Timeline Components**: Supplies data for activity visualizations
