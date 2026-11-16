import { Injectable, Inject } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { Exam,DuplicateExam } from "src/app/domain/entities/exam.entity";
import { EXAM_REPOSITORY_TOKEN, IExamRepository } from "src/app/domain/repository-contracts/exam-repository.contract";
import { IExamBusiness } from "../business-contracts/exam-business.contract";
import { ApiResponse } from "../entities/api-response.entity";
import { SharedPagination } from "../entities/shared-pagination.entity";
import { PagedResult } from "../entities/PagedResult.entity";
import { Objective } from "../entities/objective.entity";

@Injectable({ providedIn: 'root' })
export class ExamBusiness implements IExamBusiness {

  constructor(
     @Inject(EXAM_REPOSITORY_TOKEN) private readonly examRepository: IExamRepository
  ) {}

  createExam(exam: Exam): Observable<ApiResponse> {

    // 🔥 Example business validation
    if (!exam.examName || exam.examName.trim() === '') {
      throw new Error('Exam name is required');
    }

    return this.examRepository.createExam(exam);
  }
    getAllExams(pagination: SharedPagination): Observable<PagedResult<Exam>> {
    return this.examRepository.getAllExams(pagination).pipe(
      catchError(error => {
        console.error('Exam business error', error);
        return throwError(() => new Error('Failed to load exams'));
      })
    );
  }
  getExamById(id: number): Observable<Exam> {
    return this.examRepository.getExamById(id).pipe(
      catchError(error => {
        return throwError(() => new Error(error));
      })
    );
}
  retryExam(id: number): Observable<ApiResponse> {
    return this.examRepository.retryExam(id).pipe(
      catchError(error => {
        return throwError(() => new Error(error));
      }));
  }
  updateQuestions(id: number, objectives: Objective[]): Observable<ApiResponse> {
    return this.examRepository.updateQuestions(id, objectives).pipe(
      catchError(error => {
        return throwError(() => new Error(error));
        })
      );}
duplicateExam(id: number): Observable<DuplicateExam> {
    return this.examRepository.duplicateExam(id).pipe(
      catchError(error => {
        return throwError(() => new Error(error));
      })
    );
}
  activateExam(id: number, isActive: boolean): Observable<ApiResponse> {
    return this.examRepository.activateExam(id,isActive).pipe(
      catchError(error => {
        return throwError(() => new Error(error));
      })
    );
  }
}
