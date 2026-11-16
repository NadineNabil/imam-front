import { Observable } from "rxjs";
import { ApiResponse } from "../entities/api-response.entity";
import { BaseOptionsSettings } from "../entities/BaseSettingOptionsSettings.entity";
import { InjectionToken } from "@angular/core";
export interface ISettingsBusiness {
    setSettings(examId: number, settings: BaseOptionsSettings):  Observable<ApiResponse>;
}
export const SETTINGS_BUSINESS_TOKEN = new InjectionToken<ISettingsBusiness>('ISettingsBusiness')