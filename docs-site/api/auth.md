---
outline: deep
---

# Authentication API

The authentication API provides hooks for user login, logout, and token management using JWT tokens.

## Types

### LoginCredentials
```typescript
interface LoginCredentials {
  email_address: string
  password: string
}
```

### LoginResponse
```typescript
interface LoginResponse {
  status: string
  message: string | null
  data: {
    tokens: {
      access_token: string
      refresh_token: string
    }
    user: {
      id: string
      email_address: string
    }
    expires_at: {
      access_token: {
        iso8601: string
        unix: string
      }
      refresh_token: {
        iso8601: string
        unix: string
      }
    }
  }
}
```

### RefreshTokenResponse
```typescript
interface RefreshTokenResponse {
  status: string
  message: string | null
  data: {
    tokens: {
      access_token: string
      refresh_token: string
    }
  }
}
```

## Query Keys

```typescript
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  session: () => [...authKeys.all, 'session'] as const,
}
```

## Hooks

### useLogin()

Handles user authentication with email and password.

**Returns:** `UseMutationResult<LoginResponse, Error, LoginCredentials>`

**Example:**
```typescript
import { useLogin } from '@/hooks/api'

function LoginForm() {
  const login = useLogin()
  
  const handleSubmit = (credentials: LoginCredentials) => {
    login.mutate(credentials, {
      onSuccess: (data) => {
        console.log('Login successful:', data.data.user)
        // Redirect or update UI
      },
      onError: (error) => {
        console.error('Login failed:', error.message)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email_address" required />
      <input type="password" name="password" required />
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

**Behavior:**
- Automatically stores access and refresh tokens in localStorage
- Invalidates user and session queries on successful login
- Handles token expiration and refresh automatically

### useLogout()

Handles user logout and session cleanup.

**Returns:** `UseMutationResult<any, Error, void>`

**Example:**
```typescript
import { useLogout } from '@/hooks/api'

function LogoutButton() {
  const logout = useLogout()
  
  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        console.log('Logout successful')
        // Redirect to login page
      },
      onError: (error) => {
        console.error('Logout failed:', error.message)
      }
    })
  }
  
  return (
    <button onClick={handleLogout} disabled={logout.isPending}>
      {logout.isPending ? 'Logging out...' : 'Logout'}
    </button>
  )
}
```

**Behavior:**
- Clears access and refresh tokens from localStorage
- Clears all cached queries from the query client
- Ensures complete session cleanup

### useRefreshToken()

Refreshes the access token using the stored refresh token.

**Returns:** `UseMutationResult<RefreshTokenResponse, Error, void>`

**Example:**
```typescript
import { useRefreshToken } from '@/hooks/api'

function TokenRefresh() {
  const refreshToken = useRefreshToken()
  
  const handleRefresh = () => {
    refreshToken.mutate(undefined, {
      onSuccess: (data) => {
        console.log('Token refreshed successfully')
      },
      onError: (error) => {
        console.error('Token refresh failed:', error.message)
        // Redirect to login if refresh token is invalid
      }
    })
  }
  
  return (
    <button onClick={handleRefresh} disabled={refreshToken.isPending}>
      {refreshToken.isPending ? 'Refreshing...' : 'Refresh Token'}
    </button>
  )
}
```

**Behavior:**
- Automatically retrieves refresh token from localStorage
- Updates both access and refresh tokens on success
- Invalidates user queries to refetch with new token
- Throws error if no refresh token is available

## Token Management

### Automatic Token Handling

The API client automatically:
- Injects the access token in the `Authorization` header for all requests
- Handles 401 responses by attempting token refresh
- Stores tokens securely in localStorage
- Manages token expiration and renewal

### Token Storage

Tokens are stored in localStorage with the following keys:
- `access_token` - JWT access token for API authentication
- `refresh_token` - JWT refresh token for token renewal

### Security Considerations

- Tokens are stored in localStorage (consider using httpOnly cookies for production)
- Access tokens have a limited lifespan and are automatically refreshed
- Refresh tokens are used to obtain new access tokens without re-authentication
- Failed refresh attempts result in automatic logout

## Error Handling

Authentication errors are handled consistently:
- Network errors are caught and formatted
- HTTP 401 responses trigger automatic token refresh
- Invalid refresh tokens result in logout and redirect to login
- All errors include descriptive messages for user feedback

## Integration with React Query

The authentication hooks integrate seamlessly with React Query:
- Automatic query invalidation on login/logout
- Cache clearing on logout
- Optimistic updates for better UX
- Background refetching with new tokens
