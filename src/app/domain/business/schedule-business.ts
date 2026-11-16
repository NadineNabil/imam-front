import { Observable } from "rxjs";
import { IScheduleBusiness } from "../business-contracts/schedule.business.contract";
import { ApiResponse } from "../entities/api-response.entity";
import { Inject, Injectable } from "@angular/core";
import { IScheduleRepository, SCHEDULE_REPOSITORY_TOKEN } from "../repository-contracts/schedule-repository-contract";


 @Injectable({ providedIn: 'root' })

export class ScheduleBusiness implements IScheduleBusiness {
    constructor(@Inject(SCHEDULE_REPOSITORY_TOKEN) private readonly scheduleRepository: IScheduleRepository){}
     updateDate(examId: number, scheduledDate: string,scheduleTime:string,endDate: string,endTime:string): Observable<ApiResponse> {
         return this.scheduleRepository.updateDate(examId,scheduledDate,scheduleTime,endDate,endTime);
     }
  
}