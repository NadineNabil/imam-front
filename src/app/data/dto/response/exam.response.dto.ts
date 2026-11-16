import { ExamSourceEnum } from "src/app/domain/enums/exam-source.enum";
import { ExamStatusEnum } from "src/app/domain/enums/exam-status.enum";
import { ComplexityLevel } from "src/app/domain/enums/complexity-levels.enum";
import { examtypes } from "src/app/domain/enums/exam-types.enum";

export interface ExamResponseDto {
  id: number;
  name: string;
  exam_type: string;
  timelimit_minutes: string;
  question_count: number;
  exam_score: number;
  exam_source:ExamSourceEnum,
  is_active: boolean;
  exam_status: ExamStatusEnum;
  category_name: string;
  course_name: string;
}

export interface DuplicateExamResponseDto {
  id: number;
  name: string;
  course_id:number;
  exam_source:ExamSourceEnum;
  exam_type: examtypes;
  complexity_level:ComplexityLevel ;
  is_active: boolean;
  timelimit_minutes: string;
  question_count: number;
  exam_score: number;
  category_name: string;
  course_name: string;
  exam_status: ExamStatusEnum;
}

export interface ExamsApiResponseDto {
  total_count: number;
  exams: ExamResponseDto[];
}
export interface StudentExamsResponseDto {
id: number;
name: string;
score: number;
}
