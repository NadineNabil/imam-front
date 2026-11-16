import { Question } from "src/app/domain/entities/question.entity";
import { QuestionDetailsDto, QuestionDto } from "../dto/request/question.request.dto";

export class QuestionMapper {

  static toRequestDto(question: Question): QuestionDto {
    return {
      text: question.question,
      objective_id: question.objectiveId,
      question_type: question.type,
      grade: 0, 
      learning_unit_file: '',
      correct_answer: question.correctAnswer?.[0]?.toString() ?? '',
      options: (question.options ?? []).map(opt => ({
        text: String(opt.option),
        is_correct:Boolean(opt.isCorrect)
      }))
    };
  }
  static toRequestQuestionDetailsDto(question: Question):QuestionDetailsDto{
     return {
      id:question.id??undefined,
      text: question.question,
      objective_id: question.objectiveId,
      question_type: question.type,
      grade: 0, 
      learning_unit_file: '',
      correct_answer: question.correctAnswer?.[0]?.toString() ?? '',
      options: (question.options ?? []).map(opt => ({
        id:opt.id,
        text: String(opt.option),
        is_correct:Boolean(opt.isCorrect),
        question_id:opt.questionId
      }))
    };
  }

}