# API Proxy Setup Guide

This document explains how the API proxy is configured in the Vite development server.

## Configuration

### Vite Config (`vite.config.ts`)

```typescript
proxy: {
  '/api/v1': {
    target: env.SF_API_HOST
      ? `http://${env.SF_API_HOST}`
      : 'http://panic.taile5ef8e.ts.net',
    changeOrigin: true,
  },
}
```

### API Client (`src/lib/api.ts`)

```typescript
const API_BASE = '/api/v1'
```

## How It Works

1. **Frontend Request**: Your React app makes requests to `/api/v1/auth/login`
2. **Vite Proxy**: Vite intercepts requests to `/api/v1/*` and forwards them to the target server
3. **Target Server**: Requests are sent to `http://panic.taile5ef8e.ts.net/api/v1/auth/login`
4. **Response**: The response is proxied back to your React app

## Environment Variables

- `SF_API_HOST`: Override the default API server (optional)
- Default: `panic.taile5ef8e.ts.net`

## Testing the Setup

### 1. Check Proxy Configuration

```bash
# Start the dev server
pnpm dev

# The server should start on http://localhost:5174
# API requests to /api/v1/* will be proxied to panic.taile5ef8e.ts.net
```

### 2. Test API Endpoints

```bash
# Test the proxy directly
curl http://localhost:5174/api/v1/radio/playlists

# This should return the same response as
curl http://panic.taile5ef8e.ts.net/api/v1/radio/playlists
```

### 3. Check Network Tab

1. Open browser dev tools
2. Go to Network tab
3. Try to login or make an API call
4. You should see requests to `localhost:5174/api/v1/*`
5. These are automatically proxied to the remote server

## Troubleshooting

### Issue: Requests going to localhost instead of remote server

**Solution**: Check that the proxy configuration matches your API_BASE:

```typescript
// vite.config.ts
proxy: {
  '/api/v1': {  // Must match API_BASE
    target: 'http://panic.taile5ef8e.ts.net',
    changeOrigin: true,
  },
}

// src/lib/api.ts
const API_BASE = '/api/v1'  // Must match proxy path
```

### Issue: CORS errors

**Solution**: The proxy handles CORS automatically. If you're still getting CORS errors:

1. Make sure you're using the proxy (requests to `/api/v1/*`)
2. Don't make direct requests to the remote server from the browser
3. Check that `changeOrigin: true` is set in the proxy config

### Issue: 404 errors

**Solution**: Verify the API endpoints exist:

```bash
# Test the remote server directly
curl http://panic.taile5ef8e.ts.net/api/v1/radio/playlists

# If this fails, the API server might be down or the endpoint doesn't exist
```

## Production Setup

In production, you'll need to:

1. **Remove the proxy**: The proxy is only for development
2. **Configure CORS**: The API server needs to allow requests from your domain
3. **Use environment variables**: Set the API base URL based on environment

```typescript
// Production API client
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.yourdomain.com/api/v1'
```

## Available Endpoints

Based on the Swagger specification:

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token
- `DELETE /api/v1/auth/logout` - User logout

### Radio Data
- `GET /api/v1/radio/playlists` - List playlists
- `GET /api/v1/radio/transmissions/search` - Search transmissions
- `GET /api/v1/radio/trunking_channels` - List trunking channels
- And many more...

## Example Usage

```typescript
// This request:
api.post('/auth/login', credentials)

// Becomes:
fetch('http://localhost:5174/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials)
})

// Which is proxied to:
fetch('http://panic.taile5ef8e.ts.net/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials)
})
```
