---
outline: deep
---

# Libraries & Architecture

This section covers the major libraries and frameworks used in the Spectrum Ferret application, explaining why each was chosen and how they work together to create a robust, maintainable system.

## Core Libraries Overview

The Spectrum Ferret application is built using a carefully selected stack of modern libraries that provide specific benefits for radio transmission analysis and real-time data management.

### Library Stack

| Library | Purpose | Version | Key Benefits |
|---------|---------|---------|--------------|
| **TanStack Query** | Data fetching & caching | v5+ | Intelligent caching, background updates |
| **Zustand** | State management | v4+ | Lightweight, TypeScript-first |
| **Tailwind CSS** | Utility-first styling | v3+ | Rapid development, consistent design |
| **TanStack Table** | Data table management | v8+ | Headless, flexible, performant |
| **shadcn/ui** | Component library | Latest | Radix-based, accessible |
| **Lucide React** | Icon library | Latest | Consistent, tree-shakeable |
| **Ant Design Icons** | Additional icons | Latest | Comprehensive icon set |

## Data Management Architecture

### TanStack Query (React Query)

**Why TanStack Query?**

TanStack Query is the foundation of our data management strategy, providing intelligent caching, background updates, and optimistic updates for a seamless user experience.

#### Key Benefits

```typescript
// Automatic caching with intelligent invalidation
export function useTransmissions(params?: TransmissionSearchParams) {
  return useQuery({
    queryKey: transmissionKeys.list(JSON.stringify(params || {})),
    queryFn: () => api.get<PaginatedTransmissions>('/radio/transmissions', params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes garbage collection
  })
}

// Background refetching for fresh data
export function useTransmission(id: string) {
  return useQuery({
    queryKey: transmissionKeys.detail(id),
    queryFn: () => api.get<{ radio_transmission: RadioTransmission }>(`/radio/transmissions/${id}`),
    enabled: !!id,
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: true,       // Refetch when component mounts
  })
}
```

#### Advanced Features

- **Infinite Queries**: Perfect for large datasets like transmission lists
- **Optimistic Updates**: Immediate UI feedback for mutations
- **Error Handling**: Built-in retry logic and error boundaries
- **DevTools**: Excellent debugging experience

### Zustand

**Why Zustand?**

Zustand provides lightweight, TypeScript-first state management that complements TanStack Query perfectly. We use it for UI state, user preferences, and application configuration.

#### Benefits Over Redux

```typescript
// Simple, intuitive API
interface PlaylistStore {
  selectedPlaylistId: string | null
  timeRange: TimeRange
  setSelectedPlaylist: (id: string) => void
  setTimeRange: (range: TimeRange) => void
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  selectedPlaylistId: null,
  timeRange: {
    start: subHours(new Date(), 24),
    end: new Date()
  },
  setSelectedPlaylist: (id) => set({ selectedPlaylistId: id }),
  setTimeRange: (range) => set({ timeRange: range })
}))
```

#### Key Advantages

- **Minimal Boilerplate**: No providers, actions, or reducers needed
- **TypeScript Support**: First-class TypeScript support
- **Performance**: Automatic component optimization
- **Middleware Support**: Easy to add persistence, devtools, etc.

## Separation of Concerns: Caching vs State Management

### Why Separate TanStack Query from Zustand?

This architectural decision provides significant benefits:

#### 1. **Clear Responsibility Separation**

```typescript
// TanStack Query: Server state (API data)
const { data: transmissions } = useTransmissions({
  playlistId: selectedPlaylistId,
  timeRange: timeRange
})

// Zustand: Client state (UI state)
const { selectedPlaylistId, timeRange } = usePlaylistStore()
```

#### 2. **Different Lifecycle Management**

```typescript
// Server state: Managed by TanStack Query
// - Automatic caching
// - Background refetching
// - Garbage collection
// - Network error handling

// Client state: Managed by Zustand
// - Persisted across sessions
// - Immediate updates
// - No network dependencies
```

#### 3. **Optimized Performance**

```typescript
// TanStack Query optimizations
const { data, isLoading } = useTransmissions(params, {
  staleTime: 5 * 60 * 1000,    // Cache for 5 minutes
  gcTime: 10 * 60 * 1000,      // Keep in memory for 10 minutes
  refetchOnWindowFocus: false,  // Don't refetch on focus for large datasets
})

// Zustand optimizations
const selectedPlaylistId = usePlaylistStore(state => state.selectedPlaylistId)
// Only re-renders when selectedPlaylistId changes
```

