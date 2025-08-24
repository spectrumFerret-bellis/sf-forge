---
outline: deep
---

# STT Engines API

The STT (Speech-to-Text) Engines API provides hooks for managing speech recognition engines used for transcribing radio transmissions. This API supports creating, reading, updating, and deleting STT engine configurations.

## Types

### SttEngine
```typescript
interface SttEngine {
  id: string
  name: string
  version: string
  configuration: Record<string, any>
  created_at: string
  updated_at: string
}
```

### CreateSttEngineData
```typescript
interface CreateSttEngineData {
  name: string
  version?: string
  configuration?: Record<string, any>
}
```

### UpdateSttEngineData
```typescript
interface UpdateSttEngineData {
  name?: string
  version?: string
  configuration?: Record<string, any>
}
```

### PaginatedSttEngines
```typescript
interface PaginatedSttEngines {
  stt_engines: SttEngine[]
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
export const sttEngineKeys = {
  all: ['stt_engines'] as const,
  lists: () => [...sttEngineKeys.all, 'list'] as const,
  list: (filters: string) => [...sttEngineKeys.lists(), { filters }] as const,
  details: () => [...sttEngineKeys.all, 'detail'] as const,
  detail: (id: string) => [...sttEngineKeys.details(), id] as const,
}
```

## Hooks

### useSttEngines()

Fetches a paginated list of STT engines.

**Parameters:**
- `params?: { page?: number; per_page?: number }` - Pagination parameters

**Returns:** `UseQueryResult<PaginatedSttEngines, Error>`

**Example:**
```typescript
import { useSttEngines } from '@/hooks/api'

function SttEngineList() {
  const { data, isLoading, error } = useSttEngines({
    page: 1,
    per_page: 20
  })
  
  if (isLoading) return <div>Loading STT engines...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {data?.stt_engines.map(engine => (
        <div key={engine.id}>
          <h3>{engine.name}</h3>
          <p>Version: {engine.version}</p>
          <p>Created: {new Date(engine.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )
}
```

### useSttEngine()

Fetches a single STT engine by ID.

**Parameters:**
- `id: string` - STT engine ID

**Returns:** `UseQueryResult<{ stt_engine: SttEngine }, Error>`

**Example:**
```typescript
import { useSttEngine } from '@/hooks/api'

function SttEngineDetail({ engineId }: { engineId: string }) {
  const { data, isLoading, error } = useSttEngine(engineId)
  
  if (isLoading) return <div>Loading engine...</div>
  if (error) return <div>Error: {error.message}</div>
  
  const engine = data?.stt_engine
  
  return (
    <div>
      <h2>STT Engine Details</h2>
      <p><strong>Name:</strong> {engine?.name}</p>
      <p><strong>Version:</strong> {engine?.version}</p>
      <p><strong>Created:</strong> {new Date(engine?.created_at || '').toLocaleString()}</p>
      <p><strong>Updated:</strong> {new Date(engine?.updated_at || '').toLocaleString()}</p>
      
      {engine?.configuration && (
        <div>
          <h3>Configuration</h3>
          <pre>{JSON.stringify(engine.configuration, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
```

### useCreateSttEngine()

Creates a new STT engine.

**Returns:** `UseMutationResult<{ stt_engine: SttEngine }, Error, CreateSttEngineData>`

**Example:**
```typescript
import { useCreateSttEngine } from '@/hooks/api'

function CreateSttEngineForm() {
  const createEngine = useCreateSttEngine()
  
  const handleSubmit = (formData: CreateSttEngineData) => {
    createEngine.mutate(formData, {
      onSuccess: (data) => {
        console.log('STT engine created:', data.stt_engine.id)
        // Navigate to engine detail or update list
      },
      onError: (error) => {
        console.error('Failed to create STT engine:', error.message)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="name" 
        placeholder="Engine Name" 
        required 
      />
      <input 
        type="text" 
        name="version" 
        placeholder="Version (optional)"
      />
      <textarea 
        name="configuration" 
        placeholder="Configuration JSON (optional)"
        rows={5}
      />
      <button type="submit" disabled={createEngine.isPending}>
        {createEngine.isPending ? 'Creating...' : 'Create STT Engine'}
      </button>
    </form>
  )
}
```

### useUpdateSttEngine()

Updates an existing STT engine.

**Returns:** `UseMutationResult<{ stt_engine: SttEngine }, Error, { id: string; data: UpdateSttEngineData }>`

**Example:**
```typescript
import { useUpdateSttEngine } from '@/hooks/api'

function UpdateSttEngineForm({ engineId }: { engineId: string }) {
  const updateEngine = useUpdateSttEngine()
  
  const handleSubmit = (data: UpdateSttEngineData) => {
    updateEngine.mutate({ id: engineId, data }, {
      onSuccess: (response) => {
        console.log('STT engine updated:', response.stt_engine.id)
      },
      onError: (error) => {
        console.error('Failed to update STT engine:', error.message)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="name" 
        placeholder="Engine Name"
      />
      <input 
        type="text" 
        name="version" 
        placeholder="Version"
      />
      <textarea 
        name="configuration" 
        placeholder="Configuration JSON"
        rows={5}
      />
      <button type="submit" disabled={updateEngine.isPending}>
        {updateEngine.isPending ? 'Updating...' : 'Update STT Engine'}
      </button>
    </form>
  )
}
```

### useDeleteSttEngine()

Deletes an STT engine.

**Returns:** `UseMutationResult<any, Error, string>`

