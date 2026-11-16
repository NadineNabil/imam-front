export enum StudentAssessmentStatus {
  ALL = 'All',
  COMPLETED = 'Completed',
  SUBMITTED = 'Submitted',
  NOT_STARTED = 'Not Started',
  EXPIRED = 'Expired',
  SCHEDULED = 'Scheduled'
}

export interface StudentAssessment {
  exam_id: number;
  exam_name: string;
  course_name: string;
  start_date: string | null;
  status: StudentAssessmentStatus;
  date_taken: string | null;
  score: number | null;
  has_passed: boolean;
}

export interface CurrentStudentAssessment {
  exam_id: number;
  exam_name: string;
}
