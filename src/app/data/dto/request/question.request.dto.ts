export interface QuestionDto {
  text: string;
  objective_id: number;
  question_type: string;
  grade: number;
  learning_unit_file: string;
  correct_answer: string;
  options: QuestionOptionDto[];
}
export interface QuestionOptionDto {
  text: string;
  is_correct: boolean;
}
export interface QuestionTypeCountDto {
  question_type: string;
  count: number;
}
export interface  QuestionDetailsDto{
  id?:number
    text: string;
  objective_id: number;
  question_type: string;
  grade: number;
  learning_unit_file: string;
  correct_answer: string;
  options: QuestionOptionDetailsDto[];
}
export interface QuestionOptionDetailsDto {
  id?:number,
  text: string;
  is_correct: boolean;
  question_id?:number
}
