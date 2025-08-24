---
outline: deep
---

# API Utilities

The API utilities provide the foundation for all API interactions in the Spectrum Ferret application. This section covers the core API client, error handling, and common patterns used throughout the application.

## Core API Client

The base API client (`@/lib/api`) provides a centralized interface for all HTTP requests with automatic authentication, error handling, and response parsing.

### API Client Configuration

```typescript
// API utility functions for REST calls
const API_BASE = '/api/v1'

interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

interface ApiError {
  message: string
  status: number
  details?: any
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
```

### HTTP Methods

The API client supports all standard HTTP methods:

#### GET Requests
```typescript
async get<T>(endpoint: string, params?: Record<string, any>): Promise<T>
```

**Example:**
```typescript
import { api } from '@/lib/api'

// Simple GET request
const response = await api.get<{ user: User }>('/users/123')

// GET request with query parameters
const response = await api.get<PaginatedResponse>('/users', {
  page: 1,
  per_page: 20,
  search: 'john'
})
```

#### POST Requests
```typescript
async post<T>(endpoint: string, data?: any): Promise<T>
```

**Example:**
```typescript
import { api } from '@/lib/api'

const response = await api.post<{ user: User }>('/users', {
  name: 'John Doe',
  email: 'john@example.com'
})
```

#### PUT Requests
```typescript
async put<T>(endpoint: string, data?: any): Promise<T>
```

**Example:**
```typescript
import { api } from '@/lib/api'

const response = await api.put<{ user: User }>('/users/123', {
  name: 'John Smith',
  email: 'johnsmith@example.com'
})
```

#### PATCH Requests
```typescript
async patch<T>(endpoint: string, data?: any): Promise<T>
```

**Example:**
```typescript
import { api } from '@/lib/api'

const response = await api.patch<{ user: User }>('/users/123', {
  email: 'newemail@example.com'
})
```

#### DELETE Requests
```typescript
async delete<T>(endpoint: string): Promise<T>
```

**Example:**
```typescript
import { api } from '@/lib/api'

const response = await api.delete('/users/123')
```

### Authentication Handling

The API client automatically handles authentication through Bearer tokens:

```typescript
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('access_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}
```

### Error Handling

All API requests include comprehensive error handling:

```typescript
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status,
      errorData
    )
  }
  
  return response.json()
}
```

## Query Key Patterns

Each API module exports structured query keys for efficient caching and invalidation:

### Standard Query Key Structure
```typescript
export const resourceKeys = {
  all: ['resource_name'] as const,
  lists: () => [...resourceKeys.all, 'list'] as const,
  list: (filters: string) => [...resourceKeys.lists(), { filters }] as const,
  details: () => [...resourceKeys.all, 'detail'] as const,
  detail: (id: string) => [...resourceKeys.details(), id] as const,
}
```

### Example: Playlist Query Keys
```typescript
export const playlistKeys = {
  all: ['radio_playlists'] as const,
  lists: () => [...playlistKeys.all, 'list'] as const,
  list: (filters: string) => [...playlistKeys.lists(), { filters }] as const,
  details: () => [...playlistKeys.all, 'detail'] as const,
  detail: (id: string) => [...playlistKeys.details(), id] as const,
}
```

### Example: Transmission Query Keys
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

## Common Patterns

### Pagination Handling
```typescript
interface PaginationParams {
  page?: number
  per_page?: number
}

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    links: {
      first: string
      last: string
      prev: string | null
      next: string | null
    }
  }
}

// Usage in hooks
export function usePaginatedResource(params?: PaginationParams) {
  return useQuery({
    queryKey: resourceKeys.list(JSON.stringify(params || {})),
    queryFn: () => api.get<PaginatedResponse<Resource>>('/resource', params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### Time Range Processing
```typescript
import { toZonedTime } from 'date-fns-tz'

// Convert time range to UTC for API calls
const convertTimeRangeToUTC = (timeRange: TimeRange) => {
  return {
    start: timeRange.start.toISOString(),
    end: timeRange.end.toISOString()
  }
}

// Usage in API calls
const utcTimeRange = convertTimeRangeToUTC(timeRange)
const response = await api.get('/transmissions', {
  start_ts: utcTimeRange.start,
  end_ts: utcTimeRange.end
})
```

### Array Parameter Handling
```typescript
// Convert channel_ids array to API format
const formatChannelIds = (channelIds: string[]) => {
  return channelIds.map(id => `channel_ids[]=${id}`).join('&')
}

