import { Exam ,DuplicateExam} from "src/app/domain/entities/exam.entity";
import { ExamRequestDto } from "../dto/request/exam.request.dto";
import { ObjectiveDetailsRequestDto } from "../dto/request/objective.request.dto";
import { QuestionOptionDetailsDto,  } from "../dto/request/question.request.dto";
import { ExamResponseDto,DuplicateExamResponseDto } from "../dto/response/exam.response.dto";
import { Course } from "src/app/domain/entities/course.entity";
import { examtypes } from "src/app/domain/enums/exam-types.enum";
import { ExamStatusEnum } from "src/app/domain/enums/exam-status.enum";
import { QuestionMapper } from "./question.mapper";
import { ExamDetailsResponseDto } from "../dto/response/exam-details.respomse.dto";
import { Question } from "src/app/domain/entities/question.entity";
import { Objective } from "src/app/domain/entities/objective.entity";
import { BaseOptionsSettings } from "src/app/domain/entities/BaseSettingOptionsSettings.entity";
import { ScheduleDateMapper } from "./schedule-date.mapper";
import { ExamActivationRequestDto } from "../dto/request/activation.request.dto";
import { ExamSourceEnum } from "src/app/domain/enums/exam-source.enum";

export class ExamMapper {

  static toRequestDto(exam: Exam): ExamRequestDto {

    return {
      name: exam.examName,
      course_id: exam.course?.id ?? 0,
      course_name:exam.course?.name??null,
      course_description:exam.course?.description??null,
      ai_question_ratio:exam.aiQuestionRatio??0,

      assistant_id: exam.course?.collectionId ?? '', 

      exam_source: exam.examSource, 

      exam_type: String(exam.examType),

      complexity_level: exam.complexityLevel!,

      timelimit_minutes: "0", 
      question_count: "0",    
      exam_score: "0",       
      

      is_active: Boolean(exam.active),

      learning_units: exam.learningUnit
        ? exam.learningUnit.map(lu => lu.id)
        : [],

      exam_objectives: exam.objectives.map(obj => ({
        id: obj.id,
        title: obj.objectiveText,
        weight:(exam.examSource===ExamSourceEnum.GENERATED)? (obj.weight)?.toString() ?? "0":null,
        file_name: obj.filename ?? "",
        cognitive_style: obj.cognitiveStyle ?? "",
        questions: (obj.questions ?? []).map(q =>
          QuestionMapper.toRequestDto(q)
        )// If questions not inside entity, must map separately
      })),

      question_type_counts: exam.questionTypes.map(qt => ({
        question_type: qt.questionType,
        count: qt.numberOfQuestions
      })),

      response_types: exam.responseTypes.map(rt => rt.responseType)
    }
  }
  static fromResponseDto(dto: ExamResponseDto): Exam {
    const course = new Course(0, dto.course_name);
    return new Exam(
      dto.id,
      dto.name,
      null,
      dto.exam_source,
      null,
      null,
      course,
      null,
      dto.is_active,
      dto.exam_type as examtypes,
      [],
      [],
      [],
      dto.exam_status as ExamStatusEnum,
      dto.category_name,
      dto.course_name
    );
  }

  static fromResponseDtoList(dtos: ExamResponseDto[]): Exam[] {
    return dtos.map(dto => this.fromResponseDto(dto));
  }
  //for exam details response
  static fromDetailsResponseDto(dto: ExamDetailsResponseDto): Exam {
    let settings: BaseOptionsSettings | undefined;
 if (dto.options_settings) {
          settings = new BaseOptionsSettings(
        dto.id,
        dto.options_settings.exam_timelimit.hours,
        dto.options_settings.exam_timelimit.minutes,
        Number(dto.options_settings.question_time_limit) || 0,
        Number(dto.options_settings.question_time_limit) > 0,
        !dto.options_settings.enable_copy_cut_paste,
        dto.options_settings.randomize_question_sequence,
        dto.options_settings.randomize_answer_choices,
        dto.options_settings.enable_spell_check_for_essay,
        dto.options_settings.enable_missing_answer_reminder,
        dto.options_settings.is_limited_attempts,
         dto.options_settings.num_of_attempt
      );
   
  }
  const objectives = dto.exam_objectives?.map(obj => {

    const questions = obj.questions?.map(q => {
        const mappedOptions = (q.options ?? []).map((opt:QuestionOptionDetailsDto) => ({
          id:opt.id,
    option: opt.text,         
    isCorrect: opt.is_correct ,
    questionId:opt.question_id
  }));

      
    return new Question(
        q.id ?? null,
        q.question_type,
        q.text,
        q.correct_answer ?? [],
        obj.id,
        mappedOptions ?? [],
        q.leftSide ?? [],
        q.rightSide ?? []
      )
  }) ?? [];

    return new Objective(
      obj.id,
      obj.title,
      obj.cognitive_style ?? null,
      obj.file_name ?? null,
      obj.weight ? Number(obj.weight) : null,
      undefined,
      questions
    );

  }) ?? [];
  const { scheduleDate, scheduleTime,endDate, endTime } =  ScheduleDateMapper.fromResponseDto(dto.scheduled_date,dto.end_date);
  return new Exam(
    dto.id,
    dto.name,
    null, // category not returned
    dto.exam_source as any,
    null, // subCategory not returned
    null, // learningUnits not returned
    null, // course not returned
    null, // complexity not returned
    dto.is_active,
    dto.exam_type as any,
    objectives,
    [], // questionTypes not returned
    [], // responseTypes not returned
    dto.exam_status as any,
    undefined,
    undefined,
    scheduleDate,
    scheduleTime,
    endDate,
    endTime,
    settings
 
  );
}
static objectivesToRequestDto(objectives: Objective[]): ObjectiveDetailsRequestDto[] {
  return objectives.map(obj => ({
    id: obj.id,
    title: obj.objectiveText,
    weight: (obj.weight)?.toString() ?? "0",
    file_name: obj.filename ?? "",
    cognitive_style: obj.cognitiveStyle ?? "",
    questions: (obj.questions ?? []).map(q =>
      QuestionMapper.toRequestQuestionDetailsDto(q)
    )
  }));
}
 static fromExamResponseDto(dto: DuplicateExamResponseDto): DuplicateExam {
    return new DuplicateExam(
      dto.id,
      dto.name,
      dto.course_id,
      dto.exam_source,
      dto.exam_type,
      dto.complexity_level,
      dto.is_active,
      dto.timelimit_minutes,
      dto.question_count,
      dto.exam_score,
      dto.category_name,
      dto.course_name,
      dto.exam_status
      
      
    );
  }
   static toActivationDto(isActive: boolean): ExamActivationRequestDto {
    return {
      is_active: isActive
    };
  }

}

