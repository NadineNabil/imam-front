import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";
import { LearningUnits } from "../entities/learningUnits.entity";

export interface ILearningUnitBusiness {
    getAllLearningUnits(): Observable<LearningUnits[]>;
    getLearningUnitsByCourseId(courseId: number): Observable<LearningUnits[]>;
    
    getAll(courseId: number): Observable<LearningUnits[]>;
      
    create(lessonTitle: string, courseId: number): Observable<LearningUnits>;
      
    getById(learningUnitId: number): Observable<LearningUnits | null>;
    
    update(learningUnitData: any): Observable<LearningUnits>;
}
export const LEARNING_UNIT_BUSINESS_TOKEN = new InjectionToken<ILearningUnitBusiness>(
  'ILearningUnitBusiness'
);