**Example:**
```typescript
import { useDeleteSttEngine } from '@/hooks/api'

function DeleteSttEngineButton({ engineId }: { engineId: string }) {
  const deleteEngine = useDeleteSttEngine()
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this STT engine?')) {
      deleteEngine.mutate(engineId, {
        onSuccess: () => {
          console.log('STT engine deleted successfully')
          // Navigate away or update list
        },
        onError: (error) => {
          console.error('Failed to delete STT engine:', error.message)
        }
      })
    }
  }
  
  return (
    <button 
      onClick={handleDelete}
      disabled={deleteEngine.isPending}
      className="text-red-600"
    >
      {deleteEngine.isPending ? 'Deleting...' : 'Delete STT Engine'}
    </button>
  )
}
```

## Usage Patterns

### STT Engine Configuration Manager
```typescript
import { useSttEngine, useUpdateSttEngine } from '@/hooks/api'
import { useState } from 'react'

function SttEngineConfigManager({ engineId }: { engineId: string }) {
  const { data } = useSttEngine(engineId)
  const updateEngine = useUpdateSttEngine()
  const [config, setConfig] = useState('')
  
  const engine = data?.stt_engine
  
  const handleConfigUpdate = () => {
    try {
      const parsedConfig = JSON.parse(config)
      updateEngine.mutate({
        id: engineId,
        data: { configuration: parsedConfig }
      })
    } catch (error) {
      alert('Invalid JSON configuration')
    }
  }
  
  if (!engine) return <div>Loading...</div>
  
  return (
    <div className="stt-engine-config">
      <h3>Configuration for {engine.name}</h3>
      
      <div className="config-editor">
        <label>Configuration JSON:</label>
        <textarea
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          placeholder={JSON.stringify(engine.configuration, null, 2)}
          rows={10}
        />
        <button onClick={handleConfigUpdate} disabled={updateEngine.isPending}>
          {updateEngine.isPending ? 'Updating...' : 'Update Configuration'}
        </button>
      </div>
      
      <div className="current-config">
        <h4>Current Configuration:</h4>
        <pre>{JSON.stringify(engine.configuration, null, 2)}</pre>
      </div>
    </div>
  )
}
```

### STT Engine Selector
```typescript
import { useSttEngines } from '@/hooks/api'

function SttEngineSelector({ onSelect }: { onSelect: (engineId: string) => void }) {
  const { data, isLoading, error } = useSttEngines()
  
  if (isLoading) return <div>Loading engines...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div className="stt-engine-selector">
      <h3>Select STT Engine</h3>
      <div className="engine-list">
        {data?.stt_engines.map(engine => (
          <div 
            key={engine.id} 
            className="engine-option"
            onClick={() => onSelect(engine.id)}
          >
            <h4>{engine.name}</h4>
            <p>Version: {engine.version}</p>
            <p>Created: {new Date(engine.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### STT Engine Comparison
```typescript
import { useSttEngine } from '@/hooks/api'

function SttEngineComparison({ engineIds }: { engineIds: string[] }) {
  const engineQueries = engineIds.map(id => useSttEngine(id))
  
  const isLoading = engineQueries.some(query => query.isLoading)
  const hasError = engineQueries.some(query => query.error)
  
  if (isLoading) return <div>Loading engines...</div>
  if (hasError) return <div>Error loading engines</div>
  
  return (
    <div className="stt-engine-comparison">
      <h3>STT Engine Comparison</h3>
      <div className="comparison-grid">
        {engineQueries.map((query, index) => {
          const engine = query.data?.stt_engine
          if (!engine) return null
          
          return (
            <div key={engine.id} className="engine-card">
              <h4>{engine.name}</h4>
              <p><strong>Version:</strong> {engine.version}</p>
              <p><strong>Created:</strong> {new Date(engine.created_at).toLocaleDateString()}</p>
              <p><strong>Updated:</strong> {new Date(engine.updated_at).toLocaleDateString()}</p>
              
              {engine.configuration && (
                <details>
                  <summary>Configuration</summary>
                  <pre>{JSON.stringify(engine.configuration, null, 2)}</pre>
                </details>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

## Configuration Examples

### Common STT Engine Configurations

#### Whisper Configuration
```json
{
  "model": "whisper-1",
  "language": "en",
  "temperature": 0.0,
  "response_format": "verbose_json",
  "timestamp_granularities": ["word"]
}
```

#### Google Speech-to-Text Configuration
```json
{
  "languageCode": "en-US",
  "enableWordTimeOffsets": true,
  "enableAutomaticPunctuation": true,
  "model": "latest_long"
}
```

#### Azure Speech Services Configuration
```json
{
  "language": "en-US",
  "format": "detailed",
  "profanityFilter": "removed",
  "enableWordLevelTimestamps": true
}
```

## Error Handling

The STT engines API includes comprehensive error handling:
- Validation of configuration JSON format
- Graceful handling of missing engine data
- Clear error messages for debugging
- Automatic query invalidation on mutations

## Caching Strategy

STT engines use an efficient caching strategy:
- List queries are cached for 5 minutes with background refetching
- Detail queries are cached until invalidated
- Mutations automatically invalidate related queries
- Configuration updates trigger cache invalidation

## Integration with Other APIs

The STT engines API integrates with:
- **Transmissions API**: Provides engine information for transmission processing
- **Transcriptions API**: Supplies engine context for transcription creation
- **Configuration Management**: Enables dynamic engine configuration updates
- **System Administration**: Supports engine deployment and management
