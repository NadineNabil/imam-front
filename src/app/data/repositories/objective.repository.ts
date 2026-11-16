import { Objective } from "src/app/domain/entities/objective.entity";
import { IObjectiveRepository } from "src/app/domain/repository-contracts/objective-repository.contract";
import { ObjectiveApiService } from "../api/objective-api.service";
import { ObjectiveMapper } from "../mappers/objective.mapper";
import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ObjectiveRepositoryImpl  implements IObjectiveRepository{
    constructor (private objectiveApiService: ObjectiveApiService){} 
    getObjectives(courseId: number): Observable<Objective[]> {
    return   this.objectiveApiService.getObjectivesByCourseId(courseId).pipe(
        map((dto)=>ObjectiveMapper.fromResponseList(dto))
      )
    }
    getObjectivesByCourseIdAndUnits(courseId: number,unitIds?: number[]): Observable<Objective[]> {
   return this.objectiveApiService.getObjectivesByCourseIdAndUnits(courseId,unitIds).pipe(
        map((dto)=>ObjectiveMapper.fromResponseList(dto))
      )
    }
}