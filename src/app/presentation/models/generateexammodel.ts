

export interface ExamConfigPayload {
  assistant_id: string;
  exam_config: ExamConfig;
}
export interface ExamConfigPayload_AI {
  collection_id: string;
  exam_config: ExamConfig;
}

export interface ExamConfig {
  files:[],
  complexity_level: string; // enumeric enum
  learning_objectives: LearningObjective[];
  question_types: QuestionType[];
}

export interface LearningObjective {
  objective: string;
  cognitive_style:string; //enumeric enum
  weight: number;
}

export interface QuestionType {
  type: string; // enumeric enum
  count: number;
}
