import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { LearningUnitApiService } from "../api/learning-unit-api.service";
import { ILearningUnitRepository } from "src/app/domain/repository-contracts/learning-unit-repository.contract";
import { LearningUnitMapper } from "../mappers/learning-unit.mapper";
import { LearningUnits } from "src/app/domain/entities/learningUnits.entity";

@Injectable({ providedIn: 'root' })
export class LearningUnitRepositoryImpl implements ILearningUnitRepository {
    constructor (private learningUnitApiService: LearningUnitApiService) { }
    
    getAll(): Observable<LearningUnits[]> {
        return this.learningUnitApiService.getAll().pipe(
            map(dto=>{
                return LearningUnitMapper.fromResponseDtoList(dto);  
            })
        )
    }

    getByCourseId(courseId: number): Observable<LearningUnits[]> {
        return this.learningUnitApiService.getByCourseId(courseId).pipe(
            map(dto=>{
                return LearningUnitMapper.fromResponseDtoList(dto);  
            })
        )
    }

    getById(learningUnitsId: number): any{
            return this.learningUnitApiService.getDetails(learningUnitsId)
        }
        
        update(learningUnitsData:any): Observable<LearningUnits> {
            return this.learningUnitApiService.edit(learningUnitsData)
    
        }
    
    
        create(learningUnitsTitle: string, courseId: number): Observable<LearningUnits> {
            return this.learningUnitApiService.create(learningUnitsTitle, courseId).pipe(
                map((response:any) => LearningUnitMapper.fromCreateLearningUnitResponse(response))
            );
        }
    
        getAllLearningUnits(courseId: number): Observable<LearningUnits[]> {
            return this.learningUnitApiService.getAllLearningUnits(courseId).pipe(
                map(response => LearningUnitMapper.fromLearningUnitListResponse(response))
            );
        }
    
}







