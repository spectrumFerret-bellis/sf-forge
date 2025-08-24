---
outline: deep
---

# API Documentation

Welcome to the Spectrum Ferret API documentation. This section covers all the React Query hooks and API utilities available in the application.

## Overview

The API layer is built using [TanStack Query](https://tanstack.com/query) (React Query) for efficient data fetching, caching, and state management. All API calls are made through a centralized `api` utility that handles authentication, error handling, and request formatting.

## API Categories

### 🔐 Authentication
- [Authentication Hooks](./auth.md) - Login, logout, and token management

### 📻 Radio Data
- [Transmissions](./transmissions.md) - Radio transmission data and management
- [Transmission Summary](./transmission-summary.md) - Aggregated transmission statistics
- [Transcriptions](./transcriptions.md) - Speech-to-text transcription data
- [STT Engines](./stt-engines.md) - Speech-to-text engine management

### 📋 Playlists & Channels
- [Playlists](./playlists.md) - Radio playlist management
- [Playlist Channels](./playlist-channels.md) - Channel associations within playlists
- [Channels](./channels.md) - Conventional radio channels
- [Trunking Channels](./trunking-channels.md) - Trunking system channels

## Core Utilities

### API Client
The base API client (`@/lib/api`) provides:
- Automatic authentication header injection
- Error handling and response parsing
- Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Query parameter handling

### Query Keys
Each API module exports structured query keys for efficient caching and invalidation:
```typescript
// Example query key structure
export const playlistKeys = {
  all: ['radio_playlists'] as const,
  lists: () => [...playlistKeys.all, 'list'] as const,
  list: (filters: string) => [...playlistKeys.lists(), { filters }] as const,
  details: () => [...playlistKeys.all, 'detail'] as const,
  detail: (id: string) => [...playlistKeys.details(), id] as const,
}
```

## Usage Patterns

### Basic Query Hook
```typescript
import { usePlaylists } from '@/hooks/api'

function PlaylistList() {
  const { data, isLoading, error } = usePlaylists({ page: 1, per_page: 20 })
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {data?.radio_playlists.map(playlist => (
        <div key={playlist.id}>{playlist.name}</div>
      ))}
    </div>
  )
}
```

### Mutation Hook
```typescript
import { useCreatePlaylist } from '@/hooks/api'

function CreatePlaylistForm() {
  const createPlaylist = useCreatePlaylist()
  
  const handleSubmit = (formData: { name: string; description?: string }) => {
    createPlaylist.mutate(formData, {
      onSuccess: () => {
        // Handle success
      },
      onError: (error) => {
        // Handle error
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  )
}
```

## Error Handling

All API hooks include comprehensive error handling:
- Network errors are automatically caught and formatted
- HTTP error responses include status codes and error details
- Authentication errors trigger automatic token refresh when possible
- Query invalidation ensures data consistency after mutations

## Authentication

The API automatically handles authentication through:
- Bearer token injection in request headers
- Automatic token refresh on 401 responses
- Token storage in localStorage
- Automatic logout on authentication failures

## Base URL Configuration

All API calls are made to `/api/v1` relative to the current domain. The base URL can be configured in `@/lib/api.ts`.
