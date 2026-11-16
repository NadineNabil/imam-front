import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentExamReport } from '../entities/student-exam-report.entity';

export interface IStudentExamReportRepository {
  getStudentExamReport(examId: number): Observable<StudentExamReport>;
  getStudentTrainingReport(trainingId: number, attemptId: number | string): Observable<StudentExamReport>;
}

export const STUDENT_EXAM_REPORT_REPOSITORY_TOKEN = new InjectionToken<IStudentExamReportRepository>(
  'IStudentExamReportRepository'
);
