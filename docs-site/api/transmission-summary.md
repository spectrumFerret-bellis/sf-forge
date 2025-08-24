---
outline: deep
---

# Transmission Summary API

The transmission summary API provides hooks for aggregating and summarizing radio transmission data, particularly useful for timeline visualizations and statistical analysis.

## Types

### TransmissionSummary
```typescript
interface TransmissionSummary {
  channelId: string
  channelName: string
  channelColor: string
  transmissionCount: number
  transmissions: Array<{
    id: string
    startTime: string
    endTime: string
    duration: number // in milliseconds
  }>
}
```

### TimelineSummary
```typescript
interface TimelineSummary {
  totalTransmissions: number
  activeChannels: number
  timeSpan: number // in minutes
  channelSummaries: TransmissionSummary[]
}
```

## Query Keys

```typescript
export const transmissionSummaryKeys = {
  all: ['transmission_summary'] as const,
  timeline: (channelIds: string[], timeRange: TimeRange) => 
    [...transmissionSummaryKeys.all, 'timeline', channelIds, {
      start: timeRange.start.toISOString(),
      end: timeRange.end.toISOString()
    }] as const,
}
```

## Hooks

### useTransmissionTimelineSummary()

Fetches aggregated transmission data for timeline visualization across multiple channels.

**Parameters:**
- `channelIds: string[]` - Array of channel IDs to summarize
- `timeRange?: TimeRange` - Time range for the summary (optional)
- `enabled: boolean = true` - Whether the query should be enabled

**Returns:** `UseQueryResult<TimelineSummary, Error>`

**Example:**
```typescript
import { useTransmissionTimelineSummary } from '@/hooks/api'
import { addHours, subHours } from 'date-fns'

function TransmissionTimeline({ channelIds }: { channelIds: string[] }) {
  const timeRange = {
    start: subHours(new Date(), 24), // Last 24 hours
    end: new Date()
  }
  
  const { data, isLoading, error } = useTransmissionTimelineSummary(
    channelIds,
    timeRange,
    channelIds.length > 0
  )
  
  if (isLoading) return <div>Loading timeline summary...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      <h2>Transmission Timeline Summary</h2>
      <div>
        <p>Total Transmissions: {data?.totalTransmissions}</p>
        <p>Active Channels: {data?.activeChannels}</p>
        <p>Time Span: {data?.timeSpan} minutes</p>
      </div>
      
      <div>
        {data?.channelSummaries.map(channel => (
          <div key={channel.channelId} style={{ borderLeft: `4px solid ${channel.channelColor}` }}>
            <h3>{channel.channelName}</h3>
            <p>Transmissions: {channel.transmissionCount}</p>
            <div>
              {channel.transmissions.map(transmission => (
                <div key={transmission.id}>
                  <span>{new Date(transmission.startTime).toLocaleTimeString()}</span>
                  <span>Duration: {Math.round(transmission.duration / 1000)}s</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Data Processing

The transmission summary API performs several data processing steps:

### Time Range Conversion
```typescript
// Convert time range to UTC for API calls
const convertTimeRangeToUTC = (timeRange: TimeRange) => {
  return {
    start: timeRange.start.toISOString(),
    end: timeRange.end.toISOString()
  }
}
```

### Channel Grouping
Transmissions are grouped by channel and processed to create summary statistics:

```typescript
// Group transmissions by channel
const channelMap = new Map<string, TransmissionSummary>()

transmissions.forEach((transmission: any) => {
  const channelId = transmission.channel_details?.id
  if (!channelId) return

  const channelName = transmission.sys_tg_name || transmission.sys_channel_name || `Channel ${channelId}`
  const channelColor = transmission.channel_details?.channel_attribute?.configuration?.color || '#666666'
  
  const startTime = transmission.rx_started_at
  const endTime = transmission.rx_ended_at
  const duration = new Date(endTime).getTime() - new Date(startTime).getTime()

  if (!channelMap.has(channelId)) {
    channelMap.set(channelId, {
      channelId,
      channelName,
      channelColor,
      transmissionCount: 0,
      transmissions: []
    })
  }

  const channelSummary = channelMap.get(channelId)!
  channelSummary.transmissionCount++
  channelSummary.transmissions.push({
    id: transmission.id,
    startTime,
    endTime,
    duration
  })
})
```

### Summary Statistics
The API calculates various summary statistics:

- **Total Transmissions**: Sum of all transmissions across all channels
- **Active Channels**: Number of channels with at least one transmission
- **Time Span**: Duration of the time range in minutes
- **Channel Summaries**: Per-channel breakdown with transmission details

## Usage Patterns

### Timeline Visualization
```typescript
import { useTransmissionTimelineSummary } from '@/hooks/api'

