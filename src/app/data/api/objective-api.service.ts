import { catchError, delay, Observable, of } from "rxjs";
import { ObjectiveResponseDto } from "../dto/response/objective.response.dto";
import { CognitiveStyle } from "src/app/domain/enums/cognitive-style.enum";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ApiConfig } from "../config";

@Injectable({ providedIn: 'root' })
export class ObjectiveApiService {
  constructor(    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfig){}

  private readonly allObjectives: any[] = [
    { id: 1, objectiveText: 'Objective 1', cognitiveStyle: CognitiveStyle.Create, courseId: 1 },
    { id: 2, objectiveText: 'Objective 2', cognitiveStyle: CognitiveStyle.Analyze, courseId: 1 },

    { id: 3, objectiveText: 'Objective 3', cognitiveStyle: CognitiveStyle.Apply, courseId: 2 },
    { id: 4, objectiveText: 'Objective 4', courseId: 2 },

    { id: 5, objectiveText: 'Objective 5', courseId: 3 }
  ];

  getObjectivesByCourseId(courseId: number): Observable<any[]> {
    let params = new HttpParams().set('course_id', courseId.toString());

    // Add multiple learning_units_ids parameters

    return this.http.get<ObjectiveResponseDto[]>(this.apiConfig.getUrl(this.apiConfig.endpoints.objective.getObjectives), { params });
  }
   // Fetch objectives by course + learning units
  getObjectivesByCourseIdAndUnits(courseId: number, unitIds?: number[]): Observable<ObjectiveResponseDto[]> {
    let params = new HttpParams().set('course_id', courseId.toString());

    // Add multiple learning_units_ids parameters
    if(unitIds){    unitIds.forEach(id => {
      params = params.append('learning_units_ids', id.toString());
    });
}

    return this.http.get<ObjectiveResponseDto[]>(this.apiConfig.getUrl(this.apiConfig.endpoints.objective.getObjectives), { params });
  }
}
