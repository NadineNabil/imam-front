/**
 * Auth Credentials Entity - Core Domain Model
 * Represents login credentials
 */
export class AuthCredentials {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  /**
   * Validates if credentials are properly formatted
   * Email must be valid format, password must be at least 8 characters
   */
  isValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email) && this.password.length >= 8;
  }
}

/**
 * Registration Data Entity
 */
export class RegistrationData {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly fullname: string,

  ) {}
}


/**
 * OTP Data Entity
 */
export class OtpData {
  constructor(
    public readonly email: string,
    public readonly otp: string
  ) {}
}


/**
 * Update Password Data Entity
 */
export class UpdatePasswordData {
  constructor(
    public readonly email: string,
    public readonly newPassword: string,
    public readonly confirmPassword: string,
    public readonly token: string
  ) {}
}