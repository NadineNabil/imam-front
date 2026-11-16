import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentExamReport } from '../entities/student-exam-report.entity';

export interface IStudentExamReportBusiness {
  getStudentExamReport(examId: number): Observable<StudentExamReport>;
  getStudentTrainingReport(trainingId: number, attemptId: number | string): Observable<StudentExamReport>;
}

export const STUDENT_EXAM_REPORT_BUSINESS_TOKEN = new InjectionToken<IStudentExamReportBusiness>(
  'IStudentExamReportBusiness'
);
