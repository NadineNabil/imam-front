import { Observable } from "rxjs";
import { ApiResponse } from "../entities/api-response.entity";
import { Student } from "../entities/student.entity";

export interface IStudentBusiness {
  getStudentProfile(id: number): Observable<Student>;
  editStudentProfile(student: Student):Observable<ApiResponse>;
    editStudentImageProfile(student: Student): Observable<ApiResponse> 

}
export const STUDENT_BUSINESS_TOKEN = 'STUDENT_BUSINESS_TOKEN';