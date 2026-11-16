import { ComplexityLevel } from "../enums/complexity-levels.enum";
import { ExamSourceEnum } from "../enums/exam-source.enum";
import { ExamStatusEnum } from "../enums/exam-status.enum";
import { examtypes } from "../enums/exam-types.enum";
import { BaseOptionsSettings } from "./BaseSettingOptionsSettings.entity";
import { Category } from "./category.entity";
import { Course } from "./course.entity";
import { LearningUnits } from "./learningUnits.entity";
import { Objective } from "./objective.entity";
import { QuestionType } from "./questionType";
import { ResponseType } from "./reponseType.entity";
import { SubCategory } from "./subCategory.entity";

export class Exam {
    constructor(
        public id: number,
        public examName: string,
        public category: Category | null,
        public examSource: ExamSourceEnum,
        public subCategory: SubCategory | null,
        public learningUnit: LearningUnits[] | null,
        public course: Course | null,
        public complexityLevel: ComplexityLevel | null,
        public active: boolean | string,
        public examType: examtypes,
        public objectives: Objective[],
        public questionTypes: QuestionType[],
        public responseTypes: ResponseType[],
        public examStatus?: ExamStatusEnum | string,
        public categoryName?: string,
        public courseName?: string,
        public scheduleDate?: Date | null | string,
        public scheduleTime?: string | null | string,
        public endDate?: Date | null | string,
        public endTime?: string | null | string,
        public settings?: BaseOptionsSettings | undefined,
        public aiQuestionRatio?:number


    ) { }
}
export class DuplicateExam {
    constructor(
        public id: number,
        public name: string,
        public courseId: number,
        public examSource: ExamSourceEnum,
        public examType: examtypes,
        public complexityLevel: ComplexityLevel | null,
        public active: boolean | string,
        public timelimitMinutes: string | null,
        public question_count: number,
        public examScore: number,
        public categoryName?: string,
        public courseName?: string,
        public examStatus?: ExamStatusEnum | string,

    ) { }
}