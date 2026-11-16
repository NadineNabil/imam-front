import { Injectable } from "@angular/core";
import { ExamRequestDto } from "../dto/request/exam.request.dto";
import { ApiConfig } from "../config";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, delay, Observable, of, shareReplay, throwError } from "rxjs";
import { ApiResponse } from "src/app/domain/entities/api-response.entity";
import { PaginationRequestDto } from "../dto/request/pagination.request.dto";
import { ExamsApiResponseDto ,ExamResponseDto,DuplicateExamResponseDto} from "../dto/response/exam.response.dto";
import { ExamDetailsResponseDto } from "../dto/response/exam-details.respomse.dto";
import { ObjectiveRequestDto } from "../dto/request/objective.request.dto";
import { ExamActivationRequestDto } from "../dto/request/activation.request.dto";

@Injectable({ providedIn: 'root' })
export class ExamApiService {
  constructor(private apiConfig: ApiConfig, private http: HttpClient,) { }
  createExam(Dto: ExamRequestDto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.exams.createExam),
      Dto
    );
  }
  getAllExams(pagination: PaginationRequestDto): Observable<ExamsApiResponseDto> {
    const params = new HttpParams()
      .set('page_no', pagination.page_no.toString())
      .set('page_size', pagination.page_size.toString())
      .set(
        'search_term',
        pagination.search_term != null
          ? pagination.search_term.toString()
          : ''
      )
    return this.http.get<ExamsApiResponseDto>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.exams.base),
      { params }
    ).pipe(
      shareReplay(),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
  //related to exam details page

getExamById(id: number): Observable<ExamDetailsResponseDto> {
  return this.http.get<ExamDetailsResponseDto>(
    this.apiConfig.getUrl(this.apiConfig.endpoints.exams.base + `${id}`)
  );
}

duplicateExam(exam_id:number):Observable<DuplicateExamResponseDto> 
{
     return this.http.post<DuplicateExamResponseDto>(
    this.apiConfig.getUrl(this.apiConfig.endpoints.exams.duplicate(exam_id)),
    {}
  );
}
retryExam(id: number): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(
    this.apiConfig.getUrl(this.apiConfig.endpoints.exams.retryExam(id)),
    {}
  );
}
updateQuestions(id:number,objectives:ObjectiveRequestDto[]): Observable<ApiResponse>{
return this.http.put<ApiResponse>(
  this.apiConfig.getUrl(this.apiConfig.endpoints.exams.updateQuestions(id)),
  { exam_objectives:objectives }
);
}
 activateExam(id:number,activationStatus:ExamActivationRequestDto): Observable<ApiResponse>{
return this.http.put<ApiResponse>(
  this.apiConfig.getUrl(this.apiConfig.endpoints.exams.activate(id)),activationStatus
);
} 
  }