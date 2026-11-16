import { HttpClient } from "@angular/common/http";
import { ApiConfig } from "../config";
import { Injectable } from "@angular/core";
import { AdminStudentProfileResponseDto, AdminStudentListResponseDto } from "../dto/response/student.response.dto";
import { Observable } from "rxjs";
import { ApiResponse } from "src/app/domain/entities/api-response.entity";

export interface AdminStudentListApiResponseDto {
  items: AdminStudentListResponseDto[];
  total_count: number;
}

@Injectable({ providedIn: 'root' })
export class AdminStudentService {
  constructor(private readonly http: HttpClient, private readonly apiConfig: ApiConfig) {}
  
  getStudentById(studentId: number) : Observable<AdminStudentProfileResponseDto> {
    return this.http.get<AdminStudentProfileResponseDto>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.adminStudent.getStudentById(studentId))
    );
  }

  getAllStudents(params:any): Observable<AdminStudentListApiResponseDto> {
    return this.http.get<AdminStudentListApiResponseDto>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.adminStudent.getAll),
      { params }
    );
  }

  updateCourseStatus(studentId: number, courseId: number, status: string): Observable<ApiResponse> {
    const url = this.apiConfig.getUrl(this.apiConfig.endpoints.adminStudent.updateCourseStatus(studentId, courseId));
    return this.http.put<ApiResponse>(url, { status });
  }

  getStudents(exclude_group_id: number, search: string): Observable<AdminStudentListApiResponseDto>
  {
     const url = this.apiConfig.getUrl(this.apiConfig.endpoints.adminStudent.getStudentsOfGroups(exclude_group_id, search));
     return this.http.get<AdminStudentListApiResponseDto>(
      url,
      { params: { exclude_group_id: String(exclude_group_id), search } }
    );
  }
}   