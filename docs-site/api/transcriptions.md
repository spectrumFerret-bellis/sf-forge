---
outline: deep
---

# Transcriptions API

The transcriptions API provides hooks for managing speech-to-text transcription data associated with radio transmissions. This API supports creating, reading, updating, and deleting transcription records.

## Types

### RadioTranscription
```typescript
interface RadioTranscription {
  id: string
  radio_transmission_id: string
  language: string
  transcription: string
  created_at: string
  updated_at: string
}
```

### CreateTranscriptionData
```typescript
interface CreateTranscriptionData {
  radio_transmission_id: string
  language: string
  transcription: string
}
```

### UpdateTranscriptionData
```typescript
interface UpdateTranscriptionData {
  language?: string
  transcription?: string
}
```

## Query Keys

```typescript
export const transcriptionKeys = {
  all: ['radio_transcriptions'] as const,
  lists: () => [...transcriptionKeys.all, 'list'] as const,
  list: (filters: string) => [...transcriptionKeys.lists(), { filters }] as const,
  details: () => [...transcriptionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transcriptionKeys.details(), id] as const,
  byTransmission: (transmissionId: string) => [...transcriptionKeys.all, 'transmission', transmissionId] as const,
}
```

## Hooks

### useTranscription()

Fetches a single transcription by ID.

**Parameters:**
- `id: string` - Transcription ID

**Returns:** `UseQueryResult<{ radio_transcription: RadioTranscription }, Error>`

**Example:**
```typescript
import { useTranscription } from '@/hooks/api'

function TranscriptionDetail({ transcriptionId }: { transcriptionId: string }) {
  const { data, isLoading, error } = useTranscription(transmissionId)
  
  if (isLoading) return <div>Loading transcription...</div>
  if (error) return <div>Error: {error.message}</div>
  
  const transcription = data?.radio_transcription
  
  return (
    <div>
      <h3>Transcription Details</h3>
      <p>Language: {transcription?.language}</p>
      <p>Text: {transcription?.transcription}</p>
      <p>Created: {new Date(transcription?.created_at || '').toLocaleString()}</p>
      <p>Updated: {new Date(transcription?.updated_at || '').toLocaleString()}</p>
    </div>
  )
}
```

### useTranscriptionByTransmission()

Fetches transcription data for a specific radio transmission.

**Parameters:**
- `transmissionId: string` - Radio transmission ID

**Returns:** `UseQueryResult<{ radio_transcription: RadioTranscription }, Error>`

**Example:**
```typescript
import { useTranscriptionByTransmission } from '@/hooks/api'

function TransmissionWithTranscription({ transmissionId }: { transmissionId: string }) {
  const { data, isLoading, error } = useTranscriptionByTransmission(transmissionId)
  
  if (isLoading) return <div>Loading transcription...</div>
  if (error) return <div>Error: {error.message}</div>
  
  const transcription = data?.radio_transcription
  
  return (
    <div>
      <h3>Transmission Transcription</h3>
      {transcription ? (
        <div>
          <p><strong>Language:</strong> {transcription.language}</p>
          <div className="transcription-text">
            <p><strong>Transcription:</strong></p>
            <blockquote>{transcription.transcription}</blockquote>
          </div>
        </div>
      ) : (
        <p>No transcription available for this transmission.</p>
      )}
    </div>
  )
}
```

### useCreateTranscription()

Creates a new transcription record.

**Returns:** `UseMutationResult<{ radio_transcription: RadioTranscription }, Error, CreateTranscriptionData>`

**Example:**
```typescript
import { useCreateTranscription } from '@/hooks/api'

function CreateTranscriptionForm({ transmissionId }: { transmissionId: string }) {
  const createTranscription = useCreateTranscription()
  
  const handleSubmit = (formData: CreateTranscriptionData) => {
    createTranscription.mutate(formData, {
      onSuccess: (data) => {
        console.log('Transcription created:', data.radio_transcription.id)
        // Navigate to transcription detail or update list
      },
      onError: (error) => {
        console.error('Failed to create transcription:', error.message)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="hidden" 
        name="radio_transmission_id" 
        value={transmissionId} 
      />
      <select name="language" required>
        <option value="">Select Language</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
      </select>
      <textarea 
        name="transcription" 
        placeholder="Enter transcription text..."
        required
        rows={5}
      />
      <button type="submit" disabled={createTranscription.isPending}>
        {createTranscription.isPending ? 'Creating...' : 'Create Transcription'}
      </button>
    </form>
  )
}
```

### useUpdateTranscription()

Updates an existing transcription.

**Returns:** `UseMutationResult<{ radio_transcription: RadioTranscription }, Error, { id: string; data: UpdateTranscriptionData }>`

**Example:**
```typescript
import { useUpdateTranscription } from '@/hooks/api'

function UpdateTranscriptionForm({ transcriptionId }: { transcriptionId: string }) {
  const updateTranscription = useUpdateTranscription()
  
  const handleSubmit = (data: UpdateTranscriptionData) => {
    updateTranscription.mutate({ id: transcriptionId, data }, {
      onSuccess: (response) => {
        console.log('Transcription updated:', response.radio_transcription.id)
      },
      onError: (error) => {
        console.error('Failed to update transcription:', error.message)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <select name="language">
        <option value="">Keep Current Language</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
      </select>
      <textarea 
        name="transcription" 
        placeholder="Update transcription text..."
        rows={5}
      />
      <button type="submit" disabled={updateTranscription.isPending}>
        {updateTranscription.isPending ? 'Updating...' : 'Update Transcription'}
      </button>
    </form>
  )
}
```

