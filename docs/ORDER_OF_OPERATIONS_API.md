Looking at the sf-echo Timeline component, I can trace the order of operations for playlist selection and API invocation. Let me break down the logic flow:

## **Order of Operations for Playlist Selection & API Population**

### **1. Initial Load (useEffect)**
```typescript
useEffect(() => {
  // TODO: convert to store
  fetchPlaylists().then(setPlaylists);
}, []);
```

**API Call**: `GET /api/v1/radio/playlists`
- **Purpose**: Fetch all available playlists
- **When**: Component mounts (empty dependency array)
- **Result**: Populates `playlists` state with array of `Playlist` objects

### **2. Playlist Selection (User Action)**
```typescript
<PlaylistSelector
  playlists={playlists}
  selected={selectedPlaylist}
  onSelect={(pl: Playlist) =>
    dispatch(populateFromPlaylists({ playlists: [pl] }))
  }
/>
```

**User Action**: Selects a playlist from dropdown
**Redux Action**: `populateFromPlaylists({ playlists: [pl] })`

### **3. Redux Store Population (populateFromPlaylists)**
This action likely triggers multiple API calls in sequence:

#### **3a. Fetch Playlist Details**
**API Call**: `GET /api/v1/radio/playlists/{id}`
- **Purpose**: Get complete playlist details including channel relationships
- **Parameters**: Playlist ID from selection

#### **3b. Fetch Channel Information**
For each channel in the playlist, the system fetches:

**API Call**: `GET /api/v1/radio/trunking_channels/{id}`
- **Purpose**: Get trunking channel details (TG name, number, etc.)
- **Parameters**: Channel ID from playlist's `radio_trunking_receive_channels`

#### **3c. Fetch Transmissions**
**API Call**: `GET /api/v1/radio/transmissions/search`
- **Purpose**: Get transmissions for the selected playlist and time range
- **Parameters**: 
  - `channel_ids[]`: Array of channel IDs from playlist
  - `start_ts`: Start timestamp from time range
  - `end_ts`: End timestamp from time range
  - `sort_direction`: 'asc' or 'desc'

### **4. Component Updates (Redux State Changes)**

#### **4a. Playlist State Update**
```typescript
const selectedPlaylist = useAppSelector(
  (state) => state.radio.currentPlaylists[0],
);
```

#### **4b. Channels State Update**
```typescript
const allChannels = useAppSelector((state) => state.radio.channels);
```

#### **4c. Transmissions State Update**
```typescript
const transmissions = useAppSelector(visibleTransmissionSelector);
```

### **5. Component Re-renders**

#### **5a. ChannelSelector Updates**
```typescript
<ChannelSelector
  allChannels={Object.values(allChannels)}
  onChannelVisibilityChange={toggleChannelVisibility}
  transmissions={transmissions}
  onSelectTransmission={(tx) =>
    handleTransmissionSelect(tx, 'table')
  }
/>
```

#### **5b. Timeline Updates**
```typescript
<TransmissionsTimeline
  ref={timelineRef}
  transmissions={transmissions}
  selectedTransmission={selectedTransmission}
  onSelectTransmission={handleTransmissionSelect}
  onPlayAudio={handlePlayAudio}
  timeRange={timeRange}
/>
```

#### **5c. TransmissionsTable Updates**
```typescript
<TransmissionsTable
  ref={tableRef}
  transmissions={transmissions}
  selectedTransmission={selectedTransmission}
  onSelectTransmission={(tx) =>
    handleTransmissionSelect(tx, 'table')
  }
  onPlayAudio={handlePlayAudio}
  isLoading={isLoading}
  timezone={timeRange.timezone}
  selectedChannelIds={selectedChannelIds}
/>
```

## **Complete API Call Sequence**

1. **Initial Load**: `GET /api/v1/radio/playlists`
2. **Playlist Selection**: `GET /api/v1/radio/playlists/{id}`
3. **Channel Details**: `GET /api/v1/radio/trunking_channels/{id}` (for each channel)
4. **Transmissions**: `GET /api/v1/radio/transmissions/search` (with filters)

## **Key Data Flow**

```
User Selects Playlist
    ↓
Redux Action: populateFromPlaylists
    ↓
API: GET /api/v1/radio/playlists/{id}
    ↓
API: GET /api/v1/radio/trunking_channels/{id} (for each channel)
    ↓
API: GET /api/v1/radio/transmissions/search (with channel_ids & time range)
    ↓
Redux State Updates (playlists, channels, transmissions)
    ↓
Component Re-renders (ChannelSelector, Timeline, TransmissionsTable)
```

## **Additional API Calls (On Demand)**

- **Transmission Details**: `GET /api/v1/radio/transmissions/{id}` (when transmission selected)
- **Transcription**: `GET /api/v1/radio/transcriptions/{id}` (when viewing transcription)
- **Channel Attributes**: `GET /api/v1/radio/trunking_receive_channels/{channelId}/channel_attribute`

This creates a cascading effect where playlist selection triggers multiple API calls to populate all related data before updating the UI components.