// export interface LearningUnitResponseDto {
//     id: number;
//     learningUnitName: string;
//     learningUnitDescription?: string;
//     learningUnitImage?: string;
// }

export interface LearningUnitResponseDto {
    id: number;
    course_Id: number;        
    name: string;
    learningUnitDescription?: string;
    learningUnitImage?: string;
}

export interface LearningUnitListResponseDto {
  course_id: number;
  course_name: string;
  learning_units: LearningUnitResponseDto[];
  created_at: string;
  updated_at: string;
}

