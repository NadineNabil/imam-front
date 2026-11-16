import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { AuthCredentials, OtpData, RegistrationData, UpdatePasswordData } from '../entities/auth-credentials.entity';
import { ChangePasswordRequest } from 'src/app/data/dto/request/change-password.dto';
import { ApiResponse } from '../entities/api-response.entity';

/**
 * Auth Repository Interface (Port)
 * 
 * This is the abstraction that the use-cases depend on.
 * The actual implementation lives in the data layer.
 * This follows the Dependency Inversion Principle - high-level modules
 * (use-cases) don't depend on low-level modules (HTTP services).
 */
export interface IAuthRepository {
  /**
   * Authenticate user with credentials
   * @param credentials - User login credentials
   * @param rememberMe - Whether to persist session across browser restarts
   * @returns Observable of authenticated User or throws error
   */
  login(credentials: AuthCredentials, rememberMe: boolean): Observable<User>;

  /**
   * Register a new user
   * @param data - Registration data
   * @returns Observable of created User
   */
  register(data: RegistrationData): Observable<User>;

  /**
   * Send OTP to user's email
   * @param email - User email address
   * @returns Observable with send OTP confirmation message
   */
  sendOtp(email: string): Observable<string>;

  /**
   * Verify OTP code
   * @param email - User email address
   * @param otp - OTP code
   * @returns Observable with verify OTP confirmation message
   */
  verifyOtp(data: OtpData): Observable<any>;

  /**
   * Resend OTP to user's email
   * @param email - User email address
   * @returns Observable with resend OTP confirmation message
   */
  resendOtp(email: string): Observable<string>;

  /**
   * Update user password
   * @param email - User email address
   * @param newPassword - New password
   * @param confirmPassword - Confirm password
   * @returns Observable with update password confirmation message
   */
  updatePassword(data: UpdatePasswordData): Observable<string>;

  /**
   * Refresh authentication tokens using the current refresh token
   * @returns Observable of refreshed User
   */
  refreshToken(): Observable<User>;

  /**
   * Logout the current user
   * @returns Observable that completes when logout is done
   */
  logout(): Observable<void>;

  /**
   * Request password reset for email
   * @param email - User email address
   * @returns Observable with reset confirmation message
   */
  resetPassword(email: string): Observable<string>;

  /**
   * Get the currently authenticated user (if any)
   * @returns The current user or null
   */
  getCurrentUser(): User | null;


  setPassword?(payload: { new_password: string ,comfirm_password: string,email: string}): Observable<void>;


  /**
   * Observable stream of authentication state changes
   */
  readonly currentUser$: Observable<User | null>;
  
  changePassword(data: ChangePasswordRequest): Observable<ApiResponse>;
}

/**
 * Injection token for Auth Repository
 * Used for Angular dependency injection since interfaces don't exist at runtime
 */
export const AUTH_REPOSITORY_TOKEN = new InjectionToken<IAuthRepository>('IAuthRepository');

