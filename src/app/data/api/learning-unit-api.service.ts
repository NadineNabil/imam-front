import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, delay, Observable, of, shareReplay, throwError } from "rxjs";
import { LearningUnitListResponseDto, LearningUnitResponseDto } from "../dto/response/learning-unit.response.dto";
import { TranslateService } from "@ngx-translate/core";
import { ApiConfig } from "../config";

@Injectable({ providedIn: 'root' })
export class LearningUnitApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig:ApiConfig,
    private translate:TranslateService
  ) { }

  getAll(): Observable<LearningUnitResponseDto[]> {
    const mockLearningUnits: LearningUnitResponseDto[] = [
/*       { id: 1, name: 'Unit 1', learningUnitDescription: 'Description 1', course_Id: 1 },
      { id: 2, name: 'Unit 2', learningUnitDescription: 'Description 2', course_Id: 1 },
      { id: 3, name: 'Unit 3', learningUnitDescription: 'Description 3', course_Id: 1 } */
    ];

    return of(mockLearningUnits).pipe(
      delay(500),
      shareReplay(),
      catchError(error => {
        console.error('Mock API error', error);
        return throwError(() => error);
      })
    );
  }



    create(name: string, course_id: number): Observable<LearningUnitListResponseDto> {
       const lang =  this.translate.currentLang ??this.translate.defaultLang ??'en';
     
      const headers = new HttpHeaders({ 'Accept-Language': lang });
  
      return this.http.post<LearningUnitListResponseDto>(this.apiConfig.getUrl(this.apiConfig.endpoints.learningUnits.create), { name, course_id }  , { headers });
      }
  
      getAllLearningUnits(courseId: number): Observable<LearningUnitListResponseDto> {
         return  this.http.get<LearningUnitListResponseDto>( this.apiConfig.getUrl(this.apiConfig.endpoints.learningUnits.getAllLearningUnits(courseId)));
      }
  
      getDetails(learningUnitsId: number): Observable<LearningUnitListResponseDto> {
          return this.http.get<LearningUnitListResponseDto>(this.apiConfig.getUrl(this.apiConfig.endpoints.learningUnits.details(learningUnitsId)));
      }
  
      edit(learningUnitsData:any): any {
          return this.http.put<LearningUnitListResponseDto>(this.apiConfig.getUrl(this.apiConfig.endpoints.learningUnits.editLearningUnit),learningUnitsData);
      }
    getByCourseId(courseId: number): Observable<LearningUnitResponseDto[]> {
     return this.http
      .get<LearningUnitResponseDto[]>(
        this.apiConfig.getUrl(
          this.apiConfig.endpoints.learningunits.getLearningUnit + `${courseId}`
        )
      )
      .pipe(
        shareReplay(),
        catchError(error => {
          console.error('learningunits API error', error);
          return throwError(() => error);
        })
      );
  }


}
