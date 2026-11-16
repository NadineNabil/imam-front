import { QuestionDetailsDto, QuestionDto } from "./question.request.dto";

export interface ObjectiveRequestDto {
 id: number;
  title: string;
  weight: number|string|null;
  file_name: string;
  cognitive_style: string;
  questions: QuestionDto[];
}
export interface ObjectiveDetailsRequestDto{
   id: number;
  title: string;
  weight: number|string|null;
  file_name: string;
  cognitive_style: string;
  questions: QuestionDetailsDto[];
}