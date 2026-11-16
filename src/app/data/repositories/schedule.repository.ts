
import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ApiResponse } from "src/app/domain/entities/api-response.entity";
import { IScheduleRepository } from "src/app/domain/repository-contracts/schedule-repository-contract";
import { ScheduleApiService } from "../api/schedule-api.service";
import { ScheduleDateMapper } from "../mappers/schedule-date.mapper";

@Injectable({ providedIn: 'root' })
export class ScheduleRepositoryImpl  implements IScheduleRepository{
    constructor (private scheduleApiService: ScheduleApiService){}
 
    updateDate(examId:number,  scheduleDate: string,
  scheduleTime: string,endDate:string,endTime:string): Observable<ApiResponse> {
      return this.scheduleApiService.updateDate(examId,ScheduleDateMapper.toRequestDto(scheduleDate,scheduleTime,endDate,endTime));
    }
 }