# Fake Authentication Implementation

This document describes the fake authentication implementation for development and testing.

## Overview

The fake authentication repository (`AuthRepositoryFake`) provides a mock authentication system that doesn't require a backend server. This is useful for:
- Frontend development without a running backend
- Testing authentication flows
- Demo purposes

## How to Enable/Disable

The fake authentication is controlled by the `fakeapi` flag in the environment configuration:

### Development (src/environments/environment.ts)
```typescript
export const environment = {
  fakeapi: true,  // Set to true to use fake auth
  // ...
};
```

### Production (src/environments/environment.prod.ts)
```typescript
export const environment = {
  fakeapi: false,  // Always false in production
  // ...
};
```

## Implementation Details

The fake repository is automatically selected in `data.module.ts`:
```typescript
{ 
  provide: AUTH_REPOSITORY_TOKEN, 
  useClass: environment.fakeapi ? AuthRepositoryFake : AuthRepositoryImpl 
}
```

## Mock Users

The fake authentication includes pre-configured test users:

### Admin User
- **Email**: `admin@test.com`
- **Password**: `password123`
- **Username**: `admin`
- **Name**: Admin User
- **Token**: `fake-jwt-token-admin-12345`

### Regular User
- **Email**: `user@test.com`
- **Password**: `password123`
- **Username**: `testuser`
- **Name**: Test User
- **Token**: `fake-jwt-token-user-67890`

## Token Expiration

The fake repository generates tokens with configurable expiration times, matching the real backend behavior. Token lifetimes are controlled by `TOKEN_CONFIG` in `auth.repository.fake.ts`:

```typescript
const TOKEN_CONFIG = {
  accessTokenLifetimeSec: 15 * 60,        // 15 minutes (default)
  refreshTokenLifetimeSec: 7 * 24 * 60 * 60, // 7 days (default)
};
```

To test session expiry, change `accessTokenLifetimeSec` to a short value (e.g., `10` for 10 seconds). The interceptor's expiration checks (`isAccessTokenExpired`, `isRefreshTokenExpired`) will trigger naturally — no need to manually edit session storage.

## Features

### Login
- Validates credentials against mock users
- Simulates 500ms network delay
- Returns appropriate error messages for invalid credentials
- Saves tokens with expiration via `AuthStateService` (same as real backend)
- Saves user profile via `StorageService`

### Registration
- Creates new users dynamically
- Checks for duplicate email addresses
- Simulates 800ms network delay
- Auto-generates user ID and JWT token with expiration
- Saves tokens and profile the same way as login

### Token Refresh
- Generates new access and refresh tokens with fresh expiration times
- Preserves the `rememberMe` preference from the original session

### Logout
- Clears tokens via `AuthStateService.clearTokens()`
- Clears current user from state
- Simulates 300ms network delay

### Password Reset
- Validates email exists in mock database
- Simulates 600ms network delay
- Returns success message

## Testing

To test the authentication flow:

1. Set `fakeapi: true` in `environment.ts`
2. Use one of the pre-configured users to login
3. Or register a new user with any email/password
4. Tokens are automatically managed — check `auth_tokens` key in session/local storage for expiration times

### Testing Session Expiry
1. Set `accessTokenLifetimeSec` to a small value (e.g., `10`) in `TOKEN_CONFIG`
2. Login normally
3. Wait for the token to expire — the interceptor will attempt a refresh automatically
4. To also test refresh token expiry, lower `refreshTokenLifetimeSec` as well

## Switching to Real Backend

To use the real backend API:

1. Set `fakeapi: false` in `environment.ts`
2. Ensure your backend is running at the configured `apiUrl`
3. The app will automatically use `AuthRepositoryImpl` instead

No other code changes are required - the dependency injection handles the switch automatically.

