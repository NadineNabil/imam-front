import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequestDto, RegisterRequestDto, RefreshTokenRequestDto, SendOtpRequestDto, VerifyOtpRequestDto, ResendOtpRequestDto, UpdatePasswordRequestDto } from '../dto/request';
import { LoginResponseDto } from '../dto/response';
import { ApiConfig } from '../config/api.config';
import { ChangePasswordRequest } from '../dto/request/change-password.dto';
import { ApiResponse } from 'src/app/domain/entities/api-response.entity';

/**
 * Auth API Service
 * 
 * Raw HTTP calls to the authentication endpoints.
 * This service only handles HTTP communication - no business logic.
 */
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfig
  ) {}

  /**
   * POST /auth/login
   */
  login(payload: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.auth.login),
      payload
    );
  }

  /**
   * POST /auth/register
   */
  register(payload: RegisterRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.auth.register),
      payload
    );
  }

  /**
   * POST /auth/refresh
   */
  refreshToken(payload: RefreshTokenRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.auth.refreshToken),
      payload
    );
  }

  /**
   * POST /auth/logout
   */
  logout(): Observable<void> {
    return this.http.post<void>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.auth.logout),
      {}
    );
  }

  /**
   * POST /auth/send-otp
   * Send OTP to user's email
   */
  sendOtp(payload: SendOtpRequestDto): Observable<{ message: string }> {
    console.log('sendOtp');
    return this.http.post<{ message: string }>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.auth.sendOtp),
      payload
    );
  }

  /**
   * POST /auth/verify-otp
   * Verify OTP code
   */
  verifyOtp(payload: VerifyOtpRequestDto): Observable<{ message: string; token?: string }> {
    return this.http.post<{ message: string; token?: string }>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.auth.verifyOtp),
      payload
    );
  }

  /**
   * POST /auth/resend-otp
   * Resend OTP to user's email
   */
  resendOtp(payload: ResendOtpRequestDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.auth.resendOtp),
      payload
    );
  }

  /**
   * POST /auth/update-password
   * Update user password
   */
  updatePassword(payload: UpdatePasswordRequestDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.auth.updatePassword),
      payload
    );
  }

  /**
   * POST /auth/password-reset
   */
  resetPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.auth.passwordReset),
      { email }
    );
  }

  /**
   * GET /auth/me - Get current user from token
   */
  getCurrentUser(): Observable<LoginResponseDto> {
    return this.http.get<LoginResponseDto>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.auth.me)
    );
  }

   setPassword(payload: { new_password: string ,comfirm_password: string,email: string}): Observable<void> {
    return this.http.post<void>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.auth.setPassword),
      payload
    );
  }
 changePassword(data: ChangePasswordRequest): Observable<ApiResponse> {
      return this.http.post<ApiResponse>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.auth.changePassword),
      data
    );
}

}

