import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IStudentAssessmentBusiness, STUDENT_ASSESSMENT_BUSINESS_TOKEN, GetStudentAssessmentsPayload, StudentAssessmentsResponse } from '../business-contracts/student-assessment.business.contract';
import { IStudentAssessmentRepository, STUDENT_ASSESSMENT_REPOSITORY_TOKEN } from '../repository-contracts/student-assessment.repository.contract';

@Injectable({ providedIn: 'root' })
export class StudentAssessmentBusiness implements IStudentAssessmentBusiness {
  constructor(
    @Inject(STUDENT_ASSESSMENT_REPOSITORY_TOKEN)
    private readonly repository: IStudentAssessmentRepository
  ) {}

  getStudentAssessments(payload: GetStudentAssessmentsPayload): Observable<StudentAssessmentsResponse> {
    return this.repository.getStudentAssessments(payload);
  }

  getCurrentStudentAssessments() {
    return this.repository.getCurrentStudentAssessments();
  }
}
