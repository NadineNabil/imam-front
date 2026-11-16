# API Configuration Guide

This document explains how to use the centralized API configuration system.

## Overview

All API endpoints are now centralized in `api.config.ts`. This provides:
- **Single source of truth** for all API URLs
- **Easy maintenance** - change URLs in one place
- **Type safety** - TypeScript autocomplete for endpoints
- **Consistency** across all API services

## Structure

### ApiConfig Service

Located at: `src/app/data/config/api.config.ts`

**Properties:**
- `baseUrl` - Base URL from environment (e.g., `http://localhost:8000/api/v1`)
- `timeout` - API timeout in milliseconds
- `endpoints` - Object containing all API endpoint paths

**Methods:**
- `getUrl(endpoint: string)` - Combines base URL with endpoint path

## Current Endpoints

### Authentication Endpoints

```typescript
endpoints.auth = {
  login: '/auth/login',               // POST - User login
  register: '/auth/register',         // POST - User registration
  logout: '/auth/logout',             // POST - User logout
  passwordReset: '/auth/password-reset', // POST - Request password reset
  me: '/auth/me'                      // GET - Get current user
}
```

### User Endpoints

```typescript
endpoints.users = {
  base: '/users',                     // GET - List all users
  byId: (id: number) => `/users/${id}` // GET/PATCH/DELETE - User by ID
}
```

## Usage in API Services

### Example: Auth API Service

```typescript
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfig
  ) {}

  login(payload: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.auth.login),
      payload
    );
  }
}
```

## Adding New Endpoints

### Step 1: Add to api.config.ts

Add your new endpoint to the `endpoints` object:

```typescript
readonly endpoints = {
  auth: { ... },
  users: { ... },
  
  // Add new module endpoints
  courses: {
    base: '/courses',
    byId: (id: number) => `/courses/${id}`,
    enroll: (id: number) => `/courses/${id}/enroll`,
    lessons: (courseId: number) => `/courses/${courseId}/lessons`
  }
};
```

### Step 2: Create API Service

Create a new API service that uses the config:

```typescript
@Injectable({ providedIn: 'root' })
export class CourseApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfig
  ) {}

  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.courses.base)
    );
  }

  getById(id: number): Observable<Course> {
    return this.http.get<Course>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.courses.byId(id))
    );
  }
}
```

## Dynamic Endpoints

For endpoints with parameters, use functions:

```typescript
// In api.config.ts
endpoints = {
  posts: {
    base: '/posts',
    byId: (id: number) => `/posts/${id}`,
    comments: (postId: number) => `/posts/${postId}/comments`,
    commentById: (postId: number, commentId: number) => 
      `/posts/${postId}/comments/${commentId}`
  }
}

// In API service
getPostComments(postId: number): Observable<Comment[]> {
  return this.http.get<Comment[]>(
    this.apiConfig.getUrl(this.apiConfig.endpoints.posts.comments(postId))
  );
}
```

## Query Parameters

Query parameters should still be handled in the service:

```typescript
searchCourses(query: string, page: number): Observable<Course[]> {
  const params = new HttpParams()
    .set('q', query)
    .set('page', page.toString());
    
  return this.http.get<Course[]>(
    this.apiConfig.getUrl(this.apiConfig.endpoints.courses.base),
    { params }
  );
}
```

## Benefits

1. **Maintainability** - Change endpoint paths in one place
2. **Refactoring** - Rename endpoints easily with IDE refactoring tools
3. **Documentation** - All endpoints visible in one file
4. **Testing** - Mock ApiConfig easily in tests
5. **Consistency** - Everyone uses the same URL structure

## Migration Checklist

When adding a new API service:
- [ ] Add endpoints to `api.config.ts`
- [ ] Inject `ApiConfig` in service constructor
- [ ] Use `apiConfig.getUrl(apiConfig.endpoints.xxx)` for all HTTP calls
- [ ] Add JSDoc comments describing the endpoint
- [ ] Update this documentation if needed

## Related Files

- `src/app/data/config/api.config.ts` - Main configuration
- `src/app/data/api/auth-api.service.ts` - Example usage (auth)
- `src/app/data/api/user-api.service.ts` - Example usage (users)
- `src/environments/environment.ts` - Base URL configuration