#### 4. **Better Developer Experience**

```typescript
// Clear data flow
function TransmissionList() {
  // UI state from Zustand
  const { selectedPlaylistId, timeRange } = usePlaylistStore()
  
  // Server state from TanStack Query
  const { data, isLoading, error } = useTransmissions({
    playlistId: selectedPlaylistId,
    timeRange: timeRange
  })
  
  // Clear separation makes debugging easier
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return <TransmissionTable transmissions={data?.transmissions} />
}
```

## UI & Styling Architecture

### Tailwind CSS

**Why Tailwind CSS?**

Tailwind provides utility-first CSS that enables rapid development while maintaining consistency and performance.

#### Benefits

```typescript
// Rapid development with consistent design tokens
function TransmissionCard({ transmission }: { transmission: RadioTransmission }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Transmission {transmission.id}
        </h3>
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          {transmission.rx_frequency_hz?.toLocaleString()} Hz
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <p>Started: {formatDate(transmission.rx_started_at)}</p>
        <p>Signal Quality: {transmission.rx_signal_quality}%</p>
      </div>
    </div>
  )
}
```

#### Key Advantages

- **Design System**: Consistent spacing, colors, and typography
- **Dark Mode**: Built-in dark mode support
- **Performance**: Only includes used styles in production
- **Responsive**: Mobile-first responsive design utilities

### shadcn/ui

**Why shadcn/ui?**

shadcn/ui provides accessible, customizable components built on Radix UI primitives, giving us the best of both worlds: accessibility and flexibility.

#### Benefits

```typescript
// Accessible, customizable components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function PlaylistCard({ playlist }: { playlist: RadioPlaylist }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {playlist.name}
          <Badge variant="secondary">
            {playlist.radio_playlist_channels.length} channels
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{playlist.description}</p>
        <div className="mt-4 flex gap-2">
          <Button size="sm">View Details</Button>
          <Button size="sm" variant="outline">Edit</Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

#### Key Advantages

- **Accessibility**: Built on Radix UI primitives
- **Customizable**: Copy components to your project
- **TypeScript**: Full TypeScript support
- **Consistent**: Follows design system patterns

## Data Display Architecture

### TanStack Table

**Why TanStack Table?**

TanStack Table provides a headless table solution that's perfect for complex data display requirements in radio transmission analysis.

#### Benefits

```typescript
import { useReactTable, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'

function TransmissionsTable({ transmissions }: { transmissions: RadioTransmission[] }) {
  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <span className="font-mono">{row.getValue('id')}</span>
    },
    {
      accessorKey: 'rx_frequency_hz',
      header: 'Frequency',
      cell: ({ row }) => {
        const freq = row.getValue('rx_frequency_hz') as number
        return freq ? `${(freq / 1000000).toFixed(2)} MHz` : '-'
      }
    },
    {
      accessorKey: 'rx_started_at',
      header: 'Start Time',
      cell: ({ row }) => formatDateTime(row.getValue('rx_started_at'))
    },
    {
      accessorKey: 'rx_signal_quality',
      header: 'Signal Quality',
      cell: ({ row }) => {
        const quality = row.getValue('rx_signal_quality') as number
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${quality}%` }}
              />
            </div>
            <span className="text-sm">{quality}%</span>
          </div>
        )
      }
    }
  ], [])

  const table = useReactTable({
    data: transmissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

#### Key Advantages

- **Headless**: Complete control over styling and behavior
- **Performance**: Virtual scrolling for large datasets
- **Flexibility**: Custom cell renderers and sorting
- **TypeScript**: Full type safety

## Icon System

### Lucide React + Ant Design Icons

**Why Two Icon Libraries?**

We use a combination of Lucide React and Ant Design Icons to provide comprehensive icon coverage while maintaining consistency.

#### Lucide React Benefits

```typescript
import { Radio, Signal, Wifi, Volume2, Settings } from 'lucide-react'

// Consistent, modern icon set
function TransmissionControls() {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm">
        <Radio className="w-4 h-4 mr-2" />
        Tune
      </Button>
      <Button variant="ghost" size="sm">
        <Signal className="w-4 h-4 mr-2" />
        Signal
      </Button>
      <Button variant="ghost" size="sm">
        <Volume2 className="w-4 h-4 mr-2" />
        Audio
      </Button>
    </div>
  )
}
```

#### Ant Design Icons Benefits

```typescript
import { 
  AudioOutlined, 
  BarChartOutlined, 
  DatabaseOutlined,
  ExperimentOutlined 
} from '@ant-design/icons'

// Comprehensive icon set for specialized features
function AnalysisTools() {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm">
        <AudioOutlined className="mr-2" />
        Audio Analysis
      </Button>
      <Button variant="ghost" size="sm">
        <BarChartOutlined className="mr-2" />
        Statistics
      </Button>
      <Button variant="ghost" size="sm">
        <DatabaseOutlined className="mr-2" />
        Data Export
      </Button>
    </div>
  )
}
```

## Architectural Benefits

### 1. **Scalability**

The separation of concerns allows each part of the system to scale independently:

```typescript
// Data layer can scale with TanStack Query optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

// UI layer can scale with component composition
function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <TransmissionSummary />
      <ChannelActivity />
      <SystemStatus />
    </div>
  )
}
```

### 2. **Maintainability**

Clear separation makes the codebase easier to maintain:

```typescript
// API layer: Pure data fetching
export function useTransmissions(params) { /* ... */ }

