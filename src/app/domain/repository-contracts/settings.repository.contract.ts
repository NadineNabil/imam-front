import { Observable } from "rxjs";
import { ApiResponse } from "../entities/api-response.entity";
import { BaseOptionsSettings } from "../entities/BaseSettingOptionsSettings.entity";
import { InjectionToken } from "@angular/core";

export interface ISettingsRepository {
    setSettings(examId: number, settings: BaseOptionsSettings):  Observable<ApiResponse>;
}
export const SETTINGS_REPOSITORY_TOKEN = new InjectionToken<ISettingsRepository>('ISettingsRepository')