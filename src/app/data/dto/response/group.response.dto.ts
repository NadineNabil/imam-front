// import { StudentResponseDto } from "./student.response.dto";

import { Student } from "src/app/domain/entities/student.entity";

export interface GroupResponseDto {
  id: number;
  name: string;
  description?: string;
  students?: Student[];
  students_count: number;
   created_at:Date|string,
   created_by_user_name:string;
   pending_students_count:number;
   active_students_count:number;
}

export interface GroupsApiResponseDto {
  items: GroupResponseDto[];
  total_count: number;
}
