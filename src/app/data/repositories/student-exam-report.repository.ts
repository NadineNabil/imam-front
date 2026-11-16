import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IStudentExamReportRepository } from 'src/app/domain/repository-contracts/student-exam-report-repository.contract';
import { StudentExamReport } from 'src/app/domain/entities/student-exam-report.entity';
import { StudentService } from '../api/student-api.service';
import { StudentExamReportMapper } from '../mappers/student-exam-report.mapper';

@Injectable()
export class StudentExamReportRepository implements IStudentExamReportRepository {
  constructor(private readonly studentService: StudentService) {}

  getStudentExamReport(examId: number): Observable<StudentExamReport> {
    return this.studentService.getStudentExamReport(examId).pipe(
      map((res) => StudentExamReportMapper.mapToDomain(res, examId))
    );
  }

  getStudentTrainingReport(trainingId: number, attemptId: number | string): Observable<StudentExamReport> {
    return this.studentService.getStudentTrainingReport(trainingId, attemptId).pipe(
      map((res) => StudentExamReportMapper.mapToDomain(res, trainingId))
    );
  }
}
