import { Observable } from 'rxjs';
import { CurrentStudentAssessment, StudentAssessment } from '../entities/student-assessment.entity';
import { InjectionToken } from '@angular/core';

export interface GetStudentAssessmentsPayload {
  page_no: number;
  page_size: number;
  status: string;
  from_date?: string | null;
  to_date?: string | null;
  course_id?: number | null;
}

export interface StudentAssessmentsResponse {
  total_count: number;
  items: StudentAssessment[];
}

export interface IStudentAssessmentBusiness {
  getStudentAssessments(payload: GetStudentAssessmentsPayload): Observable<StudentAssessmentsResponse>;
  getCurrentStudentAssessments(): Observable<CurrentStudentAssessment[]>;
}

export const STUDENT_ASSESSMENT_BUSINESS_TOKEN = new InjectionToken<IStudentAssessmentBusiness>(
  'IStudentAssessmentBusiness'
);
