import { InjectionToken } from "@angular/core"
import { Observable } from "rxjs"
import { Exam,DuplicateExam } from "../entities/exam.entity"
import { ApiResponse } from "../entities/api-response.entity"
import { PagedResult } from "../entities/PagedResult.entity"
import { SharedPagination } from "../entities/shared-pagination.entity"
import { Objective } from "../entities/objective.entity"

export interface IExamRepository{
    createExam(Exam:Exam):Observable<ApiResponse>
      getAllExams(pagination: SharedPagination): Observable<PagedResult<Exam>>;
      getExamById(id: number): Observable<Exam>;
      retryExam(id: number): Observable<ApiResponse>;
      updateQuestions(id:number,objectives:Objective[]): Observable<ApiResponse>;
      duplicateExam(id: number): Observable<DuplicateExam> ;
      activateExam(id:number, isActive: boolean):Observable<ApiResponse>;

}
export const EXAM_REPOSITORY_TOKEN = new InjectionToken<IExamRepository>('IExamRepository')
