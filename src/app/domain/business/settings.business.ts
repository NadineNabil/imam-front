import { Observable } from "rxjs";
import { ISettingsBusiness } from "../business-contracts/settings-business.contract";
import { ApiResponse } from "../entities/api-response.entity";
import { BaseOptionsSettings } from "../entities/BaseSettingOptionsSettings.entity";
import { ISettingsRepository, SETTINGS_REPOSITORY_TOKEN } from "../repository-contracts/settings.repository.contract";
import { Inject, Injectable } from "@angular/core";

 @Injectable({ providedIn: 'root' })

export class SettingsBusiness implements ISettingsBusiness {
    constructor(@Inject(SETTINGS_REPOSITORY_TOKEN) private readonly settingsRepository: ISettingsRepository) {}
    setSettings(examId: number, settings: BaseOptionsSettings): Observable<ApiResponse> {
        return this.settingsRepository.setSettings(examId, settings);
    }
}