/**
 * User Entity - Core Domain Model
 * This is a pure TypeScript class with no Angular dependencies.
 * Represents the business concept of a User in the system.
 */
import { UserStatus } from '../enums/user-status.enum';
import { Category } from './category.entity';
export class User {
  constructor(
    public readonly id: number | undefined,
    public readonly email: string,
    public readonly username: string | undefined,
    public readonly firstName: string | undefined,
    public readonly lastName: string | undefined,
    public readonly token: string | undefined,
    public readonly refreshToken: string | undefined,
    public readonly accessTokenExpiresAt: Date | undefined,
    public readonly refreshTokenExpiresAt: Date | undefined,
    public readonly roles: string[] = [],
    public readonly organizationId: number | undefined,
    public readonly status?: UserStatus | string | undefined,
 public readonly joinedAt: Date|string | undefined = undefined,
    public readonly categories: Category[] = [],
  ) {}

  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.username || this.email;
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  get isAccessTokenExpired(): boolean {
    if (!this.accessTokenExpiresAt) return true;
    const bufferMs = 30_000; // 30s buffer before actual expiry
    return Date.now() >= this.accessTokenExpiresAt.getTime() - bufferMs;
  }

  get isRefreshTokenExpired(): boolean {
    if (!this.refreshTokenExpiresAt) return true;
    return Date.now() >= this.refreshTokenExpiresAt.getTime();
  }

  copyWith(props: Partial<Omit<User, 'fullName' | 'isAuthenticated' | 'isAccessTokenExpired' | 'isRefreshTokenExpired' | 'copyWith'>>): User {
    return new User(
      props.id ?? this.id,
      props.email ?? this.email,
      props.username ?? this.username,
      props.firstName ?? this.firstName,
      props.lastName ?? this.lastName,
      props.token ?? this.token,
      props.refreshToken ?? this.refreshToken,
      props.accessTokenExpiresAt ?? this.accessTokenExpiresAt,
      props.refreshTokenExpiresAt ?? this.refreshTokenExpiresAt,
      props.roles ?? this.roles,
      props.organizationId ?? this.organizationId,
      props.status ?? this.status
    );
  }
}

/**
 * Payload required to create a new User
 */
export interface CreateUserPayload {
  fullName: string;
  email: string;
  role: string;
  password?: string;
  assignedCategories?: number[];
  canCreateExams?: boolean;
}

