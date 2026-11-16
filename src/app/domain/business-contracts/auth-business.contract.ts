import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { ChangePasswordRequest } from 'src/app/data/dto/request/change-password.dto';
import { ApiResponse } from '../entities/api-response.entity';

/**
 * Auth Business Contract
 * 
 * Interface used by presentation layer to interact with auth business logic.
 * This abstracts the use cases from the presentation layer.
 */
export interface IAuthBusiness {
  /**
   * Authenticate user with email and password
   */
  login(email: string, password: string, rememberMe: boolean): Observable<User>;

  /**
   * Register a new user
   */
  register(
    email: string,
    password: string,
    fullname?: string,

  ): Observable<User>;

  /**
   * Send OTP to user's email
   */
  sendOtp(email: string): Observable<string>;

  /**
   * Verify OTP code
   */
  verifyOtp(email: string, otp: string): Observable<any>;

  /**
   * Resend OTP to user's email
   */
  resendOtp(email: string): Observable<string>;

  /**
   * Update user password
   */
  updatePassword(email: string, newPassword: string, confirmPassword: string, token: string): Observable<string>;  
  /**
   * Logout the current user
   */
  logout(): Observable<void>;

  /**
   * Get the currently authenticated user
   */
  getCurrentUser(): User | null;

  /**
   * Observable stream of current user changes
   */
  getCurrentUser$(): Observable<User | null>;

  setPassword?(payload: { new_password: string ,comfirm_password: string,email: string}): Observable<void>;
    changePassword(data: ChangePasswordRequest): Observable<ApiResponse>;


}

export const AUTH_BUSINESS_TOKEN = new InjectionToken<IAuthBusiness>('IAuthBusiness');

