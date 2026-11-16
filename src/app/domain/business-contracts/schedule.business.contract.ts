
import { InjectionToken } from "@angular/core";
import { ApiResponse } from "../entities/api-response.entity";
import { Observable } from "rxjs";
export interface IScheduleBusiness {
       updateDate(examId:number,  scheduleDate: string,
  scheduleTime: string,endDate:string,endTime:string): Observable<ApiResponse>
}
export const SCHEDULE_BUSINESS_TOKEN = new InjectionToken<IScheduleBusiness>('IScheduleBusiness')