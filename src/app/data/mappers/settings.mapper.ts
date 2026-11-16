import { BaseOptionsSettings } from "src/app/domain/entities/BaseSettingOptionsSettings.entity";
import { SettingsRequestDto } from "../dto/request/settings.request.dto";

export class SettingsMapper {

    static toRequest(settings: BaseOptionsSettings): SettingsRequestDto {
        return {
            exam_id: settings.examId,
            is_limited_attempts: settings.limitedAttempts,
            num_of_attempt: settings.attemptsNumber,
            timelimit_minutes: "0",
            exam_timelimit: {
                hours: settings.totalHours,
                minutes: settings.totalMinutes
            },
            question_time_limit: settings.perQuestionMinutes?.toString()||null,
            enable_copy_cut_paste: !settings.disableCopy,
            randomize_question_sequence: settings.randomizeQuestionOrder,
            randomize_answer_choices: settings.randomizeAnswerChoices,
            enable_spell_check_for_essay: settings.enableSpellCheck,
            enable_missing_answer_reminder: settings.missingAnswerReminder
        };
    }
}