import { Observable } from "rxjs";
import { ApiResponse } from "src/app/domain/entities/api-response.entity";
import { ApiConfig } from "../config";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ScheduleDateRequestDto } from "../dto/request/schedule-date.request.dto";

@Injectable({ providedIn: 'root' })
export class ScheduleApiService {
    constructor(private readonly http: HttpClient, private readonly apiConfig: ApiConfig
    ){}
updateDate(examId:number,scheduledDate:ScheduleDateRequestDto): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.exams.updateSchedule(examId)),
       scheduledDate 
    );
  }
}