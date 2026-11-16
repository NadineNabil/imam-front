import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { LearningUnitResponseDto } from "src/app/data/dto/response/learning-unit.response.dto";
import { LearningUnits } from "../entities/learningUnits.entity";

export interface ILearningUnitRepository {
    getAll(): Observable<LearningUnits[]>;
    getByCourseId(courseId: number): Observable<LearningUnits[]>;
    getAllLearningUnits(courseId: number): Observable<LearningUnits[]>;
    
    create(learningUnitsTitle: string, courseId: number): Observable<LearningUnits>;
    
    getById(learningUnitsId: number): Observable<LearningUnits | null>;
    
    update( learningUnitsData: any): Observable<LearningUnits>;
}
export const LEARNING_UNIT_REPOSITORY_TOKEN = new InjectionToken<ILearningUnitRepository>('ILearningUnitRepository');
