import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError, of } from "rxjs";
import { ICourseRepository } from "src/app/domain/repository-contracts/course-repository.contract";
import { Course } from "src/app/domain/entities/course.entity";
import { CourseApiService } from "../api/course-api.service";
import { CourseMapper } from "../mappers/course.mapper";
import { SharedPagination } from 'src/app/domain/entities/shared-pagination.entity';
import { PaginationMapper } from '../mappers/pagination.mapper';
import { PagedResult } from 'src/app/domain/entities/PagedResult.entity';
import { CourseRequestDto } from "../dto/request/course.request.dto";
import { ApiConfig } from '../config/api.config';
import { PaginationRequestDto } from "../dto/request/pagination.request.dto";

@Injectable({ providedIn: 'root' })
export class CourseRepositoryImpl implements ICourseRepository {
    // Add apiConfig property and initialize it as needed
    apiConfig = { baseUrl: this.apiConfigService.baseUrl }; // Example initialization, adjust as necessary

    constructor (private courseApiService: CourseApiService,private apiConfigService: ApiConfig) { }
    
    
    getCoursesBySubCategoryId(id: number): Observable<Course[]> {
        return this.courseApiService.getCoursesBySubCategoryId(id).pipe(
            map(dto=>CourseMapper.fromResponseDtoList(dto,this.apiConfigService.baseUrl))
        )
    }

    getCoursesWithLastExam(courseId: number): Observable<any[]> {
        return this.courseApiService.getCoursesWithLastExam(courseId);
    }

    getExamReport(examId: number | string): Observable<any> {
        return this.courseApiService.getExamReport(examId);
    }

    getAll(): Observable<Course[]> {
      
        return this.courseApiService.getAll().pipe(
            map(dto=>{
                return CourseMapper.fromAllCoursesResponseDtoList(dto,this.apiConfig.baseUrl);  
            })
        )
    }

    getCoursesByCategoryId(id: number): Observable<Course[]> {
       return this.courseApiService
        .getCoursesByCategoryId(id)
        .pipe(
           map(dto => CourseMapper.fromResponseDtoList(dto,this.apiConfig.baseUrl))
        );
    } 
    
getAllCourses(PaginationPayload: SharedPagination): Observable<PagedResult<Course>> {
  const dto = PaginationMapper.toRequest(PaginationPayload);

  return this.courseApiService.getAllCourses(dto).pipe(
     map(apiResponse => ({
      items: CourseMapper.fromResponseDtoList(apiResponse.courses,this.apiConfig.baseUrl),
      totalItems: apiResponse.total_count
       })),
    catchError(error => {
      console.error('Repository layer error', error);
      return throwError(() => error);
    })
  );
}

    addCourse(Course:Course): Observable<void> {
        const dto:CourseRequestDto=CourseMapper.toRequestDto(Course);
        // Call API here
        return this.courseApiService.addCourse(dto)
    }

    getCourseById(id: number): Observable<Course> {
        return this.courseApiService.getCourseById(id).pipe(
            map(dto => CourseMapper.fromResponseDto(dto,this.apiConfig.baseUrl))
        );
    }

    updateCourse(course: Course): Observable<void> {
        const dto: CourseRequestDto = CourseMapper.toRequestDto(course);
        return this.courseApiService.updateCourse(dto).pipe(
          map(() => void 0),
            catchError(error => {
              console.error('Repository layer error', error);
            return throwError(() => error);
         })
        );
    }

    deleteCourse(id: number): Observable<void> {
        return this.courseApiService.deleteCourse(id).pipe(
          map(() => void 0),
          catchError(error => {
            console.error('Repository layer error', error);
            return throwError(() => error);
          })
        );
    }


    inviteGroupToCourse(course_id: number, group_id: number): Observable<void> {
      return this.courseApiService.inviteGroupToCourse(course_id, group_id).pipe(
        map(() => void 0),
        catchError(error => {
          console.error('Repository layer error', error);
          return throwError(() => error);
        })
      );
    }

    
  /** Enroll or invite a student to a course  : Observable<any>*/
  enrollStudent(courseId: number, payload: { email: string; full_name?: string }) {
    /*return this.courseApiService.enrollStudent(courseId, payload).pipe(
      catchError(error => {
        console.error('Repository enroll error', error);
        return throwError(() => error);
      })
    );
    */
  }

  /** Return mock invitations for a course or all invitations when courseId is omitted */
  getInvitations(courseId?: number) {
    const now = new Date();
    const invitations = [
      {
        id: 1,
        email: 'alice@example.com',
        user_status: 'Pending',
        invitation_status: 'Sent',
        sent_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        course_id: courseId,
        course_name: 'Sample Course'
      },
      {
        id: 2,
        email: 'bob@example.com',
        user_status: 'Active',
        invitation_status: 'Activated',
        sent_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        course_id: courseId,
        course_name: 'Sample Course'
      },
      {
        id: 3,
        email: 'charlie@example.com',
        user_status: 'Expired',
        invitation_status: 'Expired',
        sent_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 90).toISOString(),
        course_id: courseId,
        course_name: 'Sample Course'
      }
    ];

    // If courseId provided, filter; otherwise return all
    const filtered = typeof courseId === 'number' ? invitations.filter(i => i.course_id === courseId) : invitations;
    return of(filtered).pipe();
  }

  /** Return all invitations (mock) */
  getAllInvitations() {
    // reuse getInvitations without filter
    return this.getInvitations();
  }

  /** Resend invitation (mock) */
  resendInvitation(invitationId: number) {
    // In a real implementation this would call an API endpoint
    console.log('Resend invitation', invitationId);
    return of({ success: true, id: invitationId }).pipe();
  }

  /** Cancel invitation (mock) */
  cancelInvitation(invitationId: number) {
    console.log('Cancel invitation', invitationId);
    return of({ success: true, id: invitationId }).pipe();
  }




}
