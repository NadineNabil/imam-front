import { Injectable } from "@angular/core";
import { CurrentStudentDto, StudentResponseDto } from "../dto/response/student.response.dto";
import { Observable, of } from "rxjs";
import { ApiResponse } from "src/app/domain/entities/api-response.entity";
import { StudentRequestDto, UpdateStudentImageDto, UpdateStudentRequestDto } from "../dto/request/student.request.dto";
import { ApiConfig } from "../config";
import { HttpClient } from "@angular/common/http";
import { StudentCourseResponseDto, StudentCourseDetailsResponseDto, StudentCompletedExamResponseDto, StudentExamToSolveResponseDto, StudentSummaryResponseDto, StudentCourseApiResponseDto } from "../dto/response/student-dashboard.response.dto";
import { CurrentStudentAssessment } from "src/app/domain/entities/student-assessment.entity";

@Injectable({ providedIn: 'root' })
export class StudentService {
constructor(private readonly http: HttpClient, private readonly apiConfig: ApiConfig){}

getStudentProfile(id: number): Observable<CurrentStudentDto> {
    return this.http.get<CurrentStudentDto>(
          this.apiConfig.getUrl(this.apiConfig.endpoints.student.getStudent(id))
        );
  }

  editStudentProfile(studentRequestDto: UpdateStudentRequestDto): Observable<ApiResponse> {
    console.log(studentRequestDto,'studentreqdto')
   return this.http.put<ApiResponse>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.student.update),
      studentRequestDto
    );
  }

  editStudentImage(studentRequestDto: UpdateStudentImageDto): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
        this.apiConfig.getUrl(this.apiConfig.endpoints.student.update_image),
        studentRequestDto
      );
  }

  /**
   * GET /student/summary
   * Returns the authenticated student's summary of enrolled courses and exams.
   */
  getStudentSummary(): Observable<StudentSummaryResponseDto> {
    return this.http.get<StudentSummaryResponseDto>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.student.summary)
    );
  }

  /**
   * GET /student/courses
   * Returns the authenticated student's enrolled courses.
   */
  getStudentCourses(): Observable<StudentCourseResponseDto[]> {
    return this.http.get<StudentCourseResponseDto[]>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.student.courses)
    );
  }

  /**
   * GET /student/exams-to-solve
   * Returns the authenticated student's upcoming exams still open to solve.
   */
  getStudentExamsToSolve(): Observable<StudentExamToSolveResponseDto[]> {
    return this.http.get<StudentExamToSolveResponseDto[]>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.student.examsToSolve)
    );
  }

  /**
   * GET /student/completed-exams
   * Returns the authenticated student's completed exams with score and completion details.
   */
  getStudentCompletedExams(): Observable<StudentCompletedExamResponseDto[]> {
    return this.http.get<StudentCompletedExamResponseDto[]>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.student.completedExams)
    );
  }

  /**
   * GET /student/courses-details
   * Returns student's courses with category/subcategory and learning unit counts.
   */
  getStudentCoursesDetails(): Observable<StudentCourseDetailsResponseDto[]> {
    return this.http.get<StudentCourseDetailsResponseDto[]>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.student.coursesDetails)
    );
  }

  /**
   * GET /student/course/{id}
   * Retrieves a specific course's details for the authenticated student.
   */
  getStudentCourse(id: number): Observable<StudentCourseApiResponseDto> {
    return this.http.get<StudentCourseApiResponseDto>(
      this.apiConfig.getUrl(`/student/course/${id}`)
    );
  }

  /**
   * GET /student/exams/{exam_id}/report
   * Retrieves detailed exam report including breakdown per objective and question.
   */
  getStudentExamReport(examId: number): Observable<any> {
    return this.http.get<any>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.student.examReport(examId))
    );
  }

  /**
   * GET /student/trainings/{training_id,attempt_id}/report
   * Retrieves a specific training attempt report.
   */
  getStudentTrainingReport(trainingId: number, attemptId: number | string): Observable<any> {
    return this.http.get<any>(
      this.apiConfig.getUrl(`/student/trainings/{training_id:int,attempt_id:int}/report?training_id=${trainingId}&attempt_id=${attemptId}`)
    );
  }

  /**
   * GET /student/assessments/
   * Returns the authenticated student's assessments with filters.
   */
  getStudentAssessments(payload: { page_no: number; page_size: number; status: string; from_date?: string | null; to_date?: string | null; course_id?: number | null; }): Observable<any> {
    const params = new URLSearchParams();
    params.set('page_no', payload.page_no.toString());
    params.set('page_size', payload.page_size.toString());
    params.set('status', payload.status);
    if (payload.course_id != null) {
      params.set('course_id', payload.course_id.toString());
    }
    if (payload.from_date) {
      params.set('from_date', payload.from_date);
    }
    if (payload.to_date) {
      params.set('to_date', payload.to_date);
    }

    return this.http.get<any>(
      this.apiConfig.getUrl(`/student/assessments/?${params.toString()}`)
    );
  }

  /**
   * GET /student/assessments/current
   * Returns assessments currently available for the authenticated student to solve.
   */
  getCurrentStudentAssessments(): Observable<CurrentStudentAssessment[]> {
    return this.http.get<CurrentStudentAssessment[]>(
      this.apiConfig.getUrl('/student/assessments/current')
    );
  }

  /**
   * GET /student/trainings/
   * Returns the authenticated student's trainings with filters.
   */
  getStudentTrainings(payload: { page_no: number; page_size: number; status: string; from_date?: string | null; to_date?: string | null; course_id?: number | null; }): Observable<any> {
    const params = new URLSearchParams();
    params.set('page_no', payload.page_no.toString());
    params.set('page_size', payload.page_size.toString());
    params.set('status', payload.status);
    if (payload.course_id != null) {
      params.set('course_id', payload.course_id.toString());
    }
    if (payload.from_date) {
      params.set('from_date', payload.from_date);
    }
    if (payload.to_date) {
      params.set('to_date', payload.to_date);
    }

    return this.http.get<any>(
      this.apiConfig.getUrl(`/student/trainings/?${params.toString()}`)
    );
  }

  /**
   * GET /student/trainings/current
   * Returns trainings currently available for the authenticated student to solve.
   */
  getCurrentStudentTrainings(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiConfig.getUrl('/student/trainings/current')
    );
  }

  /**
   * GET /student/trainings/{training_id}/training_details
   * Returns all attempt details for a specific training.
   */
  getStudentTrainingDetails(trainingId: number): Observable<any> {
    return this.http.get<any>(
      this.apiConfig.getUrl(`/student/trainings/${trainingId}/training_details`)
    );
  }

}
