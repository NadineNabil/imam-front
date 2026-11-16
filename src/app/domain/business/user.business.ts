import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CreateUserPayload, User } from '../entities/user.entity';
import { UserListFilter } from '../entities/user-list-filter.entity';
import { IUserRepository, USER_REPOSITORY_TOKEN } from '../repository-contracts/user-repository.contract';
import { IUserBusiness } from '../business-contracts/user-business.contract';
import { ApiResponse } from '../entities/api-response.entity';
import { PagedResult } from '../entities/PagedResult.entity';

/**
 * User Business
 * 
 * Encapsulates all user-related business logic.
 * Implements IUserBusiness contract for presentation layer.
 */
@Injectable({ providedIn: 'root' })
export class UserBusiness implements IUserBusiness {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: IUserRepository
  ) {}

  /**
   * Get all users
   */
  getAll(): Observable<User[]> {
    return this.userRepository.getAll();
  }

  /**
   * Get user by ID
   */
  getById(id: number): Observable<User | null> {
    if (!id || id <= 0) {
      return throwError(() => new Error('Invalid user ID'));
    }
    return this.userRepository.getById(id);
  }

  getUserList(payload: UserListFilter): Observable<PagedResult<User>>{
    return this.userRepository.getUserList(payload);
  }

  /**
   * Create a new user
   */
  createUser(payload: CreateUserPayload): Observable<ApiResponse> {
    return this.userRepository.createUser(payload);
  }
    updateUserStatus(user:User): Observable<ApiResponse> {
    return this.userRepository.updateUserStatus(user);
    }

}

