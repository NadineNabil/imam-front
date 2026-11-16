import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Course } from "../entities/course.entity";
import { COURSE_REPOSITORY_TOKEN, ICourseRepository } from "../repository-contracts/course-repository.contract";
import { Inject, Injectable } from "@angular/core";
import { ICourseBusiness } from "../business-contracts/course-business.contract";
import { SharedPagination } from "../entities/shared-pagination.entity";
import { PagedResult } from "../entities/PagedResult.entity";

@Injectable({ providedIn: 'root' })
export class CourseBusiness implements ICourseBusiness {
    constructor(@Inject(COURSE_REPOSITORY_TOKEN) private readonly courseRepository: ICourseRepository){}
    getAll(): Observable<Course[]> {
        return this.courseRepository.getAll();
    }
    getCoursesByCategoryId(id:number):Observable<Course[]>{
            return this.courseRepository.getCoursesByCategoryId(id)
    }
    getCoursesBySubCategoryId(id:number):Observable<Course[]>{
        return this.courseRepository.getCoursesBySubCategoryId(id)
    }

    getCoursesWithLastExam(courseId: number): Observable<any[]> {
        return this.courseRepository.getCoursesWithLastExam(courseId);
    }

    getExamReport(examId: number | string): Observable<any> {
        return this.courseRepository.getExamReport(examId);
    }

    addCourse(course: Course): Observable<void> {
           return this.courseRepository.addCourse(course);
        }
    getAllCourses(PaginationPayload: SharedPagination): Observable<PagedResult<Course>> {
        return this.courseRepository.getAllCourses(PaginationPayload).pipe(
         catchError(error => {
          console.error('Business layer error', error);
          // Transform error if you want:
          return throwError(() => new Error('Failed to load courses'));
        })
      );
    }

    getCourseById(id: number): Observable<Course> {
        return this.courseRepository.getCourseById(id).pipe(
            catchError(error => {
                console.error('Business layer error', error);
                return throwError(() => new Error('Failed to load course details'));
            })
        );
    }

    updateCourse(course: Course): Observable<void> {
        return this.courseRepository.updateCourse(course);
        // return this.courseRepository.updateCourse(course).pipe(
        //     catchError(error => {
        //         console.error('Business layer error', error);
        //         return throwError(() => new Error('Failed to update course'));
        //     })
        // );
    }
    deleteCourse(id: number): Observable<void> {
        return this.courseRepository.deleteCourse(id).pipe(
          catchError(error => {
            console.error('Business layer error', error);
            return throwError(() => new Error('Failed to delete course'));
})
);
}

     inviteGroupToCourse(course_id: number, group_id: number): Observable<void>
     {
        return this.courseRepository.inviteGroupToCourse(course_id, group_id).pipe(
            catchError(error => {
                console.error('Business layer error', error);
                return throwError(() => new Error('Failed to invite group to course'));
            })
        );
     }


 }
