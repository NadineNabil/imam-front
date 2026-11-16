export enum StudentTrainingStatus {
  ALL = 'All',
  COMPLETED = 'Completed',
  NOT_STARTED = 'Not Started',
  SCHEDULED = 'Scheduled',
  EXPIRED = 'Expired'
}

export interface StudentTraining {
  exam_id: number;
  exam_name: string;
  course_name: string;
  start_date: string | null;
  status: StudentTrainingStatus | string;
  last_attempt_date: string | null;
  last_score: number | null;
  attempts: number;
  can_retake: boolean;
}

export interface CurrentStudentTraining {
  exam_id: number;
  exam_name: string;
}
