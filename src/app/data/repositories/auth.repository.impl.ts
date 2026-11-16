import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { IAuthRepository } from '../../domain/repository-contracts/auth-repository.contract';
import { User } from '../../domain/entities/user.entity';
import { AuthCredentials, OtpData, RegistrationData, UpdatePasswordData } from '../../domain/entities/auth-credentials.entity';
import { AuthApiService } from '../api/auth-api.service';
import { UserMapper } from '../mappers/user.mapper';
import { StorageService } from 'src/app/shared/services';
import { AuthStateService } from 'src/app/shared/services';
import { LoginResponseDto } from '../dto/response/login.response.dto';
import { ChangePasswordRequest } from '../dto/request/change-password.dto';
import { ApiResponse } from 'src/app/domain/entities/api-response.entity';

const USER_PROFILE_KEY = 'currentUser';

/**
 * Auth Repository Implementation
 *
 * Concrete implementation of IAuthRepository.
 * Orchestrates API calls, token persistence (via AuthStateService),
 * and user profile storage (via StorageService).
 */
@Injectable({ providedIn: 'root' })
export class AuthRepositoryImpl implements IAuthRepository {
  private readonly currentUserSubject: BehaviorSubject<User | null>;
  public readonly currentUser$: Observable<User | null>;

  constructor(
    private readonly authApi: AuthApiService,
    private readonly storage: StorageService,
    private readonly authState: AuthStateService
  ) {
    const storedProfile =
      this.storage.getSession<any>(USER_PROFILE_KEY) ??
      this.storage.getLocal<any>(USER_PROFILE_KEY);
    const initialUser = this.hydrateUser(storedProfile);
    this.currentUserSubject = new BehaviorSubject<User | null>(initialUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }
  changePassword(data: ChangePasswordRequest): Observable<ApiResponse> {
    return this.authApi.changePassword(data);
  }

  /** Authenticate with email/password credentials. */
  login(credentials: AuthCredentials, rememberMe: boolean): Observable<User> {
    const requestDto = UserMapper.toLoginRequest(credentials);
    return this.authApi.login(requestDto).pipe(
      map(response => this.processLoginResponse(response, rememberMe)),
    );
  }

  /** Register a new user account. */
  register(data: RegistrationData): Observable<User> {
    const requestDto = UserMapper.toRegisterRequest(data);
    return this.authApi.register(requestDto).pipe(
      map(response => this.processLoginResponse(response, false)),
    );
  }

  /** Refresh authentication tokens using the current access + refresh tokens. */
  refreshToken(): Observable<User> {
    const accessToken = this.authState.accessToken;
    const refreshToken = this.authState.refreshTokenValue;

    if (!accessToken || !refreshToken) {
      return throwError(() => new Error('No tokens available for refresh'));
    }

    const rememberMe = this.authState.isRemembered;

    return this.authApi.refreshToken({ access_token: accessToken, refresh_token: refreshToken }).pipe(
      map(response => this.processLoginResponse(response, rememberMe)),
    );
  }

  /** Log out the current user; clears session even if the API call fails. */
  logout(): Observable<void> {
    this.clearSession();
    return of(undefined);
    // return this.authApi.logout().pipe(
    //   tap(() => this.clearSession()),
    //   catchError(() => {
    //     this.clearSession();
    //     return of(undefined);
    //   })
    // );
  }

  /** Request an OTP code to be sent to the given email. */
  sendOtp(email: string): Observable<string> {
    const requestDto = UserMapper.toSendOtpRequest(email);
    return this.authApi.sendOtp(requestDto).pipe(
      map(response => response.message)
    );
  }

  /** Verify the OTP code submitted by the user. */
  verifyOtp(data: OtpData): Observable<any> {
    const requestDto = UserMapper.toVerifyOtpRequest(data);
    return this.authApi.verifyOtp(requestDto).pipe(
      map(response => response)
    );
  }

  /** Resend a new OTP code to the given email. */
  resendOtp(email: string): Observable<string> {
    const requestDto = UserMapper.toResendOtpRequest(email);
    return this.authApi.resendOtp(requestDto).pipe(
      map(response => response.message)
    );
  }

  /** Update the user's password after OTP verification. */
  updatePassword(data: UpdatePasswordData): Observable<string> {
    const requestDto = UserMapper.toUpdatePasswordRequest(data);
    return this.authApi.updatePassword(requestDto).pipe(
      map(response => response.message)
    );
  }

  /** Trigger a password-reset email for the given address. */
  resetPassword(email: string): Observable<string> {
    return this.authApi.resetPassword(email).pipe(
      map(response => response.message)
    );
  }

  /** Returns the current in-memory user, or null if not authenticated. */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Processes a login/refresh response: saves tokens separately,
   * saves the user profile, and updates the in-memory subject.
   */
  private processLoginResponse(response: LoginResponseDto, rememberMe: boolean): User {
    this.authState.saveTokens({
      access_token: response.access_token,
      refresh_token: response.refresh_token,
      access_token_expires_at: response.access_token_expires_at,
      refresh_token_expires_at: response.refresh_token_expires_at
    }, rememberMe);

    const user = UserMapper.fromLoginResponse(response);
    const profilePayload = UserMapper.toStorageFormat(user);

    if (rememberMe) {
      this.storage.setLocal(USER_PROFILE_KEY, profilePayload);
    } else {
      this.storage.setSession(USER_PROFILE_KEY, profilePayload);
    }

    this.currentUserSubject.next(user);
    return user;
  }

  /** Wipe tokens and reset the in-memory user subject. */
  private clearSession(): void {
    this.authState.clearTokens();
    this.currentUserSubject.next(null);
  }

  /**
   * Reconstructs a User from storage profile + token state.
   * Tokens come from AuthStateService; profile data from storage.
   */
  private hydrateUser(storedProfile: any): User | null {
    const profile = UserMapper.fromStorageFormat(storedProfile);
    if (!profile || !this.authState.accessToken) return null;

    return profile.copyWith({
      token: this.authState.accessToken,
      refreshToken: this.authState.refreshTokenValue ?? undefined,
    });
  }

    setPassword(payload: { new_password: string ,comfirm_password: string,email: string}): Observable<void> {
    return this.authApi.setPassword(payload);
  }

}
