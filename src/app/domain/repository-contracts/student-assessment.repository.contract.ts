import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { GetStudentAssessmentsPayload, StudentAssessmentsResponse } from '../business-contracts/student-assessment.business.contract';
import { CurrentStudentAssessment } from '../entities/student-assessment.entity';

export interface IStudentAssessmentRepository {
  getStudentAssessments(payload: GetStudentAssessmentsPayload): Observable<StudentAssessmentsResponse>;
  getCurrentStudentAssessments(): Observable<CurrentStudentAssessment[]>;
}

export const STUDENT_ASSESSMENT_REPOSITORY_TOKEN = new InjectionToken<IStudentAssessmentRepository>(
  'IStudentAssessmentRepository'
);
