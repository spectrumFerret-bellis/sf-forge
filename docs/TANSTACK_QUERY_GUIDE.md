# TanStack Query Setup Guide

This project now uses TanStack Query (formerly React Query) for all REST API calls. This provides powerful caching, background updates, and error handling out of the box.

## What's Been Set Up

### 1. Dependencies Installed
- `@tanstack/react-query` - Core library
- `@tanstack/react-query-devtools` - Development tools for debugging

### 2. Configuration Files Created
- `src/lib/queryClient.ts` - Query client configuration
- `src/lib/api.ts` - API utility functions
- `src/hooks/useApi.ts` - Custom hooks for data fetching

### 3. App Integration
- QueryClientProvider added to `src/App.tsx`
- ReactQueryDevtools included for development

## How to Use

### Basic Data Fetching

```tsx
import { useChannels, useTransmissions } from '@/hooks/useApi'

function MyComponent() {
  // Fetch channels
  const { data: channels, isLoading, error } = useChannels()
  
  // Fetch transmissions with parameters
  const { data: transmissions } = useTransmissions({
    channelId: 'law1',
    startTime: '2025-01-01T00:00:00Z',
    endTime: '2025-01-02T00:00:00Z'
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {channels?.map(channel => (
        <div key={channel.id}>{channel.name}</div>
      ))}
    </div>
  )
}
```

### Mutations (Creating/Updating Data)

```tsx
import { useCreateTransmission, useUpdateTransmission } from '@/hooks/useApi'

function TransmissionForm() {
  const createMutation = useCreateTransmission()
  const updateMutation = useUpdateTransmission()

  const handleCreate = () => {
    createMutation.mutate({
      channelId: 'law1',
      startTime: '2025-01-01T12:00:00Z',
      endTime: '2025-01-01T12:05:00Z',
      type: 'voice',
      signalStrength: 4
    })
  }

  const handleUpdate = (id: string) => {
    updateMutation.mutate({
      id,
      data: { signalStrength: 5 }
    })
  }

  return (
    <div>
      <button onClick={handleCreate} disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create Transmission'}
      </button>
    </div>
  )
}
```

### Available Hooks

#### Query Hooks
- `useChannels()` - Fetch all channels
- `useTransmissions(params?)` - Fetch transmissions with optional filters
- `useTextLogs(params?)` - Fetch text logs with optional filters
- `usePlaylists()` - Fetch playlists
- `useMetadata(transmissionId)` - Fetch metadata for a transmission
- `useLocation(transmissionId)` - Fetch location data for a transmission
- `useTranscription(transmissionId)` - Fetch transcription for a transmission

#### Mutation Hooks
- `useCreateTransmission()` - Create a new transmission
- `useUpdateTransmission()` - Update an existing transmission
- `useDeleteTransmission()` - Delete a transmission

### Query Keys

Query keys are used for cache management and invalidation:

```tsx
import { queryKeys } from '@/hooks/useApi'

// Invalidate all channels
queryClient.invalidateQueries({ queryKey: queryKeys.channels })

// Invalidate specific transmission
queryClient.invalidateQueries({ queryKey: queryKeys.transmission('transmission-id') })

// Invalidate transmissions by channel
queryClient.invalidateQueries({ queryKey: queryKeys.transmissionsByChannel('law1') })
```

## Configuration

### Query Client Settings
- **Stale Time**: 5 minutes (data considered fresh for 5 minutes)
- **GC Time**: 10 minutes (inactive queries garbage collected after 10 minutes)
- **Retry**: 3 attempts for queries, 1 for mutations
- **Refetch on Window Focus**: Enabled for real-time updates
- **Refetch on Reconnect**: Enabled

### Per-Query Settings
Each hook can have custom settings:

```tsx
// Real-time data (refreshes every 10 seconds)
const { data } = useTransmissions({
  staleTime: 30 * 1000, // 30 seconds
  refetchInterval: 10 * 1000 // 10 seconds
})

// Static data (refreshes every 5 minutes)
const { data } = useChannels({
  staleTime: 5 * 60 * 1000 // 5 minutes
})
```

## Error Handling

The API utilities include built-in error handling:

```tsx
function MyComponent() {
  const { data, error, isError } = useChannels()

  if (isError) {
    return (
      <div className="error">
        <h3>Failed to load channels</h3>
        <p>{error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    )
  }

  return <div>{/* render data */}</div>
}
```

## Development Tools

The ReactQueryDevtools are included in development mode. You can:
- View all queries and their states
- Manually invalidate queries
- See query data and metadata
- Debug cache behavior

## Best Practices

1. **Use the provided hooks** instead of creating new ones
2. **Handle loading and error states** in your components
3. **Use appropriate stale times** for different data types
4. **Invalidate related queries** after mutations
5. **Use query keys consistently** for cache management
6. **Enable queries conditionally** when parameters are required

## API Endpoints

The setup expects these REST endpoints:

- `GET /api/channels` - List all channels
- `GET /api/transmissions` - List transmissions (with query params)
- `GET /api/text-logs` - List text logs (with query params)
- `GET /api/playlists` - List playlists
- `GET /api/transmissions/:id/metadata` - Get transmission metadata
- `GET /api/transmissions/:id/location` - Get transmission location
- `GET /api/transmissions/:id/transcription` - Get transmission transcription
- `POST /api/transmissions` - Create transmission
- `PUT /api/transmissions/:id` - Update transmission
- `DELETE /api/transmissions/:id` - Delete transmission

## Migration from Sample Data

To migrate existing components from sample data to API data:

1. Replace sample data with the appropriate hook
2. Add loading and error states
3. Update TypeScript interfaces to match API response
4. Test the component with real API endpoints

Example migration:
```tsx
// Before
const sampleData = [{ id: '1', name: 'Channel 1' }]
return <DataTable data={sampleData} />

// After
const { data, isLoading, error } = useChannels()
if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
return <DataTable data={data || []} />
```