// Usage in API calls
const queryParams = new URLSearchParams()
channelIds.forEach(id => {
  queryParams.append('channel_ids[]', id)
})

const response = await api.get(`/transmissions?${queryParams.toString()}`)
```

## Error Handling Patterns

### Standard Error Handling
```typescript
// In React components
function ResourceList() {
  const { data, isLoading, error } = useResource()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {data?.items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

### Mutation Error Handling
```typescript
function CreateResourceForm() {
  const createResource = useCreateResource()
  
  const handleSubmit = (formData: CreateResourceData) => {
    createResource.mutate(formData, {
      onSuccess: (data) => {
        console.log('Resource created:', data.id)
        // Handle success
      },
      onError: (error) => {
        console.error('Failed to create resource:', error.message)
        // Handle error
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={createResource.isPending}>
        {createResource.isPending ? 'Creating...' : 'Create Resource'}
      </button>
    </form>
  )
}
```

## Caching Strategies

### Standard Caching
```typescript
// List queries with background refetching
export function useResourceList(params?: PaginationParams) {
  return useQuery({
    queryKey: resourceKeys.list(JSON.stringify(params || {})),
    queryFn: () => api.get<PaginatedResponse<Resource>>('/resource', params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Detail queries cached until invalidated
export function useResource(id: string) {
  return useQuery({
    queryKey: resourceKeys.detail(id),
    queryFn: () => api.get<{ resource: Resource }>(`/resource/${id}`),
    enabled: !!id,
  })
}
```

### Cache Invalidation
```typescript
export function useCreateResource() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateResourceData) => 
      api.post<{ resource: Resource }>('/resource', { resource: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })
    },
  })
}

export function useUpdateResource() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResourceData }) => 
      api.patch<{ resource: Resource }>(`/resource/${id}`, { resource: data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })
    },
  })
}
```

## Type Safety

### Generic Type Usage
```typescript
// API client with generic types
const response = await api.get<{ user: User }>('/users/123')
const user: User = response.user

// Hook with generic types
export function useResource<T>(id: string) {
  return useQuery({
    queryKey: resourceKeys.detail(id),
    queryFn: () => api.get<{ resource: T }>(`/resource/${id}`),
    enabled: !!id,
  })
}
```

### Type Guards
```typescript
// Type guard for API responses
function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

// Usage in error handling
try {
  const response = await api.get('/resource')
} catch (error) {
  if (isApiError(error)) {
    console.error(`API Error ${error.status}: ${error.message}`)
  } else {
    console.error('Unknown error:', error)
  }
}
```

## Best Practices

### 1. Consistent Error Handling
- Always handle loading and error states in components
- Use consistent error message formatting
- Implement retry logic for transient failures

### 2. Query Key Management
- Use structured query keys for efficient caching
- Include all relevant parameters in query keys
- Implement proper cache invalidation strategies

### 3. Type Safety
- Use TypeScript interfaces for all API responses
- Implement generic types for reusable hooks
- Validate API responses at runtime when necessary

### 4. Performance Optimization
- Use appropriate stale times for different data types
- Implement background refetching for fresh data
- Optimize query invalidation to minimize unnecessary requests

### 5. Authentication
- Always check authentication status before making requests
- Handle token refresh automatically
- Implement proper logout cleanup

## Integration Examples

### Custom Hook with Utilities
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useCustomResource(id: string) {
  const queryClient = useQueryClient()
  
  const query = useQuery({
    queryKey: ['custom', 'resource', id],
    queryFn: () => api.get<{ resource: CustomResource }>(`/custom/${id}`),
    enabled: !!id,
  })
  
  const mutation = useMutation({
    mutationFn: (data: UpdateCustomResourceData) => 
      api.patch<{ resource: CustomResource }>(`/custom/${id}`, { resource: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom', 'resource', id] })
    },
  })
  
  return {
    ...query,
    update: mutation.mutate,
    isUpdating: mutation.isPending,
  }
}
```

### Utility Functions
```typescript
// Date formatting utility
export function formatApiDate(date: string): string {
  return new Date(date).toLocaleString()
}

// Frequency formatting utility
export function formatFrequency(hz: number): string {
  if (hz >= 1000000) {
    return `${(hz / 1000000).toFixed(2)} MHz`
  } else if (hz >= 1000) {
    return `${(hz / 1000).toFixed(2)} kHz`
  }
  return `${hz} Hz`
}

// Duration formatting utility
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  }
  return `${seconds}s`
}
```
