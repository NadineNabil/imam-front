import { Observable } from "rxjs";
import { Inject, Injectable } from "@angular/core";
import { LEARNING_UNIT_REPOSITORY_TOKEN, ILearningUnitRepository } from "../repository-contracts/learning-unit-repository.contract";
import { LearningUnits } from "../entities/learningUnits.entity";
import { ILearningUnitBusiness } from "../business-contracts/learning-unit-business.contract";

@Injectable({ providedIn: 'root' })
export class LearningUnitBusiness implements ILearningUnitBusiness {
    constructor(@Inject(LEARNING_UNIT_REPOSITORY_TOKEN) private readonly learningUnitRepository: ILearningUnitRepository){}
    
    getAllLearningUnits(): Observable<LearningUnits[]> {
        return this.learningUnitRepository.getAll();
    }

    getLearningUnitsByCourseId(courseId: number): Observable<LearningUnits[]> {
        return this.learningUnitRepository.getByCourseId(courseId);
    }
    getById(learningUnitId: number): Observable<LearningUnits | null> {
        return this.learningUnitRepository.getById(learningUnitId);
      }
      update( lessonData: any): Observable<LearningUnits> {
        return this.learningUnitRepository.update( lessonData);
      }
      
      create(lessonTitle: string, courseId: number): Observable<LearningUnits> {
        return this.learningUnitRepository.create(lessonTitle, courseId);
      }
       
     getAll(courseId: number): Observable<LearningUnits[]> {
            return this.learningUnitRepository.getAllLearningUnits(courseId);
        }
}
