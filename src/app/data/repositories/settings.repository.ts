import { Injectable } from "@angular/core";
import { SettingsApiService } from "../api/settings.api.service";
import { BaseOptionsSettings } from "src/app/domain/entities/BaseSettingOptionsSettings.entity";
import { SettingsMapper } from "../mappers/settings.mapper";
import { ISettingsRepository } from "src/app/domain/repository-contracts/settings.repository.contract";
import { ApiResponse } from "src/app/domain/entities/api-response.entity";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SettingsRepositoryImpl implements ISettingsRepository {
    constructor(private readonly settingsApiService: SettingsApiService) {}
    setSettings(examId: number, settings: BaseOptionsSettings):  Observable<ApiResponse> {
       return this.settingsApiService.setSettings(examId, SettingsMapper.toRequest(settings));
      }
}