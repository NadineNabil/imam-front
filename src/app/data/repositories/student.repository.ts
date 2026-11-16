import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ApiResponse } from "src/app/domain/entities/api-response.entity";
import { Student } from "src/app/domain/entities/student.entity";
import { IStudentRepository } from "src/app/domain/repository-contracts/student-repository.contract";
import { StudentService } from "../api/student-api.service";
import { StudentMapper } from "../mappers/student.mapper";
import { CurrentStudentDto, StudentResponseDto } from "../dto/response/student.response.dto";


@Injectable({ providedIn: 'root' })
export class StudentRepositoryImpl implements IStudentRepository {
      constructor(private studentService: StudentService) {}

   

    getStudentProfile(id:number): Observable<Student> {
        return this.studentService.getStudentProfile(id).pipe(
            map((dto: CurrentStudentDto) => StudentMapper.fromStudentProfileDto(dto))
        );
        
    }
    editStudentProfile(student: Student): Observable<ApiResponse> {
       // here i will call the API to update the student profile and return the response as ApiResponse
       // convert student to studentRequestDto using student mapper and then call the API
       return this.studentService.editStudentProfile(StudentMapper.toUpdateRequestDto(student)).pipe(
        map((response: ApiResponse) => response)
       );
    }
        editStudentImageProfile(student: Student): Observable<ApiResponse> {
       // here i will call the API to update the student profile and return the response as ApiResponse
       // convert student to studentRequestDto using student mapper and then call the API
       return this.studentService.editStudentImage(StudentMapper.toUpdateImageDto(student)).pipe(
        map((response: ApiResponse) => response)
       );
    }

    
    
}