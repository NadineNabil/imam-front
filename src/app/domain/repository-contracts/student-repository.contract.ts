import { Observable } from "rxjs";
import { ApiResponse } from "../entities/api-response.entity";
import { StudentResponseDto } from "src/app/data/dto/response/student.response.dto";
import { Student } from "../entities/student.entity";

export interface IStudentRepository {
  getStudentProfile(id: number): Observable<Student>;
  editStudentProfile(student: Student):  Observable<ApiResponse>;
    editStudentImageProfile(student: Student): Observable<ApiResponse> ;
  }
export const STUDENT_REPOSITORY_TOKEN = 'STUDENT_REPOSITORY_TOKEN';