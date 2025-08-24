---
outline: deep
---

# Transmissions API

The transmissions API provides hooks for managing radio transmission data, including fetching, creating, updating, and searching transmissions with support for infinite scrolling and real-time updates.

## Types

### RadioTransmission
```typescript
interface RadioTransmission {
  id: string
  channelable_type: string
  channelable_id: string
  confidence?: number
  dsp_processed_at?: string
  dsp_engine_id?: string
  rip_demod_version?: string
  rip_rx_latitude?: number
  rip_rx_longitude?: number
  radio_intercept_id: string
  rx_channel_number?: number
  rx_decoder?: string
  rx_ended_at?: string
  rx_frequency_hz?: number
  rx_signal_quality?: number
  rx_started_at?: string
  stt_engine_id?: string
  sys_channel_name?: string
  sys_radio_system?: string
  sys_site?: string
  sys_tg_name?: string
  sys_tg_number?: number
  transcribed_at?: string
  tx_latitude?: number
  tx_longitude?: number
  tx_radio_id?: number
  audio_file_url?: string
  audio_local_file_path?: string
  created_at: string
  updated_at: string
  radio_transcriptions?: RadioTranscription[]
}
```

### CreateTransmissionData
```typescript
interface CreateTransmissionData {
  audio_file: {
    content: string // base64 encoded
    file_name: string
    content_type: string
  }
  dsp_engine_id?: string
  rip_demod_version?: string
  rip_rx_latitude?: number
  rip_rx_longitude?: number
  rx_channel_number?: number
  rx_decoder?: string
  rx_ended_at?: string
  rx_frequency_hz?: number
  rx_signal_quality?: number
  rx_started_at?: string
  stt_engine_id?: string
  sys_channel_name?: string
  sys_radio_system?: string
  sys_site?: string
  sys_tg_name?: string
  sys_tg_number?: string
  tx_latitude?: number
  tx_longitude?: number
  radio_intercept_id: string
  tx_radio_id?: number
}
```

### UpdateTransmissionData
```typescript
interface UpdateTransmissionData {
  sys_radio_system?: string
}
```

### TransmissionSearchParams
```typescript
interface TransmissionSearchParams {
  page?: number
  per_page?: number
  audio_filename?: string
  start_ts?: string // YYYY-MM-DD format
  end_ts?: string // YYYY-MM-DD format
  radio_intercept_id?: string
  talkgroup_name?: string
  channel_ids?: string[] // Array of channel IDs
  sort_direction?: 'asc' | 'desc'
}
```

### PaginatedTransmissions
```typescript
interface PaginatedTransmissions {
  radio_transmissions: RadioTransmission[]
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
export const transmissionKeys = {
  all: ['radio_transmissions'] as const,
  lists: () => [...transmissionKeys.all, 'list'] as const,
  list: (filters: string) => [...transmissionKeys.lists(), { filters }] as const,
  details: () => [...transmissionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transmissionKeys.details(), id] as const,
  infinite: () => [...transmissionKeys.all, 'infinite'] as const,
  infiniteList: (filters: string) => [...transmissionKeys.infinite(), { filters }] as const,
}
```

## Hooks

### useTransmissions()

Fetches a paginated list of radio transmissions with optional filtering.

**Parameters:**
- `params?: TransmissionSearchParams` - Search and pagination parameters

**Returns:** `UseQueryResult<PaginatedTransmissions, Error>`

**Example:**
```typescript
import { useTransmissions } from '@/hooks/api'

function TransmissionList() {
  const { data, isLoading, error } = useTransmissions({
    page: 1,
    per_page: 20,
    start_ts: '2024-01-01',
    end_ts: '2024-01-31',
    sort_direction: 'desc'
  })
  
  if (isLoading) return <div>Loading transmissions...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {data?.radio_transmissions.map(transmission => (
        <div key={transmission.id}>
          <h3>Transmission {transmission.id}</h3>
          <p>Frequency: {transmission.rx_frequency_hz} Hz</p>
          <p>Started: {transmission.rx_started_at}</p>
        </div>
      ))}
    </div>
  )
}
```

### useInfiniteTransmissions()

Fetches transmissions with infinite scrolling support.

**Parameters:**
- `params?: Omit<TransmissionSearchParams, 'page'>` - Search parameters (page is handled automatically)

**Returns:** `UseInfiniteQueryResult<PaginatedTransmissions, Error>`

**Example:**
```typescript
import { useInfiniteTransmissions } from '@/hooks/api'

function InfiniteTransmissionList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteTransmissions({
    per_page: 20,
    start_ts: '2024-01-01',
    end_ts: '2024-01-31'
  })
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  const allTransmissions = data?.pages.flatMap(page => page.radio_transmissions) || []
  
  return (
    <div>
      {allTransmissions.map(transmission => (
        <div key={transmission.id}>
          <h3>Transmission {transmission.id}</h3>
          <p>Frequency: {transmission.rx_frequency_hz} Hz</p>
        </div>
      ))}
      
      {hasNextPage && (
        <button 
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
    </div>
  )
}
```

### useTransmission()

Fetches a single transmission by ID.

