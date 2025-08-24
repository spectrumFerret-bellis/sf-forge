# Spectrum Ferret Documentation

This directory contains the comprehensive documentation for the Spectrum Ferret radio transmission analysis platform, built with VitePress.

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev

# Build for production
pnpm build

# Preview the production build
pnpm preview
```

## Documentation Structure

### Getting Started
- **Overview** (`/`) - Introduction to the Spectrum Ferret platform
- **Libraries & Architecture** (`/libraries`) - Comprehensive guide to the technology stack

### API Documentation

The API documentation is organized into logical sections:

#### Core Utilities
- **Overview** (`/api/`) - Introduction to the API architecture
- **Utilities** (`/api/utilities`) - Core API client, patterns, and best practices

#### Authentication
- **Authentication Hooks** (`/api/auth`) - Login, logout, and token management

#### Radio Data
- **Transmissions** (`/api/transmissions`) - Radio transmission data management
- **Transmission Summary** (`/api/transmission-summary`) - Aggregated transmission statistics
- **Transcriptions** (`/api/transcriptions`) - Speech-to-text transcription data
- **STT Engines** (`/api/stt-engines`) - Speech-to-text engine management

#### Playlists & Channels
- **Playlists** (`/api/playlists`) - Radio playlist management
- **Playlist Channels** (`/api/playlist-channels`) - Channel associations within playlists
- **Channels** (`/api/channels`) - Conventional radio channels
- **Trunking Channels** (`/api/trunking-channels`) - Trunking system channels

### Examples
- **Markdown Examples** (`/markdown-examples`) - VitePress markdown features
- **Runtime API Examples** (`/api-examples`) - VitePress runtime API usage

## Technology Stack

The Spectrum Ferret application uses a carefully selected stack of modern libraries:

### Core Libraries
- **TanStack Query (React Query)** - Data fetching, caching, and state synchronization
- **Zustand** - Lightweight state management for UI state and preferences
- **Tailwind CSS** - Utility-first CSS framework for rapid development
- **TanStack Table** - Headless table solution for complex data display
- **shadcn/ui** - Accessible component library built on Radix UI
- **Lucide React** - Modern, consistent icon library
- **Ant Design Icons** - Comprehensive icon set for specialized features

### Key Architectural Decisions

#### Separation of Concerns: Caching vs State Management
- **TanStack Query**: Handles server state (API data) with intelligent caching
- **Zustand**: Manages client state (UI state, preferences) with persistence
- **Benefits**: Clear responsibility separation, optimized performance, better developer experience

#### Data Management Strategy
- **Intelligent Caching**: Automatic background refetching and cache invalidation
- **Optimistic Updates**: Immediate UI feedback for better user experience
- **Error Handling**: Built-in retry logic and error boundaries
- **Type Safety**: Full TypeScript support throughout the stack

## API Architecture

The Spectrum Ferret API is built using:

- **TanStack Query (React Query)** - For efficient data fetching, caching, and state management
- **TypeScript** - For type safety and better developer experience
- **REST API** - Standard HTTP-based API with JSON responses
- **JWT Authentication** - Bearer token-based authentication

### Key Features

- **Automatic Caching** - Intelligent caching with background refetching
- **Error Handling** - Comprehensive error handling with user-friendly messages
- **Type Safety** - Full TypeScript support with generated types
- **Authentication** - Automatic token management and refresh
- **Pagination** - Built-in support for paginated responses
- **Real-time Updates** - Support for real-time data updates

## Usage Examples

### Basic Query Hook
```typescript
import { useTransmissions } from '@/hooks/api'

function TransmissionList() {
  const { data, isLoading, error } = useTransmissions({
    page: 1,
    per_page: 20
  })
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {data?.radio_transmissions.map(transmission => (
        <div key={transmission.id}>
          <h3>Transmission {transmission.id}</h3>
          <p>Frequency: {transmission.rx_frequency_hz} Hz</p>
        </div>
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
  
  const handleSubmit = (formData: CreatePlaylistData) => {
    createPlaylist.mutate(formData, {
      onSuccess: (data) => {
        console.log('Playlist created:', data.radio_playlist.id)
      },
      onError: (error) => {
        console.error('Failed to create playlist:', error.message)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Playlist Name" required />
      <button type="submit" disabled={createPlaylist.isPending}>
        {createPlaylist.isPending ? 'Creating...' : 'Create Playlist'}
      </button>
    </form>
  )
}
```

### State Management with Zustand
```typescript
import { usePlaylistStore } from '@/stores/playlistStore'

function PlaylistSelector() {
  const { selectedPlaylistId, setSelectedPlaylist } = usePlaylistStore()
  
  return (
    <div>
      <select 
        value={selectedPlaylistId || ''} 
        onChange={(e) => setSelectedPlaylist(e.target.value)}
      >
        <option value="">Select a playlist</option>
        {/* playlist options */}
      </select>
    </div>
  )
}
```

## Development

### Adding New API Documentation

1. Create a new markdown file in the appropriate directory under `/api/`
2. Use the standard frontmatter:
   ```markdown
   ---
   outline: deep
   ---
   ```
3. Follow the established documentation structure:
   - Types section with TypeScript interfaces
   - Query Keys section
   - Hooks section with examples
   - Usage Patterns section
   - Error Handling section
   - Caching Strategy section
   - Integration section

4. Update the VitePress configuration in `.vitepress/config.ts` to include the new page

### Documentation Standards

- Use TypeScript code blocks for all code examples
- Include comprehensive examples for each hook
- Provide usage patterns and best practices
- Document error handling and edge cases
- Include integration examples with other APIs

### Code Examples

All code examples should:
- Be complete and runnable
- Include proper TypeScript types
- Show error handling
- Demonstrate best practices
- Include comments for complex logic

## Contributing

When contributing to the documentation:

1. Follow the existing structure and formatting
2. Ensure all code examples are tested
3. Update the sidebar navigation when adding new pages
4. Include comprehensive examples and use cases
5. Maintain consistency with existing documentation style

## Building and Deployment

### Local Development
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
```

The built documentation will be available in the `.vitepress/dist` directory.

### Deployment

The documentation can be deployed to any static hosting service:

- **Vercel** - Automatic deployment from Git
- **Netlify** - Drag and drop or Git integration
- **GitHub Pages** - Free hosting for public repositories
- **AWS S3** - Scalable static hosting

## Support

For questions about the API or documentation:

1. Check the relevant API documentation page
2. Review the examples and usage patterns
3. Examine the TypeScript types for guidance
4. Look at the integration examples
5. Consult the Libraries & Architecture section for technology stack questions

## License

This documentation is part of the Spectrum Ferret project and follows the same license terms.
