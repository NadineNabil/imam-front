import { CognitiveStyle } from "src/app/domain/enums/cognitive-style.enum";
import { AssessmentSettingsResponseDto } from "./assessment-setting.response.dto";
import { PracticeSettingsResponseDto } from "./practice-settings.response.dto";
import { BaseOptionsSettingsResponseDto } from "./BaseOptionsSettings.response.dto";

export interface ExamDetailsResponseDto {
  id: number;
  name: string;
  exam_source: string;
  exam_type: string;
  is_active: boolean;
  exam_status: string;
  exam_objectives: {
    id: number;
    title: string;
    cognitive_style: CognitiveStyle | null;
    file_name: string|null;
    weight: string;
    questions: any[];
  }[];
    scheduled_date?: Date |string| null;
   scheduleTime?: string | null;
    end_date?: Date |string| null;
   endTime?: string | null;
   options_settings?: BaseOptionsSettingsResponseDto | undefined;
}
