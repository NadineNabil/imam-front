import { InjectionToken } from "@angular/core";
import { Objective } from "../entities/objective.entity";
import { Observable } from "rxjs";

export interface IObjectiveRepository{
    getObjectives(courseId:number):Observable<Objective[]>
    getObjectivesByCourseIdAndUnits(courseId:number,unitIds?: number[]):Observable<Objective[]>
}
export const OBJECTIVE_REPOSITORY_TOKEN = new InjectionToken<IObjectiveRepository>('IObjectiveRepository')
