import { QuestionTypeEnum } from "../enums/question-type.enum";

export class Question {
  constructor(
    public id: number | null,
    public type: QuestionTypeEnum,
    public question: string,
    public correctAnswer: string[],
     public objectiveId: number,
    public options?: QuestionOption[],
    public leftSide?: string[],
    public rightSide?: string[],
  ) {}
}
export class QuestionOption{
  constructor(
    public id:number,
  public option: string,
  public isCorrect: boolean,
   public questionId: number
 ){}
}