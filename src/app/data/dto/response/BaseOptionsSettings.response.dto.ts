export interface BaseOptionsSettingsResponseDto {
 exam_id: number;
  exam_timelimit: {
    hours: number;
    minutes: number;
  };
  question_time_limit: string;
  enable_copy_cut_paste: boolean;
  randomize_question_sequence: boolean;
  randomize_answer_choices: boolean;
  enable_spell_check_for_essay: boolean;
  enable_missing_answer_reminder: boolean;
  is_limited_attempts: boolean ;
  num_of_attempt: number | null;
}