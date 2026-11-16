import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { delay, tap, switchMap } from 'rxjs/operators';
import { IAuthRepository } from '../../domain/repository-contracts/auth-repository.contract';
import { User } from '../../domain/entities/user.entity';
import { AuthCredentials, OtpData, RegistrationData, UpdatePasswordData } from '../../domain/entities/auth-credentials.entity';
import { StorageService } from 'src/app/shared/services';
import { AuthStateService } from 'src/app/shared/services';
import { UserStatus } from 'src/app/domain/enums/user-status.enum';
import { ChangePasswordRequest } from '../dto/request/change-password.dto';
import { ApiResponse } from 'src/app/domain/entities/api-response.entity';

const USER_PROFILE_KEY = 'currentUser';

/**
 * Configurable token lifetimes (in seconds).
 * Adjust these to simulate different backend configurations.
 */
const TOKEN_CONFIG = {
  accessTokenLifetimeSec: 15 * 60,
  refreshTokenLifetimeSec: 7 * 24 * 60 * 60,
};

@Injectable({ providedIn: 'root' })
export class AuthRepositoryFake implements IAuthRepository {
  private readonly currentUserSubject: BehaviorSubject<User | null>;
  public readonly currentUser$: Observable<User | null>;

  private mockUsers: Map<string, { password: string; user: User }> = new Map([
    ['admin@themesbrand.com', {
      password: '123456',
      user: new User(1, 'admin@test.com', 'admin', 'Admin', 'User',
        'fake-jwt-token-admin-12345', 'fake-refresh-token', undefined, undefined, ['admin'], 1, UserStatus.Active)
    }],
    ['user@test.com', {
      password: 'password123',
      user: new User(2, 'user@test.com', 'testuser', 'Test', 'User',
        'fake-jwt-token-user-67890', 'fake-refresh-token', undefined, undefined, ['user'], 1, UserStatus.Pending)
    }]
  ]);

  constructor(
    private readonly storage: StorageService,
    private readonly authState: AuthStateService
  ) {
    const storedProfile =
      this.storage.getSession<any>(USER_PROFILE_KEY) ??
      this.storage.getLocal<any>(USER_PROFILE_KEY);
    const initialUser = storedProfile ? this.parseStoredUser(storedProfile) : null;
    this.currentUserSubject = new BehaviorSubject<User | null>(initialUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }
  setPassword?(payload: { new_password: string; comfirm_password: string; email: string; }): Observable<void> {
    throw new Error('Method not implemented.');
  }
  changePassword(data: ChangePasswordRequest): Observable<ApiResponse> {
    throw new Error('Method not implemented.');
  }

  login(credentials: AuthCredentials): Observable<User> {
    return of(null).pipe(
      delay(500),
      switchMap(() => {
        const mockUser = this.mockUsers.get(credentials.email);
        if (!mockUser) {
          return throwError(() => ({ error: { detail: 'User not found' }, status: 404 }));
        }
        if (mockUser.password !== credentials.password) {
          return throwError(() => ({ error: { detail: 'Invalid credentials' }, status: 401 }));
        }
        this.persistSession(mockUser.user, false);
        return of(mockUser.user);
      })
    );
  }

  register(data: RegistrationData): Observable<User> {
    return of(null).pipe(
      delay(800),
      switchMap(() => {
        if (this.mockUsers.has(data.email)) {
          return throwError(() => ({ error: { detail: 'User with this email already exists' }, status: 400 }));
        }
        const newUser = new User(
          Math.floor(Math.random() * 10000) + 100,
          data.email,
          data.fullname || data.email.split('@')[0],
          data.fullname, data.fullname,
          `fake-jwt-token-${Date.now()}`, `fake-refresh-token-${Date.now()}`,
          undefined, undefined, ['user'], 1, UserStatus.Pending
        );
        this.mockUsers.set(data.email, { password: data.password, user: newUser });
        this.persistSession(newUser, false);
        return of(newUser);
      })
    );
  }

  refreshToken(): Observable<User> {
    const current = this.currentUserSubject.value;
    if (!current) {
      return throwError(() => new Error('No user to refresh'));
    }
    const refreshed = current.copyWith({
      token: `fake-jwt-token-refreshed-${Date.now()}`,
      refreshToken: `fake-refresh-token-refreshed-${Date.now()}`,
    });
    const rememberMe = this.authState.isRemembered;
    this.persistSession(refreshed, rememberMe);
    return of(refreshed).pipe(delay(300));
  }

  sendOtp(email: string): Observable<string> { return of('OTP sent successfully'); }
  verifyOtp(data: OtpData): Observable<string> { return of('OTP verified successfully'); }
  resendOtp(email: string): Observable<string> { return of('OTP resent successfully'); }
  updatePassword(data: UpdatePasswordData): Observable<string> { return of('Password updated successfully'); }

  logout(): Observable<void> {
    return of(undefined).pipe(
      delay(300),
      tap(() => this.clearSession())
    );
  }

  resetPassword(email: string): Observable<string> {
    return of(null).pipe(
      delay(600),
      switchMap(() => {
        if (!this.mockUsers.has(email)) {
          return throwError(() => ({ error: { detail: 'Email not found' }, status: 404 }));
        }
        return of(`Password reset instructions sent to ${email}`);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Mirrors AuthRepositoryImpl.processLoginResponse:
   * saves tokens (with computed expiration) via AuthStateService,
   * saves user profile via StorageService.
   */
  private persistSession(user: User, rememberMe: boolean): void {
    const now = Date.now();
    this.authState.saveTokens({
      access_token: user.token ?? `fake-access-${now}`,
      refresh_token: user.refreshToken ?? `fake-refresh-${now}`,
      access_token_expires_at: new Date(now + TOKEN_CONFIG.accessTokenLifetimeSec * 1000).toISOString(),
      refresh_token_expires_at: new Date(now + TOKEN_CONFIG.refreshTokenLifetimeSec * 1000).toISOString(),
    }, rememberMe);

    const profilePayload = {
      id: user.id, email: user.email, username: user.username,
      firstName: user.firstName, lastName: user.lastName,
      roles: user.roles, organizationId: user.organizationId
    };
    if (rememberMe) {
      this.storage.setLocal(USER_PROFILE_KEY, profilePayload);
    } else {
      this.storage.setSession(USER_PROFILE_KEY, profilePayload);
    }
    this.currentUserSubject.next(user);
  }

  private clearSession(): void {
    this.authState.clearTokens();
    this.currentUserSubject.next(null);
  }

  private parseStoredUser(data: any): User | null {
    if (!data || !data.email) return null;
    return new User(
      data.id, data.email, data.username, data.firstName, data.lastName,
      this.authState.accessToken ?? undefined,
      this.authState.refreshTokenValue ?? undefined,
      undefined, undefined, data.roles ?? [], data.organizationId, (data as any).status ?? undefined
    );
  }
}
