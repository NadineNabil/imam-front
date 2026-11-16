import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../entities/api-response.entity';
import { Student } from '../entities/student.entity';
import { IAdminStudentBusiness } from '../business-contracts/admin-student-business.contract';
import { ADMIN_STUDENT_REPOSITORY_TOKEN, IAdminStudentRepository } from '../repository-contracts/admin-student-repository.contract';
import { SharedPagination } from '../entities/shared-pagination.entity';
import { PagedResult } from '../entities/PagedResult.entity';

@Injectable({ providedIn: 'root' })
export class AdminStudentBusiness implements IAdminStudentBusiness {
  constructor(
    @Inject(ADMIN_STUDENT_REPOSITORY_TOKEN)
    private readonly adminStudentRepository: IAdminStudentRepository
  ) {}
  updateCourseStatus(studentId: number, courseId: number, status: string): Observable<ApiResponse> {
    return this.adminStudentRepository.updateCourseStatus(studentId, courseId, status);
  }
  getStudents(exclude_group_id: number,search:string): Observable<Student[]> {
    return this.adminStudentRepository.getStudents(exclude_group_id, search);
  }

  getAllStudents(pagination: SharedPagination): Observable<PagedResult<Student>> {
    return this.adminStudentRepository.getAllStudents(pagination);
  }

/*   getAllExams(pagination: SharedPagination): Observable<PagedResult<Student>> {
    return this.adminStudentRepository.getAllExams(pagination);
  } */

  getStudentById(studentId: number): Observable<Student> {
    return this.adminStudentRepository.getStudentById(studentId);
  }

  updateStudent(student: Student): Observable<ApiResponse> {
    return this.adminStudentRepository.updateStudent(student);
  }

  deleteStudent(studentId: number): Observable<ApiResponse> {
    return this.adminStudentRepository.deleteStudent(studentId);
  }

}
