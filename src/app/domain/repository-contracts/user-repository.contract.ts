import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUserPayload, User } from '../entities/user.entity';
import { UserListFilter } from '../entities/user-list-filter.entity';
import { ApiResponse } from '../entities/api-response.entity';
import { PagedResult } from '../entities/PagedResult.entity';

/**
 * User Repository Interface (Port)
 * 
 * Abstraction for user data operations.
 * Implementation will be provided by the data layer.
 */
export interface IUserRepository {
  /**
   * Get all users
   * @returns Observable of User array
   */
  getAll(): Observable<User[]>;

  /**
   * Get user by ID
   * @param id - User ID
   * @returns Observable of User or null
   */
  getById(id: number): Observable<User | null>;

  /**
   * Update user profile
   * @param id - User ID
   * @param userData - Partial user data to update
   * @returns Observable of updated User
   */
  update(id: number, userData: Partial<User>): Observable<User>;

  /**
   * Delete user
   * @param id - User ID
   * @returns Observable that completes when deletion is done
   */
  delete(id: number): Observable<void>;

  /**
   * Get users for the admin list screen with filters and pagination
   */
  getUserList(payload: UserListFilter): Observable<PagedResult<User>>;

  /**
   * Create new user
   */
  createUser(payload: CreateUserPayload): Observable<ApiResponse>;
  updateUserStatus(user:User): Observable<ApiResponse> 
}


/**
 * Injection token for User Repository
 * Used for Angular dependency injection since interfaces don't exist at runtime
 */
export const USER_REPOSITORY_TOKEN = new InjectionToken<IUserRepository>('IUserRepository');

