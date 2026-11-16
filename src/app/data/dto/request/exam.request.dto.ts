import { Objective } from "src/app/domain/entities/objective.entity"
import { QuestionType } from "src/app/domain/entities/questionType"
import { ComplexityLevel } from "src/app/domain/enums/complexity-levels.enum"
import { ExamSourceEnum } from "src/app/domain/enums/exam-source.enum"
import { examtypes } from "src/app/domain/enums/exam-types.enum"
import { ResponseTypeEnum } from "src/app/domain/enums/response-type.enum"
import { ObjectiveRequestDto } from "./objective.request.dto"
import { QuestionTypeCountDto } from "./question.request.dto"

export interface ExamRequestDto{
name: string,
  course_id: number,
  course_name:string|null;
  course_description:string|null;
  ai_question_ratio:number;
  assistant_id: string,
  exam_source: ExamSourceEnum
  exam_type: examtypes|string,
  complexity_level: ComplexityLevel,
  is_active: boolean,
  learning_units:number[],
  exam_objectives:ObjectiveRequestDto[],
  question_type_counts:QuestionTypeCountDto[],
  response_types:ResponseTypeEnum[],
    timelimit_minutes: string,
  question_count: string,
  exam_score: string,

}
