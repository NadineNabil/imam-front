import { Inject, Injectable } from "@angular/core";
import { IStudentBusiness } from "../business-contracts/student-business.contract";
import { IStudentRepository, STUDENT_REPOSITORY_TOKEN } from "../repository-contracts/student-repository.contract";
import { Observable } from "rxjs";
import { ApiResponse } from "../entities/api-response.entity";
import { Student } from "../entities/student.entity";

@Injectable({ providedIn: 'root' })
export class StudentBusiness implements IStudentBusiness {
    constructor(@Inject(STUDENT_REPOSITORY_TOKEN) private readonly studentRepository: IStudentRepository){}
    
  

    editStudentImageProfile(student: Student): Observable<ApiResponse> {
        return this.studentRepository.editStudentImageProfile(student)
    }
    getStudentProfile(id: number): Observable<Student> {
       return this.studentRepository.getStudentProfile(id)
    }
    editStudentProfile(student: Student): Observable<ApiResponse> {
        return this.studentRepository.editStudentProfile(student);
    }
}