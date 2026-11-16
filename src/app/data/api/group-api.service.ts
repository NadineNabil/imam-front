import { HttpClient } from "@angular/common/http";
import { ApiConfig } from '../config/api.config';
import { Injectable } from "@angular/core";
import { catchError, delay, map, Observable, of, shareReplay, throwError } from "rxjs";
import { GroupResponseDto, GroupsApiResponseDto } from "../dto/response/group.response.dto";
import { PaginationRequestDto } from "../dto/request/pagination.request.dto";
import { Student } from "src/app/domain/entities/student.entity";
import { CreateGroupRequestDto, UpdateGroupRequestDto } from "../dto/request/group.request.dto";
import { ApiResponse } from "src/app/domain/entities/api-response.entity";

@Injectable({ providedIn: 'root' })
export class GroupApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfig
  ) { }


  getAllGroups(pagination: PaginationRequestDto): Observable<GroupsApiResponseDto> {
        return this.http.get<GroupsApiResponseDto>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.groups.getAllGroups),
      { params: { page_no: pagination.page_no.toString(), page_size: pagination.page_size.toString() } }
    ).pipe(
      shareReplay(),
      catchError(error => {
        console.error('Get All Groups API error', error);
        return throwError(() => error);
      })
    );
  }
  getGroupById(id: number): Observable<GroupResponseDto> {
    return this.http.get<GroupResponseDto>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.groups.getGroupById(id))
    
    );
  }

  createGroup(payload: CreateGroupRequestDto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.groups.create),
      payload
    ).pipe(
      shareReplay(),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  updateGroup(groupData: UpdateGroupRequestDto): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.groups.update + groupData.id),
      groupData
    ).pipe(
      shareReplay(),
      catchError(error => {
        console.error('Update Group API error', error);
        return throwError(() => error);
      })
    );
  }

  deleteGroup(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.groups.delete(id))
    ).pipe(
      shareReplay(),
      catchError(error => {
        console.error('Delete Group API error', error);
        return throwError(() => error);
      })
    );
  }


  Add_Students_To_Group(group_id: number, studentIds: number[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.groups.Add_Students_To_Group(group_id)),
      { student_ids: studentIds }
    ).pipe(
      shareReplay(),
      catchError(error => {
        console.error('Add Students to Group API error', error);
        return throwError(() => error);
      })
    );  

  }

  Remove_Student_From_Group(group_id: number, student_id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.groups.Remove_Student_From_Group(group_id, student_id))
    ).pipe(
      shareReplay(),
      catchError(error => {
        console.error('Remove Student from Group API error', error);
        return throwError(() => error);
      })
    );

    }
    }
