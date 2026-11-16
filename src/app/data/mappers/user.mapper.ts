import { User } from '../../domain/entities/user.entity';
import { LoginResponseDto } from '../dto/response/login.response.dto';
import { UserResponseDto } from '../dto/response/user.response.dto';
import { RegisterRequestDto } from '../dto/request/register.request.dto';
import { LoginRequestDto } from '../dto/request/login.request.dto';
import { SendOtpRequestDto } from '../dto/request/send-otp.request.dto';
import { VerifyOtpRequestDto } from '../dto/request/verify-otp.request.dto';
import { ResendOtpRequestDto } from '../dto/request/resend-otp.request.dto';
import { UpdatePasswordRequestDto } from '../dto/request/update-password.request.dto';
import { CreateUserPayloadRequest, updateUserStatusRequest } from '../dto/request/createUser.request.dto';
import { CreateUserPayload } from '../../domain/entities/user.entity';
import { AuthCredentials, RegistrationData, OtpData, UpdatePasswordData } from '../../domain/entities/auth-credentials.entity';

/**
 * User Mapper
 * 
 * Transforms between DTOs (Data Transfer Objects) and Domain Entities.
 * This keeps the domain layer clean from API-specific concerns.
 */
export class UserMapper {
  /**
   * Map CreateUserPayload domain model to CreateUserPayloadRequest DTO
   */
  static toCreateUserRequest(data: CreateUserPayload): CreateUserPayloadRequest {
    return {
      name: data.fullName,
      email: data.email,
      categories: data.assignedCategories ?? [],
      role: data.role,
      password: data.password,
      can_create_exams: data.canCreateExams
    };
  }
  /**
   * Map login response DTO to User entity
   */
  static fromLoginResponse(dto: LoginResponseDto): User {
    return new User(
      dto.user_id,
      
      '',
      dto.username,
      dto.name,
      undefined,
      dto.access_token,
      dto.refresh_token,
      dto.access_token_expires_at ? new Date(dto.access_token_expires_at) : undefined,
      dto.refresh_token_expires_at ? new Date(dto.refresh_token_expires_at) : undefined,
      dto.roles ?? [],
      dto.organization_id,
      // login response currently does not include status; keep undefined
      undefined
    );
  }

  /**
   * Map user response DTO to User entity
   */
  static fromUserResponse(dto: UserResponseDto): User {
    return new User(
      dto.id,
      dto.email,
      dto.username,
      dto.first_name,
      dto.last_name,
      undefined,
      undefined,
      undefined,
      undefined,
      [],
      undefined,
      // dto may include status in future - map to enum string if present
      (function mapStatus(s: any): string | undefined {
        if (!s) return undefined;
        const v = String(s).toLowerCase();
        switch (v) {
          case 'active': case 'activated': return 'Active';
          case 'pending': return 'Pending';
          case 'revoked': case 'deactivated': return 'Revoked';
          case 'cancelled': case 'cancel': case 'removed': return 'Cancelled';
          default: return String(s);
        }
      })((dto as any).status)
    );
  }

  /**
   * Map array of user response DTOs to User entities
   */
  static fromUserResponseList(dtos: UserResponseDto[]): User[] {
    return dtos.map(dto => UserMapper.fromUserResponse(dto));
  }

  /**
   * Map registration data to request DTO
   */
  static toRegisterRequest(data: RegistrationData): RegisterRequestDto {
    return {
      email: data.email,
      password: data.password,
      name: data.fullname
    };
  }

  /**
   * Map auth credentials to login request DTO
   */
  static toLoginRequest(credentials: AuthCredentials): LoginRequestDto {
    return {
      email: credentials.email,
      password: credentials.password
    };
  }

  /**
   * Map email to send OTP request DTO
   */
  static toSendOtpRequest(email: string): SendOtpRequestDto {
    return { email };
  }

  /**
   * Map OTP data to verify OTP request DTO
   */
  static toVerifyOtpRequest(data: OtpData): VerifyOtpRequestDto {
    return {
      email: data.email,
      otp_code: data.otp
    };
  }

  /**
   * Map email to resend OTP request DTO
   */
  static toResendOtpRequest(email: string): ResendOtpRequestDto {
    return { email };
  }

  /**
   * Map update password data to request DTO
   */
  static toUpdatePasswordRequest(data: UpdatePasswordData): UpdatePasswordRequestDto {
    return {
      email: data.email,
      new_password: data.newPassword,
      comfirm_password: data.confirmPassword,
      reset_token: data.token
    };
  }

  /**
   * Convert User entity to storage format (profile only, no tokens)
   */
  static toStorageFormat(user: User): object {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      organizationId: user.organizationId,
      status: (user as any).status ?? undefined
    };
  }

  /**
   * Reconstruct User entity from stored profile data (tokens loaded separately)
   */
  static fromStorageFormat(data: any): User | null {
    if (!data) return null;
    return new User(
      data.id,
      data.email ?? '',
      data.username,
      data.firstName,
      data.lastName,
      undefined,
      undefined,
      undefined,
      undefined,
      data.roles ?? [],
      data.organizationId,
      (data as any).status ?? undefined
    );
  }
 static toUpdateUserStatusRequest(user: User): updateUserStatusRequest { return { user_id: user.id!, role: user.roles[0], };}
}

