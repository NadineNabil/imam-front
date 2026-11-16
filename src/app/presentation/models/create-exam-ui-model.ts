import { ResponseType } from "src/app/domain/entities/reponseType.entity";
import { ObjectiveUI } from "./objective-ui.model";
import { QuestionTypeUI } from "./question-type-ui-model";
import { LearningUnits } from "src/app/domain/entities/learningUnits.entity";
import { Course } from "src/app/domain/entities/course.entity";
import { SubCategory } from "src/app/domain/entities/subCategory.entity";
import { Category } from "src/app/domain/entities/category.entity";
import { ComplexityLevel } from "src/app/domain/enums/complexity-levels.enum";
import { examtypes } from "src/app/domain/enums/exam-types.enum";
import { ResponseTypeUI } from "./response-type-ui-model";
import { ExamSourceEnum } from "src/app/domain/enums/exam-source.enum";
import { QuestionVM } from "./questions-ui-model";
import { BaseOptionsSettings } from "src/app/domain/entities/BaseSettingOptionsSettings.entity";


export interface CreateExamFormModel{
   id: number;
  category: Category | null;
  examSource:ExamSourceEnum;
  subCategory: SubCategory | null;
  examName: string;
  course: Course | null;
  learningUnit: LearningUnits[] | [];
  complexityLevel: ComplexityLevel  | null;
  objectives: ObjectiveUI[];
  questionTypesArray: QuestionTypeUI[];
  responseTypesArray: ResponseTypeUI[]; // just the entity, no UI wrapper needed
  active: boolean | string;
  examType: examtypes;
  questions:QuestionVM[],
  aiQuestionRatio:number
}