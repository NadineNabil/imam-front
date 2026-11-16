import { QuestionTypeEnum } from "src/app/domain/enums/question-type.enum";

export interface QuestionOptionVM {
   id?:number,
  option: string;
  isCorrect: boolean;
  questionId?: number
}

export interface QuestionVM {
  id?:number
  type: QuestionTypeEnum;
  question: string;
  objectiveId:number;
  options?: QuestionOptionVM[];   // <-- changed from string[]
  leftSide?: string[];
  rightSide?: string[];
  correctAnswer?: string | string[]; 
}