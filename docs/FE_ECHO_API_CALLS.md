I'll review the codebase to identify all REST API calls and their HTTP methods. Let me start by examining the API-related files and then search for API calls throughout the codebase.

Read file: src/utils/api-client.ts
Read file: src/utils/api.ts
Ran tool
Ran tool
Read file: src/store/authSlice.ts
Read file: src/store/radioSlice.ts
Ran tool
Ran tool
Read file: src/store/radioSlice.ts
Read file: src/store/radioSlice.ts
Based on my comprehensive review of the codebase, here are all the REST API calls made in the application, organized by HTTP method:

## **GET Requests**

### Authentication
- `GET /api/v1/auth/refresh` - Token refresh (in `api-client.ts` interceptor)

### Radio Playlists
- `GET /api/v1/radio/playlists` - Fetch all available playlists
- `GET /api/v1/radio/playlists/{id}` - Fetch specific playlist by ID

### Radio Channels
- `GET /api/v1/radio/trunking_channels/{id}` - Fetch trunking channel details by ID
- `GET /api/v1/radio/conventional_channels/{id}` - Fetch conventional channel details by ID

### Radio Transmissions
- `GET /api/v1/radio/transmissions/search` - Search transmissions with filters (used in multiple places with different parameters)
- `GET /api/v1/radio/transmissions/{id}` - Fetch specific transmission by ID

## **POST Requests**

### Authentication
- `POST /api/v1/auth/login` - User login with email and password
- `POST /api/v1/auth/refresh` - Token refresh (in `api-client.ts` interceptor)

### Channel Attributes
- `POST /api/v1/radio/trunking_receive_channels/{channelId}/channel_attribute` - Create new channel attributes (first-time configuration)

## **PATCH Requests**

### Channel Attributes
- `PATCH /api/v1/radio/trunking_receive_channels/{channelId}/channel_attribute` - Update existing channel attributes

## **DELETE Requests**

### Authentication
- `DELETE /api/v1/auth/logout` - User logout

## **Summary by Endpoint**

1. **Authentication Endpoints:**
   - `POST /api/v1/auth/login` - Login
   - `POST /api/v1/auth/refresh` - Refresh token
   - `DELETE /api/v1/auth/logout` - Logout

2. **Radio Playlist Endpoints:**
   - `GET /api/v1/radio/playlists` - List all playlists
   - `GET /api/v1/radio/playlists/{id}` - Get specific playlist

3. **Radio Channel Endpoints:**
   - `GET /api/v1/radio/trunking_channels/{id}` - Get trunking channel
   - `GET /api/v1/radio/conventional_channels/{id}` - Get conventional channel
   - `POST /api/v1/radio/trunking_receive_channels/{channelId}/channel_attribute` - Create channel attributes
   - `PATCH /api/v1/radio/trunking_receive_channels/{channelId}/channel_attribute` - Update channel attributes

4. **Radio Transmission Endpoints:**
   - `GET /api/v1/radio/transmissions/search` - Search transmissions (most frequently used)
   - `GET /api/v1/radio/transmissions/{id}` - Get specific transmission

The application uses a centralized axios client (`api-client.ts`) with interceptors for authentication and automatic token refresh. Most API calls are made through this client, with the exception of the token refresh call which uses a direct axios instance to avoid interceptor loops.