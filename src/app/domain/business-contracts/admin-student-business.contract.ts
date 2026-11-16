import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../entities/api-response.entity';
import { Student } from '../entities/student.entity';
import { PagedResult } from '../entities/PagedResult.entity';
import { SharedPagination } from '../entities/shared-pagination.entity';

export interface IAdminStudentBusiness {
  getAllStudents(pagination: SharedPagination): Observable<PagedResult<Student>>;
/*   getAllExams(pagination: SharedPagination): Observable<PagedResult<Student>>;
 */  getStudentById(studentId: number): Observable<Student>;
   getStudents(exclude_group_id: number,search:string): Observable<Student[]>;
  updateStudent(student: Student): Observable<ApiResponse>;
  deleteStudent(studentId: number): Observable<ApiResponse>;
  updateCourseStatus(studentId: number, courseId: number, status: string): Observable<ApiResponse>;
}

export const ADMIN_STUDENT_BUSINESS_TOKEN = new InjectionToken<IAdminStudentBusiness>('IAdminStudentBusiness');
