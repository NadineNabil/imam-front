import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CreateUserPayload } from '../../domain/entities/user.entity';
import { ApiResponse } from '../../domain/entities/api-response.entity';
import { IUserRepository } from '../../domain/repository-contracts/user-repository.contract';
import { User } from '../../domain/entities/user.entity';
import { UserApiService } from '../api/user-api.service';
import { UserMapper } from '../mappers/user.mapper';
import { UserListRequestDto } from '../dto/request/user-list.request.dto';
import { UserListMapper } from '../mappers/user-list.mapper';
import { UserListFilter } from '../../domain/entities/user-list-filter.entity';
import { PagedResult } from 'src/app/domain/entities/PagedResult.entity';

/**
 * User Repository Implementation
 * 
 * Implements the IUserRepository interface.
 * Compatible with FastAPI backend.
 */
@Injectable({ providedIn: 'root' })
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly userApi: UserApiService) {}

  /**
   * Get all users
   */
  getAll(): Observable<User[]> {
    return this.userApi.getAll().pipe(
      map(dtos => UserMapper.fromUserResponseList(dtos))
    );
  }

  /**
   * Get user by ID
   */
  getById(id: number): Observable<User | null> {
    return this.userApi.getById(id).pipe(
      map(dto => UserMapper.fromUserResponse(dto)),
      catchError(() => of(null))
    );
  }

  /**
   * Update user
   */
  update(id: number, userData: Partial<User>): Observable<User> {
    // Convert entity partial to DTO format
    const payload = {
      email: userData.email,
      username: userData.username,
      first_name: userData.firstName,
      last_name: userData.lastName
    };
    
    return this.userApi.update(id, payload).pipe(
      map(dto => UserMapper.fromUserResponse(dto))
    );
  }

  /**
   * Delete user
   */
  delete(id: number): Observable<void> {
    return this.userApi.delete(id);
  }

  getUserList(payload: UserListFilter): Observable<PagedResult<User>> {
    const requestPayload: UserListRequestDto = {
      page_no: payload.pageNo,
      page_size: payload.pageSize,
      role: payload.role,
      status: payload.status,
      category_id: payload.categoryId,
      date_from: payload.dateFrom,
      date_to: payload.dateTo,
      name: payload.name,
      username: payload.username,
      email: payload.email
    };

    return this.userApi.getUserList(requestPayload).pipe(
      map(dto => UserListMapper.fromApiResponse(dto))
    );
  }

  createUser(payload: CreateUserPayload): Observable<ApiResponse> {
    const requestDto = UserMapper.toCreateUserRequest(payload);
    return this.userApi.createUser(requestDto);
  }
  updateUserStatus(user:User): Observable<ApiResponse> {
    const requestDto = UserMapper.toUpdateUserStatusRequest(user);
    return this.userApi.updateUserStatus(requestDto);
  }

}

