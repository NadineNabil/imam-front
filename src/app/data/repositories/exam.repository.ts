import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { Exam ,DuplicateExam} from "src/app/domain/entities/exam.entity";
import { IExamRepository } from "src/app/domain/repository-contracts/exam-repository.contract";
import { ExamMapper } from "../mappers/exam.mapper";
import { ExamApiService } from "../api/exam-api.service";
import { ApiResponse } from "src/app/domain/entities/api-response.entity";
import { PagedResult } from "src/app/domain/entities/PagedResult.entity";
import { SharedPagination } from "src/app/domain/entities/shared-pagination.entity";
import { PaginationMapper } from "../mappers/pagination.mapper";
import { Objective } from "src/app/domain/entities/objective.entity";

@Injectable({ providedIn: 'root' })
export class ExamRepositoryImpl implements IExamRepository {
    constructor(private examApiService:ExamApiService){}

   createExam(exam: Exam): Observable<ApiResponse> {

    const dto = ExamMapper.toRequestDto(exam);

    //  Just return the API response directly
    return this.examApiService.createExam(dto);
  }
    getAllExams(pagination: SharedPagination): Observable<PagedResult<Exam>> {
    const dto = PaginationMapper.toRequest(pagination);

    return this.examApiService.getAllExams(dto).pipe(
      map(apiResponse => ({
        items: ExamMapper.fromResponseDtoList(apiResponse.exams),
        totalItems: apiResponse.total_count
      })),
      catchError(error => {
        console.error('Exam repository error', error);
        return throwError(() => error);
      })
    );
  }
  getExamById(id: number): Observable<Exam> {
    return this.examApiService.getExamById(id).pipe(
      map(apiResponse => ExamMapper.fromDetailsResponseDto(apiResponse)),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
  retryExam(id: number): Observable<ApiResponse> {
    return this.examApiService.retryExam(id).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
        updateQuestions(id: number, objectives: Objective[]): Observable<ApiResponse> {
    return this.examApiService.updateQuestions(id,ExamMapper.objectivesToRequestDto(objectives)).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  duplicateExam(id: number): Observable<DuplicateExam> {
    return this.examApiService.duplicateExam(id).pipe(
      map(apiResponse => ExamMapper.fromExamResponseDto(apiResponse)),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
  activateExam(id:number, isActive: boolean){
  const dto = ExamMapper.toActivationDto(isActive);
  return this.examApiService.activateExam(id, dto).pipe(
      catchError(error => {
      return throwError(() => error);
      })
  )
  }
    
}
