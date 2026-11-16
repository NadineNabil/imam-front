import { Observable } from "rxjs";
import { ApiResponse } from "../entities/api-response.entity";
import { InjectionToken } from "@angular/core";

export interface IScheduleRepository{
updateDate(examId:number,scheduleDate: string,
  scheduleTime: string,endDate:string,endTime:string): Observable<ApiResponse>;
}
export const SCHEDULE_REPOSITORY_TOKEN = new InjectionToken<IScheduleRepository>('IScheduleRepository')