import { Exam } from "src/app/domain/entities/exam.entity";
import { CreateExamFormModel } from "../models/create-exam-ui-model";
import { QuestionType } from "src/app/domain/entities/questionType";
import { Question, QuestionOption } from "src/app/domain/entities/question.entity";
import { QuestionTypeEnum } from "src/app/domain/enums/question-type.enum";
import { Objective } from "src/app/domain/entities/objective.entity";
import { ExamDetailsFormModel } from "../models/exam-details.ui.model";

export class ExamUiMapper {
    static toDomain(formValues: CreateExamFormModel): Exam {
        const exam = new Exam(
            formValues.id,
            formValues.examName,
            formValues.category,
            formValues.examSource,
            formValues.subCategory,
            formValues.learningUnit ?? [],
            formValues.course,
            formValues.complexityLevel,
            formValues.active,
            formValues.examType,
            [], // objectives will be mapped below
            [], // question types mapped below
            [] , // response types mapped below if you have them,

        );
        exam.aiQuestionRatio = formValues.aiQuestionRatio;
        // Map only selected objectives from the UI
        if (formValues.questions) {

        }
        if (formValues.objectives) {
            exam.objectives = formValues.objectives
                .filter(objUI => objUI.selected)
                .map(objUI => {
                    // Get all questions for this objective
                    const relatedQuestions = formValues.questions
                        ?.filter(q => q.objectiveId === objUI.id)
                        .map(q => new Question(
                            0,
                            q.type,
                            q.question,
                            this.mapCorrectAnswer(q),
                            q.objectiveId,
                            (q.options ?? []).map(o =>
                                new QuestionOption(
                                    0,                // id = 0 in create
                                    o.option,
                                    o.isCorrect,
                                    0                 // questionId unknown yet
                                )
                            ), // store just the option text if needed
                            q.leftSide ?? [],
                            q.rightSide ?? []
                        )) || [];

                    // Use the domain entity directly
                    return new Objective(
                        objUI.id,
                        objUI.objectiveText,
                        objUI.cognitiveStyle ?? null,
                        objUI.filename ?? null,
                        objUI.weight,
                        objUI.knowledgeSourceId,
                        relatedQuestions
                    );
                });
        }
        if (formValues.questionTypesArray) {
            exam.questionTypes = formValues.questionTypesArray.filter(qt => qt.selected).map(qt => {
                return new QuestionType(
                    qt.questionType,
                    qt.numberOfQuestions
                )
            }
            )
        }
        if (formValues.responseTypesArray) {
            exam.responseTypes = formValues.responseTypesArray.filter(rt => rt.selected)
        }
        return exam
    }
    private static mapCorrectAnswer(q: any): string[] {

        const optionBasedTypes = [
            QuestionTypeEnum.multiple_choice,
            QuestionTypeEnum.true_false
        ];

        if (optionBasedTypes.includes(q.type)) {
            return [];
        }

        return Array.isArray(q.correctAnswer)
            ? q.correctAnswer
            : [q.correctAnswer ?? ''];
    }
    //convert from domain to form model to patch the forms with the data of the exam when we view the details of the exam
    static toFormModel(exam: Exam): Partial<ExamDetailsFormModel> {
        return {
            settings: exam.settings,
            id: exam.id,
            examType: exam.examType,
            active: exam.active,
            examName: exam.examName,
            scheduleDate: exam.scheduleDate,
            scheduleTime: exam.scheduleTime,
            endDate: exam.endDate,
            endTime: exam.endTime,
            objectives: exam.objectives.map(obj => ({
                id: obj.id,
                objectiveText: obj.objectiveText,
                cognitiveStyle: obj.cognitiveStyle,
                filename: obj.filename,
                weight: obj.weight,
                selected: true
            })),

            questions: exam.objectives.flatMap(obj =>
                obj.questions.map(q => ({
                    id: q.id ?? undefined,
                    type: q.type,
                    question: q.question,
                    correctAnswer: q.correctAnswer ?? [],
                    objectiveId: obj.id,
                    options: (q.options ?? []).map(o => ({
    id: o.id,
    option: o.option,
    isCorrect: o.isCorrect,
    questionId: o.questionId
})),
                    leftSide: q.leftSide ?? [],
                    rightSide: q.rightSide ?? []
                }))
            )
        };
    }
    static toObjectivesDomain(formValues: Partial<ExamDetailsFormModel>): Objective[] {
        return formValues.objectives
            ?.filter(objUI => objUI.selected)
            .map(objUI => {
                // Get all questions for this objective
                const relatedQuestions = formValues.questions
                    ?.filter(q => q.objectiveId === objUI.id)
                    .map(q => new Question(
                        q.id ?? null,
                        q.type,
                        q.question,
                        this.mapCorrectAnswer(q),
                        q.objectiveId,
                       (q.options ?? []).map(o =>
    new QuestionOption(
        o.id ??0 ,
        o.option,
        o.isCorrect,
       o.questionId ?? q.id ?? 0
    )
),
                        q.leftSide ?? [],
                        q.rightSide ?? []
                    )) || [];

                // Use the domain entity directly
                return new Objective(
                    objUI.id,
                    objUI.objectiveText,
                    objUI.cognitiveStyle ?? null,
                    objUI.filename ?? null,
                    objUI.weight,
                    objUI.knowledgeSourceId,
                    relatedQuestions
                );
            }) ?? [];


    }
}