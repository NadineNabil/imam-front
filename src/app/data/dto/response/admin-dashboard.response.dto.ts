export interface AdminKpisDto {
  registered_user_count: number;
  active_student_count: number;
  course_count: number;
  active_exam_count: number;
  average_mastery_rate: number;
  pending_invitation_count: number;
}

export interface AdminExamActivityDto {
  period?: string;
  exam_type?: string;
  data?: any;
  categories?: string[];
  counts?: number[];
  series?: any[];
  [key: string]: any;
}

export interface AdminEnrollmentActivityDto {
  period?: string;
  data?: any;
  categories?: string[];
  counts?: number[];
  series?: any[];
  [key: string]: any;
}

export interface AdminTopCourseDto {
  id?: number | string;
  course_id?: number | string;
  course_name?: string;
  name?: string;
  code?: string;
  course_code?: string;
  enrolled_students?: number;
  student_count?: number;
  average_mastery_rate?: number;
  avg_mastery?: number;
  average_score?: number;
  avg_score?: number;
  [key: string]: any;
}