// State layer: Pure UI state
export const useAppStore = create((set) => ({ /* ... */ }))

// UI layer: Pure presentation
function TransmissionList() { /* ... */ }
```

### 3. **Performance**

Each library is optimized for its specific use case:

```typescript
// TanStack Query: Optimized for server state
const { data } = useTransmissions(params, {
  staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
  refetchOnWindowFocus: false, // Don't refetch on focus
})

// Zustand: Optimized for client state
const selectedId = useAppStore(state => state.selectedId) // Only re-renders when selectedId changes

// TanStack Table: Optimized for large datasets
const table = useReactTable({
  data: transmissions,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  // Virtual scrolling for performance
})
```

### 4. **Developer Experience**

The combination provides excellent DX:

```typescript
// TypeScript support throughout
interface Transmission {
  id: string
  rx_frequency_hz: number
  rx_started_at: string
  // ... other properties
}

// IntelliSense for all libraries
const { data: transmissions } = useTransmissions<Transmission[]>()
const { selectedId } = useAppStore<{ selectedId: string }>()
```

## Best Practices

### 1. **Library-Specific Patterns**

```typescript
// TanStack Query: Use query keys for cache management
export const transmissionKeys = {
  all: ['transmissions'] as const,
  lists: () => [...transmissionKeys.all, 'list'] as const,
  list: (filters: string) => [...transmissionKeys.lists(), { filters }] as const,
}

// Zustand: Use selectors for performance
const selectedTransmission = useTransmissionStore(
  state => state.transmissions.find(t => t.id === state.selectedId)
)

// TanStack Table: Use column definitions
const columns = useMemo(() => [
  // ... column definitions
], [])
```

### 2. **Integration Patterns**

```typescript
// Combine libraries effectively
function TransmissionDashboard() {
  // Server state
  const { data: transmissions } = useTransmissions()
  
  // Client state
  const { selectedId, setSelectedId } = useAppStore()
  
  // UI components
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5" />
            Transmissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TransmissionsTable 
            data={transmissions} 
            onRowClick={setSelectedId}
          />
        </CardContent>
      </Card>
      
      {selectedId && (
        <Card className="lg:col-span-2">
          <TransmissionDetail id={selectedId} />
        </Card>
      )}
    </div>
  )
}
```

### 3. **Performance Optimization**

```typescript
// Memoize expensive computations
const sortedTransmissions = useMemo(() => 
  transmissions?.sort((a, b) => 
    new Date(b.rx_started_at).getTime() - new Date(a.rx_started_at).getTime()
  ), [transmissions]
)

// Use React.memo for expensive components
const TransmissionRow = React.memo(({ transmission }: { transmission: RadioTransmission }) => {
  return (
    <TableRow>
      {/* ... row content */}
    </TableRow>
  )
})
```

## Migration & Evolution

### Future Considerations

The current architecture provides a solid foundation for future enhancements:

- **Real-time Updates**: TanStack Query's real-time capabilities
- **Offline Support**: Zustand persistence + TanStack Query offline features
- **Performance**: Virtual scrolling, lazy loading, and code splitting
- **Accessibility**: shadcn/ui + Radix UI primitives
- **Internationalization**: Ready for i18n libraries

This library stack and architectural approach provides the Spectrum Ferret application with a robust, scalable, and maintainable foundation for radio transmission analysis and real-time data management.
