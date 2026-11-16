import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponseDto } from '../dto/response';
import { ApiConfig } from '../config/api.config';
import { UserListRequestDto } from '../dto/request/user-list.request.dto';
import { UserListResponseDto } from '../dto/response/user-list.response.dto';
import { CreateUserPayloadRequest, updateUserStatusRequest } from '../dto/request/createUser.request.dto';
import { ApiResponse } from 'src/app/domain/entities/api-response.entity';

/**
 * User API Service
 * 
 * Raw HTTP calls to user endpoints.
 */
@Injectable({ providedIn: 'root' })
export class UserApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfig
  ) {}

  /**
   * GET /users
   */
  getAll(): Observable<UserResponseDto[]> {
    return this.http.get<UserResponseDto[]>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.users.base)
    );
  }

  /**
   * GET /users/:id
   */
  getById(id: number): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.users.byId(id))
    );
  }

  /**
   * PATCH /users/:id
   */
  update(id: number, payload: Partial<UserResponseDto>): Observable<UserResponseDto> {
    return this.http.patch<UserResponseDto>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.users.byId(id)),
      payload
    );
  }

  /**
   * DELETE /users/:id
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.users.byId(id))
    );
  }

  /**
   * POST /auth/users for admin user list with filters/pagination
   */
  getUserList(payload: UserListRequestDto): Observable<UserListResponseDto> {
    return this.http.post<UserListResponseDto>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.users.allUsers),
      payload
    );
  }
createUser(payload: CreateUserPayloadRequest): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    this.apiConfig.getUrl(
      this.apiConfig.endpoints.users.createUser
    ),
    payload
  );
}
updateUserStatus(payload:updateUserStatusRequest): Observable<ApiResponse> {
 return this.http.post<ApiResponse>(
    this.apiConfig.getUrl(
      this.apiConfig.endpoints.users.updateUserStatus
    ),
    payload
  );
}
}
