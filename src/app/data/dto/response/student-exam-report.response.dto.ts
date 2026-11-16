export interface StudentQuestionAnswerDto {
  QuestionId?: number;
  question_id?: number;
  id?: number;
  QuestionText?: string;
  question?: string;
  questionText?: string;
  IsCorrect?: boolean | null;
  isCorrect?: boolean | null;
  is_correct?: boolean | null;
  StudentAnswer?: string | null;
  studentAnswer?: string | null;
  userAnswer?: string | null;
  user_answer?: string | null;
  CorrectAnswer?: string | null;
  correctAnswer?: string | null;
  correctAnswerText?: string | null;
  correct_answer?: string | null;
  explain?: string | null;
  explanation?: string | null;
  videoUrl?: string | null;
  video_url?: string | null;
}

export interface StudentExamObjectiveDto {
  ObjectiveId?: number;
  id?: number;
  objective_id?: number;
  ObjectiveName?: string;
  objectiveName?: string;
  objective_name?: string;
  total_questions?: number;
  questionsCount?: number;
  questions_count?: number;
  correct_answers?: number;
  correctAnswerCount?: number;
  correct_answer_count?: number;
  incorrect_answers?: number;
  unanswered_questions?: number;
  studentQuestionAnswers?: StudentQuestionAnswerDto[];
  student_question_answers?: StudentQuestionAnswerDto[];
  questions?: StudentQuestionAnswerDto[];
}

export interface StudentExamReportResponseDto {
  exam_id?: number;
  examId?: number;
  student_id?: number;
  studentId?: number;
  exam_name?: string;
  examName?: string;
  attemptNumber?: number;
  attempt_number?: number;
  student_score?: number | string;
  score?: number | string;
  percent?: number;
  total_questions?: number;
  totalQuestions?: number;
  questionsCount?: number;
  correct_answers?: number;
  correctAnswers?: number;
  correctAnswerCount?: number;
  incorrect_answers?: number;
  unanswered_questions?: number;
  pass_percentage?: number;
  passPercentage?: number;
  is_passed?: boolean;
  isPassed?: boolean;
  duration_seconds?: number | string;
  durationMinutes?: number;
  time_taken?: string | number;
  timeTaken?: string | number;
  studentExamObjectives?: StudentExamObjectiveDto[];
  objectives?: StudentExamObjectiveDto[];
}
