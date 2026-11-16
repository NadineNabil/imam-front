export type QuestionAnswerStatus = 'correct' | 'wrong' | 'skipped';

export interface StudentQuestionAnswerReport {
  id: number;
  questionText: string;
  isCorrect: boolean | null;
  userAnswer?: string | null;
  correctAnswer?: string | null;
  explanation?: string | null;
  videoUrl?: string | null;
  status: QuestionAnswerStatus;
}

export interface StudentObjectiveReport {
  objectiveName: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  percent: number;
  color?: string;
  questions: StudentQuestionAnswerReport[];
}

export interface StudentExamReport {
  examId: number;
  attemptId?: number | string | null;
  examName?: string;
  attemptNumber: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  scorePercent: number;
  isPassed: boolean;
  passPercentage: number;
  durationSeconds?: number | string | null;
  timeTakenFormatted?: string;
  objectives: StudentObjectiveReport[];
  allAttempts?: StudentExamReport[];
}
