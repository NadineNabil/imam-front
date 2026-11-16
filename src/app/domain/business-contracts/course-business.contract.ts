import { Observable } from "rxjs";
import { Course } from "../entities/course.entity";
import { InjectionToken } from "@angular/core";
import { PagedResult } from "../entities/PagedResult.entity";
import { SharedPagination } from "../entities/shared-pagination.entity";

export interface ICourseBusiness{
    getAll(): Observable<Course[]>;
    getCoursesByCategoryId(id:number):Observable<Course[]>;
    getCoursesBySubCategoryId(id:number):Observable<Course[]>
    getCoursesWithLastExam(courseId: number): Observable<any[]>;
    getExamReport(examId: number | string): Observable<any>;

    addCourse(course:Course): Observable<void>;
    getAllCourses(PaginationPayload:SharedPagination): Observable<PagedResult<Course>>;
    getCourseById(id: number): Observable<Course>;
    updateCourse( course: Course): Observable<void>;
    deleteCourse(id: number): Observable<void>;
    inviteGroupToCourse(course_id: number, group_id: number): Observable<void>;

}
export const COURSE_BUSINESS_TOKEN = new InjectionToken<ICourseBusiness>(
  'ICourseBusiness'
);







