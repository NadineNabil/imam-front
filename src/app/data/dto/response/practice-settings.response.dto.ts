import { AssessmentSettingsResponseDto } from "./assessment-setting.response.dto";

export interface PracticeSettingsResponseDto extends AssessmentSettingsResponseDto {
  is_limited_attempts: boolean;
  num_of_attempt: number;
}