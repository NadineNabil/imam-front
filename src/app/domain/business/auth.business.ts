import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../entities/user.entity';
import { AuthCredentials, OtpData, RegistrationData, UpdatePasswordData } from '../entities/auth-credentials.entity';
import { IAuthRepository, AUTH_REPOSITORY_TOKEN } from '../repository-contracts/auth-repository.contract';
import { IAuthBusiness } from '../business-contracts/auth-business.contract';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ChangePasswordRequest } from 'src/app/data/dto/request/change-password.dto';
import { ApiResponse } from '../entities/api-response.entity';

/**
 * Auth Business
 * 
 * Encapsulates all authentication business logic.
 * Implements IAuthBusiness contract for presentation layer.
 */
@Injectable({ providedIn: 'root' })
export class AuthBusiness implements IAuthBusiness {
  constructor(
    @Inject(AUTH_REPOSITORY_TOKEN) private readonly authRepository: IAuthRepository,
    private readonly storage: StorageService
  ) {}

  /**
   * Login user with credentials
   */
  login(email: string, password: string, rememberMe: boolean): Observable<User> {
    const credentials = new AuthCredentials(email, password);

    // Business rule: validate credentials format before making API call
    if (!credentials.isValid()) {
      return throwError(() => new Error('Invalid email or password format'));
    }

    return this.authRepository.login(credentials, rememberMe).pipe(
      tap((user) => {
        console.log(`User ${user.email} logged in successfully`);
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Register new user
   */
  register(
    email: string,
    password: string,
   fullname: string,
  ): Observable<User> {
    // Business rule: password strength validation
    if (password.length < 8) {
      return throwError(() => new Error('Password must be at least 8 characters'));
    }

    const registrationData = new RegistrationData(
      email,
      password,
      fullname
    );

    return this.authRepository.register(registrationData).pipe(
      tap((user) => {
        console.log(`User ${user.email} registered successfully`);
      }),
      catchError((error) => {
        console.error('Registration failed:', error);
        return throwError(() => error);
      })
    );
  }


  /**
   * Send OTP to user's email
   */
  sendOtp(email: string): Observable<string> {
    return this.authRepository.sendOtp(email).pipe(
      tap((message) => {
        console.log(`OTP sent to ${email}: ${message}`);
      })
    );
  }

  /**
   * Verify OTP code
   */
  verifyOtp(email: string, otp: string): Observable<any> {
    const data = new OtpData(email, otp);
    return this.authRepository.verifyOtp(data).pipe(
      tap((data) => {
        // console.log(`OTP verified: ${data["message"]}`);
      })
    );
  }

  /**
   * Resend OTP to user's email
   */
  resendOtp(email: string): Observable<string> {
    return this.authRepository.resendOtp(email).pipe(
      tap((message) => {
        console.log(`OTP resent to ${email}: ${message}`);
      })
    );
  }

  /**
   * Update user password
   */
  updatePassword(email: string, newPassword: string, confirmPassword: string, token: string): Observable<string> {
    const data = new UpdatePasswordData(email, newPassword, confirmPassword, token);
    return this.authRepository.updatePassword(data).pipe(
      tap((message) => {
        console.log(`Password updated: ${message}`); 
      })
    );
  }

  /**
   * Logout current user
   */
  logout(): Observable<void> {
    return this.authRepository.logout().pipe(
      tap(() => {
        console.log('User logged out successfully');
      })
    );
  }

  /**
   * Get current user synchronously
   */
  getCurrentUser(): User | null {
    return this.authRepository.getCurrentUser();
  }

  /**
   * Get observable stream of current user changes
   */
  getCurrentUser$(): Observable<User | null> {
    return this.authRepository.currentUser$;
  }

  setPassword(payload: { new_password: string ,comfirm_password: string,email: string}): Observable<void> {
      return this.authRepository.setPassword!(payload);
    }
    
changePassword(data: ChangePasswordRequest): Observable<ApiResponse> {
  // optional business rules here
  return this.authRepository.changePassword(data);
}

  }