function TimelineChart({ channelIds, timeRange }: { 
  channelIds: string[]
  timeRange: TimeRange 
}) {
  const { data } = useTransmissionTimelineSummary(channelIds, timeRange)
  
  // Use data for chart visualization
  const chartData = data?.channelSummaries.map(channel => ({
    name: channel.channelName,
    color: channel.channelColor,
    value: channel.transmissionCount,
    transmissions: channel.transmissions
  })) || []
  
  return (
    <div>
      {/* Chart implementation using chartData */}
    </div>
  )
}
```

### Real-time Updates
```typescript
import { useTransmissionTimelineSummary } from '@/hooks/api'

function LiveTimeline({ channelIds }: { channelIds: string[] }) {
  const timeRange = {
    start: new Date(Date.now() - 30 * 60 * 1000), // Last 30 minutes
    end: new Date()
  }
  
  const { data, refetch } = useTransmissionTimelineSummary(
    channelIds,
    timeRange,
    channelIds.length > 0
  )
  
  // Refetch every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [refetch])
  
  return (
    <div>
      <h3>Live Transmission Summary</h3>
      <p>Total: {data?.totalTransmissions || 0}</p>
      <p>Active Channels: {data?.activeChannels || 0}</p>
    </div>
  )
}
```

### Channel Activity Analysis
```typescript
import { useTransmissionTimelineSummary } from '@/hooks/api'

function ChannelActivityAnalysis({ channelIds, timeRange }: {
  channelIds: string[]
  timeRange: TimeRange
}) {
  const { data } = useTransmissionTimelineSummary(channelIds, timeRange)
  
  const mostActiveChannel = data?.channelSummaries.reduce((max, current) => 
    current.transmissionCount > max.transmissionCount ? current : max
  )
  
  const averageTransmissionsPerChannel = data?.channelSummaries.length 
    ? data.totalTransmissions / data.channelSummaries.length 
    : 0
  
  return (
    <div>
      <h3>Channel Activity Analysis</h3>
      <p>Most Active: {mostActiveChannel?.channelName} ({mostActiveChannel?.transmissionCount} transmissions)</p>
      <p>Average per Channel: {averageTransmissionsPerChannel.toFixed(1)}</p>
      
      <div>
        {data?.channelSummaries
          .sort((a, b) => b.transmissionCount - a.transmissionCount)
          .map(channel => (
            <div key={channel.channelId}>
              <span>{channel.channelName}</span>
              <span>{channel.transmissionCount} transmissions</span>
            </div>
          ))}
      </div>
    </div>
  )
}
```

## Performance Considerations

### Large Dataset Handling
- The API uses a large `per_page` parameter (10000) to fetch all transmissions in one call
- Data is processed client-side for better performance
- Consider implementing pagination for very large time ranges

### Caching Strategy
- Timeline summaries are cached based on channel IDs and time range
- Cache invalidation occurs when transmission data changes
- Background refetching ensures data freshness

### Memory Management
- Large transmission arrays are processed efficiently using Map data structures
- Duration calculations are performed only when needed
- Channel summaries are created lazily during processing

## Error Handling

The transmission summary API includes robust error handling:
- Graceful handling of empty channel arrays
- Fallback values for missing channel information
- Default colors for channels without configuration
- Error boundaries for malformed transmission data

## Integration with Other APIs

The transmission summary API integrates with:
- **Transmissions API**: Fetches raw transmission data
- **Channels API**: Provides channel metadata and colors
- **Playlist Store**: Uses TimeRange type for consistency
- **Timeline Components**: Provides data for visualization
