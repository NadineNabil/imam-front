import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiConfig } from "../config";
import { SettingsRequestDto } from "../dto/request/settings.request.dto";

@Injectable({ providedIn: 'root' })
export class SettingsApiService {
    constructor(private readonly http: HttpClient, private readonly apiConfig: ApiConfig
    ){}
setSettings(examId: number, settings: SettingsRequestDto): any {
    return this.http.put(
      this.apiConfig.getUrl(this.apiConfig.endpoints.exams.setSettings(examId)),
      settings
    );
  }

}