**Parameters:**
- `id: string` - Transmission ID

**Returns:** `UseQueryResult<{ radio_transmission: RadioTransmission }, Error>`

**Example:**
```typescript
import { useTransmission } from '@/hooks/api'

function TransmissionDetail({ transmissionId }: { transmissionId: string }) {
  const { data, isLoading, error } = useTransmission(transmissionId)
  
  if (isLoading) return <div>Loading transmission...</div>
  if (error) return <div>Error: {error.message}</div>
  
  const transmission = data?.radio_transmission
  
  return (
    <div>
      <h2>Transmission Details</h2>
      <p>ID: {transmission?.id}</p>
      <p>Frequency: {transmission?.rx_frequency_hz} Hz</p>
      <p>Signal Quality: {transmission?.rx_signal_quality}</p>
      <p>Started: {transmission?.rx_started_at}</p>
      <p>Ended: {transmission?.rx_ended_at}</p>
      
      {transmission?.audio_file_url && (
        <audio controls src={transmission.audio_file_url}>
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  )
}
```

### useCreateTransmission()

Creates a new radio transmission.

**Returns:** `UseMutationResult<{ radio_transmission: RadioTransmission }, Error, CreateTransmissionData>`

**Example:**
```typescript
import { useCreateTransmission } from '@/hooks/api'

function CreateTransmissionForm() {
  const createTransmission = useCreateTransmission()
  
  const handleSubmit = (formData: CreateTransmissionData) => {
    createTransmission.mutate(formData, {
      onSuccess: (data) => {
        console.log('Transmission created:', data.radio_transmission.id)
        // Navigate to transmission detail or update list
      },
      onError: (error) => {
        console.error('Failed to create transmission:', error.message)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="audio/*" required />
      <input type="number" name="rx_frequency_hz" placeholder="Frequency (Hz)" />
      <input type="text" name="radio_intercept_id" placeholder="Radio Intercept ID" required />
      <button type="submit" disabled={createTransmission.isPending}>
        {createTransmission.isPending ? 'Creating...' : 'Create Transmission'}
      </button>
    </form>
  )
}
```

### useUpdateTransmission()

Updates an existing transmission.

**Returns:** `UseMutationResult<{ radio_transmission: RadioTransmission }, Error, { id: string; data: UpdateTransmissionData }>`

**Example:**
```typescript
import { useUpdateTransmission } from '@/hooks/api'

function UpdateTransmissionForm({ transmissionId }: { transmissionId: string }) {
  const updateTransmission = useUpdateTransmission()
  
  const handleSubmit = (data: UpdateTransmissionData) => {
    updateTransmission.mutate({ id: transmissionId, data }, {
      onSuccess: (response) => {
        console.log('Transmission updated:', response.radio_transmission.id)
      },
      onError: (error) => {
        console.error('Failed to update transmission:', error.message)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="sys_radio_system" placeholder="Radio System" />
      <button type="submit" disabled={updateTransmission.isPending}>
        {updateTransmission.isPending ? 'Updating...' : 'Update Transmission'}
      </button>
    </form>
  )
}
```

### useDeleteTransmission()

Deletes a transmission.

**Returns:** `UseMutationResult<any, Error, string>`

**Example:**
```typescript
import { useDeleteTransmission } from '@/hooks/api'

function DeleteTransmissionButton({ transmissionId }: { transmissionId: string }) {
  const deleteTransmission = useDeleteTransmission()
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this transmission?')) {
      deleteTransmission.mutate(transmissionId, {
        onSuccess: () => {
          console.log('Transmission deleted successfully')
          // Navigate away or update list
        },
        onError: (error) => {
          console.error('Failed to delete transmission:', error.message)
        }
      })
    }
  }
  
  return (
    <button 
      onClick={handleDelete}
      disabled={deleteTransmission.isPending}
      className="text-red-600"
    >
      {deleteTransmission.isPending ? 'Deleting...' : 'Delete Transmission'}
    </button>
  )
}
```

## Time Range Handling

The API automatically converts time ranges to UTC for API calls:

```typescript
// Convert time range to UTC for API calls
const convertTimeRangeToUTC = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return {
    start_ts: toZonedTime(start, 'UTC').toISOString().split('T')[0],
    end_ts: toZonedTime(end, 'UTC').toISOString().split('T')[0]
  }
}
```

## Channel ID Handling

The API automatically converts channel ID arrays to the correct format:

```typescript
// Convert channel_ids array to API format
const formatChannelIds = (channelIds: string[]) => {
  return channelIds.map(id => `channel_ids[]=${id}`).join('&')
}
```

## Error Handling

All transmission hooks include comprehensive error handling:
- Network errors are automatically caught and formatted
- HTTP error responses include status codes and error details
- Query invalidation ensures data consistency after mutations
- Infinite query errors are handled gracefully with retry mechanisms

## Caching Strategy

Transmissions use a sophisticated caching strategy:
- List queries are cached for 5 minutes with background refetching
- Detail queries are cached until invalidated
- Infinite queries maintain page-by-page caching
- Mutations automatically invalidate related queries
- Optimistic updates for better UX where appropriate
