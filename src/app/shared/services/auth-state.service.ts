import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

/**
 * Shape of the token payload stored in localStorage/sessionStorage.
 */
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  access_token_expires_at: string;
  refresh_token_expires_at: string;
}

const TOKEN_KEY = 'auth_tokens';
const USER_PROFILE_KEY = 'currentUser';

/**
 * Auth State Service
 *
 * Single source of truth for authentication state.
 * Manages tokens in a separate storage key from user profile data.
 * Used by interceptors, guards, and the repository layer.
 */
@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private tokensCache: AuthTokens | null = null;
  private readonly authenticatedSubject: BehaviorSubject<boolean>;

  constructor(private readonly storage: StorageService) {
    this.tokensCache = this.loadTokens();
    this.authenticatedSubject = new BehaviorSubject<boolean>(!!this.tokensCache?.access_token);
  }

  /** Synchronous check — true when an access token exists in the cache. */
  get isAuthenticated(): boolean {
    return !!this.tokensCache?.access_token;
  }

  /** Observable stream of the current authentication status. */
  get isAuthenticated$(): Observable<boolean> {
    return this.authenticatedSubject.asObservable();
  }

  /** Returns the current access token, or null if not authenticated. */
  get accessToken(): string | null {
    return this.tokensCache?.access_token ?? null;
  }

  /** Returns the current refresh token, or null if not available. */
  get refreshTokenValue(): string | null {
    return this.tokensCache?.refresh_token ?? null;
  }

  /**
   * Whether the access token has expired (or will expire within a 30-second buffer).
   * Used by the interceptor to decide when to trigger a proactive refresh.
   */
  get isAccessTokenExpired(): boolean {
    if (!this.tokensCache?.access_token_expires_at) return true;
    const bufferMs = 30_000;
    return Date.now() >= new Date(this.tokensCache.access_token_expires_at).getTime() - bufferMs;
  }

  /** Whether the refresh token itself has expired (no buffer). */
  get isRefreshTokenExpired(): boolean {
    if (!this.tokensCache?.refresh_token_expires_at) return true;
    return Date.now() >= new Date(this.tokensCache.refresh_token_expires_at).getTime();
  }

  /**
   * Persist tokens in memory and in storage.
   * @param tokens  The new token set received from the API.
   * @param rememberMe  When true, tokens go to localStorage; otherwise sessionStorage.
   */
  saveTokens(tokens: AuthTokens, rememberMe: boolean): void {
    this.tokensCache = tokens;
    if (rememberMe) {
      this.storage.setLocal(TOKEN_KEY, tokens);
    } else {
      this.storage.setSession(TOKEN_KEY, tokens);
    }
    this.authenticatedSubject.next(true);
  }

  /** Remove all tokens from memory and storage, resetting auth state. */
  clearTokens(): void {
    console.log('clearTokens');
    this.tokensCache = null;
    this.storage.remove(TOKEN_KEY);
    this.storage.remove(USER_PROFILE_KEY);
    this.authenticatedSubject.next(false);
  }

  /**
   * Checks whether the current session used "remember me" (localStorage).
   * Falls back to false (sessionStorage) if no tokens found in localStorage.
   */
  get isRemembered(): boolean {
    return this.storage.getLocal<AuthTokens>(TOKEN_KEY) !== null;
  }

 

  /** Loads tokens from sessionStorage first, falling back to localStorage. */
  private loadTokens(): AuthTokens | null {
    return this.storage.getSession<AuthTokens>(TOKEN_KEY)
      ?? this.storage.getLocal<AuthTokens>(TOKEN_KEY);
  }
}
