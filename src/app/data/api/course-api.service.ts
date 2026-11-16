import { HttpClient } from "@angular/common/http";
import { ApiConfig } from '../config/api.config';
import { Injectable } from "@angular/core";
import { catchError, delay, map, Observable, of, shareReplay, throwError } from "rxjs";
import { AllCoursesResponseDto, CourseResponseDto, CoursesApiResponseDto } from "../dto/response/course.response.dto";
import { PaginationRequestDto } from "../dto/request/pagination.request.dto";

@Injectable({ providedIn: 'root' })
export class CourseApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfig
  ) {}  

getAll(): Observable<AllCoursesResponseDto[]> {

    return this.http.get<AllCoursesResponseDto[]>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.courses.list)
    ).pipe(
      shareReplay(),
      catchError(error => {
        console.error('Courses API error', error);
        return throwError(() => error);
      })
    );  
}
getCoursesByCategoryId(id: number): Observable<CourseResponseDto[]> {
    return this.http
      .get<CourseResponseDto[]>(
        this.apiConfig.getUrl(
          this.apiConfig.endpoints.courses.GetCoursesByCategoryId + `${id}`
        )
      )
      .pipe(
        shareReplay(),
        catchError(error => {
          console.error('Courses API error', error);
          return throwError(() => error);
        })
      );

}
getCoursesBySubCategoryId(id: number): Observable<CourseResponseDto[]> {
    return this.http
      .get<CourseResponseDto[]>(
        this.apiConfig.getUrl(
          this.apiConfig.endpoints.courses.GetCoursesByCategoryId + `${id}`
        )
      )
      .pipe(
        shareReplay(),
        catchError(error => {
          console.error('Courses API error', error);
          return throwError(() => error);
        })
      );

}

 addCourse(payload:CourseResponseDto): Observable<void> {
    return this.http.post<void>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.courses.create),
      payload
    );
  }
  getAllCourses(pagination:PaginationRequestDto): Observable<CoursesApiResponseDto> {
    return this.http.post<CoursesApiResponseDto>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.courses.GetAllCourses),pagination
    ).pipe(
      shareReplay(),
    catchError(error => {
      console.error('API Service error', error);
      return throwError(() => error); // forward to repository/business
    }),
 
  );
  }

  getCourseById(id: number): Observable<CourseResponseDto> {
    return this.http.get<CourseResponseDto>(this.apiConfig.getUrl(this.apiConfig.endpoints.courses.details(id)));
    
  }

  getCoursesWithLastExam(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.courses.getCoursesWithLastExam(courseId))
    ).pipe(
      catchError(error => {
        console.error('Courses with last exam API error', error);
        return throwError(() => error);
      })
    );
  }

  getExamReport(examId: number | string): Observable<any> {
    return this.http.get<any>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.exam.getExamReport(examId))
    ).pipe(
      catchError(error => {
        console.error('Exam report API error', error);
        return throwError(() => error);
      })
    );
  }
  updateCourse( courseData:any): any {
    return this.http.put<CourseResponseDto>(this.apiConfig.getUrl(this.apiConfig.endpoints.courses.update),courseData);
   
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(this.apiConfig.getUrl(this.apiConfig.endpoints.courses.delete(id)));
  }

  /**
   * POST /course/{id}/enroll
   * payload: { email: string; full_name?: string }
  Observable<any> 
  */
  enrollStudent(courseId: number, payload: { email: string; full_name?: string }) {
   /* return this.http.post<any>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.courses.enroll(courseId)),
      payload
    );
    */
  }

  inviteGroupToCourse(course_id: number, group_id: number): Observable<void> {
    return this.http.post<void>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.courses.inviteGroup),
      { course_id, group_id }
    );
  }

  
}