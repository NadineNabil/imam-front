import { BaseOptionsSettings } from "src/app/domain/entities/BaseSettingOptionsSettings.entity";
import { QuestionVM } from "./questions-ui-model";
import { ObjectiveUI } from "./objective-ui.model";
import { ExamSourceEnum } from "src/app/domain/enums/exam-source.enum";
import { examtypes } from "src/app/domain/enums/exam-types.enum";

export interface ExamDetailsFormModel{
   id: number;
  examSource:ExamSourceEnum;
  examName: string;
  objectives: ObjectiveUI[];
  active: boolean | string;
  examType: examtypes;
  questions:QuestionVM[],
settings?: BaseOptionsSettings | undefined;
 scheduleDate?: string | null|Date |undefined;
  scheduleTime?: string | null;
  endDate:string|null|Date|undefined;
  endTime:string|null
}