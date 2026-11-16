import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ILessonsRepository } from 'src/app/domain/repository-contracts/lessons-repository.contract';
import { LessonApiService } from '../api/lesson-api.service';
import { Lesson } from 'src/app/domain/entities/lessons.entity';
import { LessonMapper } from '../mappers/lesson.mapper';


@Injectable({ providedIn: 'root' })
export class LessonRepositoryImpl implements ILessonsRepository {
  
    constructor(private readonly lessonApi: LessonApiService) {}
    
    getById(lessonId: string): any{
        return this.lessonApi.getLessonDetails(lessonId)
    }
    
    update(lessonData:any): Observable<Lesson> {
        return this.lessonApi.editLesson(lessonData)

    }


    create(lessonTitle: string, subjectId: number): Observable<Lesson> {
        return this.lessonApi.AddNewLesson(lessonTitle, subjectId).pipe(
            map((response:any) => LessonMapper.fromCreateLessonResponse(response))
        );
    }

    getAll(subjectId: number): Observable<Lesson[]> {
        return this.lessonApi.getLessonBySubjectId(subjectId).pipe(
            map(response => LessonMapper.fromLessonListResponse(response))
        );
    }

}           