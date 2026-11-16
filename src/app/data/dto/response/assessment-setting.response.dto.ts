
export interface AssessmentSettingsResponseDto {
  exam_id: number;
  timelimit_minutes: string;
  exam_timelimit: {
    hours: number;
    minutes: number;
  };
  question_time_limit: string;
  enable_copy_cut_paste: boolean;
  randomize_question_sequence: boolean;
  randomize_answer_choices: boolean;
  enable_spell_check_for_essay: boolean;
  allow_backward_navigation: boolean;
  enable_missing_answer_reminder: boolean;
}

 
