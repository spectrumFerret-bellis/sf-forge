# Authentication Guide

This document explains the authentication system implemented in the application.

## Overview

The authentication system is based on the API endpoints available in the Swagger specification:
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token  
- `DELETE /api/v1/auth/logout` - User logout

## Components

### 1. Login Component (`src/pages/Authorization/Login.tsx`)
- Clean login form using shadcn components
- Form validation and error handling
- Password visibility toggle
- Loading states during authentication
- Redirects to the originally requested page after successful login

### 2. AuthGuard Component (`src/components/auth/AuthGuard.tsx`)
- Protects routes that require authentication
- Checks for valid access token on mount
- Automatically attempts token refresh if needed
- Redirects to `/auth/login` if not authenticated
- Preserves the original requested URL for post-login redirect

### 3. Authorization Page (`src/pages/Authorization/index.tsx`)
- Orchestrates authentication components
- Currently only handles login (no signup as per API spec)

## Authentication Flow

### 1. Unauthenticated User Access
1. User tries to access a protected route (e.g., `/`)
2. `AuthGuard` checks for valid access token
3. If no token or invalid token, redirects to `/auth/login`
4. Original URL is preserved in location state

### 2. Login Process
1. User enters credentials on login page
2. Form submits to `/api/v1/auth/login`
3. On success:
   - Access token and refresh token stored in localStorage
   - User redirected to originally requested page
4. On failure:
   - Error message displayed
   - User stays on login page

### 3. Token Refresh
1. `AuthGuard` automatically attempts token refresh if access token is missing
2. Uses refresh token from localStorage
3. Updates tokens on successful refresh
4. Clears tokens and redirects to login on failure

### 4. Logout Process
1. User clicks logout (implemented in navigation)
2. Calls `/api/v1/auth/logout`
3. Clears all tokens from localStorage
4. Clears all query cache
5. Redirects to login page

## Usage Examples

### Protected Route
```tsx
// Any route that requires authentication
<Route path="/dashboard" element={
  <AuthGuard>
    <DashboardComponent />
  </AuthGuard>
} />
```

### Login Form
```tsx
import { useLogin } from '@/hooks/api'

function LoginComponent() {
  const login = useLogin()
  
  const handleSubmit = async (credentials) => {
    try {
      await login.mutateAsync(credentials)
      // Redirect happens automatically
    } catch (error) {
      // Error is displayed in the form
    }
  }
}
```

### Logout
```tsx
import { useLogout } from '@/hooks/api'

function LogoutButton() {
  const logout = useLogout()
  
  const handleLogout = () => {
    logout.mutate()
  }
}
```

## API Integration

The authentication system integrates with the TanStack Query setup:

- **Automatic Token Headers**: All API calls automatically include the Authorization header
- **Token Refresh**: Handled automatically by the API client
- **Cache Management**: Logout clears all cached data
- **Error Handling**: 401 errors trigger automatic logout

## Security Features

1. **Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
2. **Automatic Refresh**: Seamless token refresh without user interaction
3. **Route Protection**: All sensitive routes wrapped with AuthGuard
4. **Error Handling**: Proper error messages without exposing sensitive data
5. **Redirect Preservation**: Users return to their intended destination after login

## Configuration

### Environment Variables
- `SF_API_HOST`: API server host (configured in vite.config.ts)
- API base URL: `/api/v1` (configured in src/lib/api.ts)

### Styling
- Uses shadcn components for consistent UI
- Tailwind CSS for styling
- Dark mode support
- Responsive design

## Future Enhancements

1. **Remember Me**: Add option to extend token lifetime
2. **Multi-factor Authentication**: Support for 2FA if API provides it
3. **Session Management**: Track active sessions
4. **Password Reset**: If API endpoints become available
5. **Account Management**: User profile and settings

## Troubleshooting

### Common Issues

1. **Login Fails**: Check API server connectivity and credentials
2. **Token Refresh Fails**: Clear localStorage and re-login
3. **Redirect Loop**: Check AuthGuard logic and route configuration
4. **CORS Issues**: Verify API server CORS configuration

### Debug Mode
Enable React Query DevTools to monitor authentication queries and cache state.
