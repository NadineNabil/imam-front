import { Observable } from "rxjs";
import { Objective } from "../entities/objective.entity";
import { InjectionToken } from "@angular/core";

export interface IObjectiveBusiness{
    getObjectivesByCourseId(courseId:number):Observable<Objective[]>
     getObjectivesByCourseIdAndUnits(courseId: number, unitIds?: number[]): Observable<Objective[]>;
    }
export const OBJECTIVE_BUSINESS_TOKEN = new InjectionToken<IObjectiveBusiness>('IObjectiveBusiness')