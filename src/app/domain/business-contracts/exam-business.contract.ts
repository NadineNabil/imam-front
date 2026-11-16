import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";

import { Exam ,DuplicateExam} from "src/app/domain/entities/exam.entity";
import { ApiResponse } from "../entities/api-response.entity";
import { SharedPagination } from "../entities/shared-pagination.entity";
import { PagedResult } from "../entities/PagedResult.entity";
import { Objective } from "../entities/objective.entity";

export interface IExamBusiness{
      createExam(Exam:Exam):Observable<ApiResponse>
      getAllExams(pagination: SharedPagination): Observable<PagedResult<Exam>>;
      getExamById(id: number): Observable<Exam>;
      retryExam(id: number): Observable<ApiResponse>;
      updateQuestions(id:number,objectives:Objective[]): Observable<ApiResponse>;
      duplicateExam(id: number): Observable<DuplicateExam>;
      activateExam(id:number, isActive: boolean): Observable<ApiResponse>;

}
export const EXAM_BUSINESS_TOKEN = new InjectionToken<IExamBusiness>(
  'IExamBusiness'
);







