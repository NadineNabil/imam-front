import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUserPayload, User } from '../entities/user.entity';
import { UserListFilter } from '../entities/user-list-filter.entity';
import { ApiResponse } from '../entities/api-response.entity';
import { PagedResult } from '../entities/PagedResult.entity';

/**
 * User Business Contract
 * 
 * Interface used by presentation layer to interact with user business logic.
 */
export interface IUserBusiness {
  /**
   * Get all users
   */
  getAll(): Observable<User[]>;

  /**
   * Get user by ID
   */
  getById(id: number): Observable<User | null>;

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

export const USER_BUSINESS_TOKEN = new InjectionToken<IUserBusiness>('IUserBusiness');

