import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentExamReport } from '../entities/student-exam-report.entity';
import {
  IStudentExamReportBusiness
} from '../business-contracts/student-exam-report-business.contract';
import {
  IStudentExamReportRepository,
  STUDENT_EXAM_REPORT_REPOSITORY_TOKEN
} from '../repository-contracts/student-exam-report-repository.contract';

@Injectable()
export class StudentExamReportBusiness implements IStudentExamReportBusiness {
  constructor(
    @Inject(STUDENT_EXAM_REPORT_REPOSITORY_TOKEN)
    private readonly repository: IStudentExamReportRepository
  ) {}

  getStudentExamReport(examId: number): Observable<StudentExamReport> {
    return this.repository.getStudentExamReport(examId);
  }

  getStudentTrainingReport(trainingId: number, attemptId: number | string): Observable<StudentExamReport> {
    return this.repository.getStudentTrainingReport(trainingId, attemptId);
  }
}