### useDeleteTranscription()

Deletes a transcription record.

**Returns:** `UseMutationResult<any, Error, string>`

**Example:**
```typescript
import { useDeleteTranscription } from '@/hooks/api'

function DeleteTranscriptionButton({ transcriptionId }: { transcriptionId: string }) {
  const deleteTranscription = useDeleteTranscription()
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this transcription?')) {
      deleteTranscription.mutate(transcriptionId, {
        onSuccess: () => {
          console.log('Transcription deleted successfully')
          // Navigate away or update list
        },
        onError: (error) => {
          console.error('Failed to delete transcription:', error.message)
        }
      })
    }
  }
  
  return (
    <button 
      onClick={handleDelete}
      disabled={deleteTranscription.isPending}
      className="text-red-600"
    >
      {deleteTranscription.isPending ? 'Deleting...' : 'Delete Transcription'}
    </button>
  )
}
```

## Usage Patterns

### Transcription Viewer with Audio
```typescript
import { useTranscriptionByTransmission } from '@/hooks/api'

function TranscriptionViewer({ transmissionId, audioUrl }: {
  transmissionId: string
  audioUrl?: string
}) {
  const { data, isLoading, error } = useTranscriptionByTransmission(transmissionId)
  
  if (isLoading) return <div>Loading transcription...</div>
  if (error) return <div>Error: {error.message}</div>
  
  const transcription = data?.radio_transcription
  
  return (
    <div className="transcription-viewer">
      {audioUrl && (
        <div className="audio-player">
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      
      <div className="transcription-content">
        {transcription ? (
          <div>
            <div className="transcription-header">
              <span className="language-badge">{transcription.language}</span>
              <span className="timestamp">
                {new Date(transcription.created_at).toLocaleString()}
              </span>
            </div>
            <div className="transcription-text">
              {transcription.transcription}
            </div>
          </div>
        ) : (
          <div className="no-transcription">
            <p>No transcription available for this transmission.</p>
            <button>Add Transcription</button>
          </div>
        )}
      </div>
    </div>
  )
}
```

### Transcription Editor
```typescript
import { useTranscription, useUpdateTranscription } from '@/hooks/api'
import { useState } from 'react'

function TranscriptionEditor({ transcriptionId }: { transcriptionId: string }) {
  const { data } = useTranscription(transcriptionId)
  const updateTranscription = useUpdateTranscription()
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState('')
  
  const transcription = data?.radio_transcription
  
  const handleEdit = () => {
    setEditedText(transcription?.transcription || '')
    setIsEditing(true)
  }
  
  const handleSave = () => {
    updateTranscription.mutate({
      id: transcriptionId,
      data: { transcription: editedText }
    }, {
      onSuccess: () => {
        setIsEditing(false)
      }
    })
  }
  
  const handleCancel = () => {
    setIsEditing(false)
    setEditedText('')
  }
  
  if (!transcription) return <div>Loading...</div>
  
  return (
    <div className="transcription-editor">
      <div className="editor-header">
        <h3>Transcription Editor</h3>
        <div className="editor-actions">
          {!isEditing ? (
            <button onClick={handleEdit}>Edit</button>
          ) : (
            <>
              <button onClick={handleSave} disabled={updateTranscription.isPending}>
                {updateTranscription.isPending ? 'Saving...' : 'Save'}
              </button>
              <button onClick={handleCancel}>Cancel</button>
            </>
          )}
        </div>
      </div>
      
      <div className="editor-content">
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={10}
            placeholder="Enter transcription text..."
          />
        ) : (
          <div className="transcription-display">
            {transcription.transcription}
          </div>
        )}
      </div>
    </div>
  )
}
```

### Multi-language Transcription Support
```typescript
import { useTranscriptionByTransmission, useCreateTranscription } from '@/hooks/api'

function MultiLanguageTranscription({ transmissionId }: { transmissionId: string }) {
  const { data: englishTranscription } = useTranscriptionByTransmission(transmissionId)
  const createTranscription = useCreateTranscription()
  
  const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' }
  ]
  
  const handleAddTranslation = (language: string, text: string) => {
    createTranscription.mutate({
      radio_transmission_id: transmissionId,
      language,
      transcription: text
    })
  }
  
  return (
    <div className="multi-language-transcription">
      <h3>Transcriptions</h3>
      
      {supportedLanguages.map(lang => (
        <div key={lang.code} className="language-section">
          <h4>{lang.name}</h4>
          <div className="transcription-content">
            {/* Display existing transcription or add new one */}
            <button onClick={() => handleAddTranslation(lang.code, '')}>
              Add {lang.name} Transcription
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
```

## Language Support

The transcription API supports multiple languages:
- **English (en)**: Default language for most transcriptions
- **Spanish (es)**: Spanish language support
- **French (fr)**: French language support
- **German (de)**: German language support

## Error Handling

The transcriptions API includes comprehensive error handling:
- Graceful handling of missing transcriptions
- Validation of transcription data before submission
- Clear error messages for debugging
- Automatic query invalidation on mutations

## Caching Strategy

Transcriptions use an efficient caching strategy:
- Individual transcription queries are cached until invalidated
- Transmission-specific queries are cached separately
- Mutations automatically invalidate related queries
- Background refetching ensures data freshness

## Integration with Other APIs

The transcriptions API integrates with:
- **Transmissions API**: Provides transcription context for transmission data
- **STT Engines API**: Supplies engine information for transcription processing
- **Audio Components**: Provides text content for audio playback interfaces
- **Search Components**: Enables text-based search across transcriptions
