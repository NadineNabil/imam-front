import { Inject, Injectable } from "@angular/core";
import { IObjectiveBusiness } from "../business-contracts/objective-business.contract";
import { Observable } from "rxjs";
import { Objective } from "../entities/objective.entity";
import { IObjectiveRepository, OBJECTIVE_REPOSITORY_TOKEN } from "../repository-contracts/objective-repository.contract";

@Injectable({ providedIn: 'root' })
export class ObjectiveBusiness implements IObjectiveBusiness{
    constructor( @Inject(OBJECTIVE_REPOSITORY_TOKEN) private readonly objectiverepo: IObjectiveRepository ){}
    getObjectivesByCourseId(courseId: number): Observable<Objective[]> {
      return this.objectiverepo.getObjectives(courseId)
    }

    getObjectivesByCourseIdAndUnits(courseId: number, unitIds?: number[]): Observable<Objective[]> {
  if (!unitIds || unitIds.length === 0) {
    // fallback to courseId only if no units selected
    return this.getObjectivesByCourseId(courseId);
  }

  // Call repository method with courseId + unitIds
  return this.objectiverepo.getObjectivesByCourseIdAndUnits(courseId, unitIds);
}
}