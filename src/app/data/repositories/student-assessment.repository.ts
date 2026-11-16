import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentService } from '../api/student-api.service';
import { GetStudentAssessmentsPayload, StudentAssessmentsResponse } from '../../domain/business-contracts/student-assessment.business.contract';
import { IStudentAssessmentRepository } from '../../domain/repository-contracts/student-assessment.repository.contract';
import { CurrentStudentAssessment } from '../../domain/entities/student-assessment.entity';

@Injectable({ providedIn: 'root' })
export class StudentAssessmentRepository implements IStudentAssessmentRepository {
  constructor(private readonly studentService: StudentService) {}

  getStudentAssessments(payload: GetStudentAssessmentsPayload): Observable<StudentAssessmentsResponse> {
    return this.studentService.getStudentAssessments(payload);
  }

  getCurrentStudentAssessments(): Observable<CurrentStudentAssessment[]> {
    return this.studentService.getCurrentStudentAssessments();
  }
}
