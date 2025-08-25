Yes! `usePlaylists()` is automatically invoked when the component mounts. Here's how TanStack Query works:

## **Automatic API Invocation**

### **How usePlaylists() Works:**

```typescript
export function usePlaylists(params?: {
  page?: number
  per_page?: number
}) {
  return useQuery({
    queryKey: playlistKeys.list(JSON.stringify(params || {})),
    queryFn: () => api.get<PaginatedPlaylists>('/radio/playlists', params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### **Automatic Behavior:**

1. **✅ Immediate Execution**: When `usePlaylists()` is called, it immediately starts the API call
2. **✅ No Manual Trigger**: You don't need to call `.mutate()` or `.refetch()` manually
3. **✅ Automatic Caching**: Results are cached and reused across components
4. **✅ Background Updates**: Can be configured to refetch automatically

### **What Happens When You Call usePlaylists():**

```typescript
// This automatically triggers the API call
const { data: playlists, isLoading, error } = usePlaylists()

// The API call happens immediately:
// GET /api/v1/radio/playlists
```

### **Return Values:**

```typescript
const { 
  data,           // API response data
  isLoading,      // true while API call is in progress
  error,          // error object if API call fails
  isError,        // true if there was an error
  refetch,        // function to manually refetch
  isFetching      // true during any fetch (including background)
} = usePlaylists()
```

## **Key Differences from Manual Fetching:**

### **Traditional useEffect Approach:**
```typescript
// Manual - you have to manage everything
const [playlists, setPlaylists] = useState([])
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  fetch('/api/v1/radio/playlists')
    .then(res => res.json())
    .then(data => setPlaylists(data))
    .catch(err => setError(err))
    .finally(() => setIsLoading(false))
}, [])
```

### **TanStack Query Approach:**
```typescript
// Automatic - TanStack Query handles everything
const { data: playlists, isLoading, error } = usePlaylists()
```

## **Additional Automatic Features:**

### **1. Automatic Caching:**
```typescript
// First call - makes API request
const { data: playlists1 } = usePlaylists()

// Second call - uses cached data (no API request)
const { data: playlists2 } = usePlaylists()
```

### **2. Background Refetching:**
```typescript
// Can be configured to refetch automatically
const { data } = usePlaylists({
  refetchInterval: 30000, // Refetch every 30 seconds
  refetchOnWindowFocus: true // Refetch when window gains focus
})
```

### **3. Stale Data Handling:**
```typescript
// Shows cached data immediately, then refetches in background
const { data, isLoading, isFetching } = usePlaylists()
// isLoading = false (showing cached data)
// isFetching = true (refetching in background)
```

## **So to Answer Your Question:**

**Yes, `usePlaylists()` automatically invokes the API call when the component mounts.** You don't need to do anything else - just call the hook and it handles the entire data fetching lifecycle automatically.

This is one of the main benefits of TanStack Query - it eliminates the boilerplate code you'd normally need for manual API calls with useEffect, useState, and error handling.