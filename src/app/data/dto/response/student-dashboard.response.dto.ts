/**
 * DTO for GET /student/summary response
 */
export interface StudentSummaryResponseDto {
  total_courses: number;
  exams_to_solve_count: number;
  completed_exams_count: number;
}

/**
 * DTO for a single item in GET /student/courses response
 */
export interface StudentCourseResponseDto {
  enrollment_id: number;
  course_id: number;
  course_name: string;
  course_image: string | null;
  enrolled_date: string;
  status: string;
  exam_count: number;
}

/**
 * DTO for a single item in GET /student/courses-details response
 */
export interface StudentCourseDetailsResponseDto {
  course_id: number;
  course_name: string;
  course_image: string | null;
  category_name: string | null;
  subcategory_name: string | null;
  learning_unit_count: number;
}

export interface StudentCourseExamResponseDto {
  exam_id: number;
  exam_name: string;
  exam_type: string;
  timelimit_minutes?: string | null;
  scheduled_date?: string | null;
  exam_status?: string | null;
  student_taken?: boolean | null;
  latest_score?: number | string | null;
  attempts?: number | null;
  training_scores?: string[] | null;
}

export interface StudentCourseApiResponseDto {
  course_id: number;
  course_name: string;
  collection_id?: string | null;
  active_exams?: StudentCourseExamResponseDto[];
  training_exams?: StudentCourseExamResponseDto[];
  assessment_average_percentage?: number | string | null;
  category_name?: string | null;
  subcategory_name?: string | null;
}

/**
 * DTO for a single item in GET /student/exams-to-solve response
 */
export interface StudentExamToSolveResponseDto {
  exam_id: number;
  exam_name: string;
  exam_type: string;
  timelimit_minutes: string;
  scheduled_date: string | null;
  end_date: string | null;
  exam_status: string;
}

/**
 * DTO for a single item in GET /student/completed-exams response
 */
export interface StudentCompletedExamResponseDto {
  exam_id: number;
  exam_name: string;
  exam_type: string;
  timelimit_minutes: string;
  scheduled_date: string | null;
  end_date: string | null;
  exam_status: string;
  student_score: string | null;
  total_questions: number;
  correct_answers_count: number;
}
