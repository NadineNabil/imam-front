import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentService } from '../api/student-api.service';
import { GetStudentTrainingsPayload, StudentTrainingsResponse } from '../../domain/business-contracts/student-training.business.contract';
import { IStudentTrainingRepository } from '../../domain/repository-contracts/student-training.repository.contract';
import { CurrentStudentTraining } from '../../domain/entities/student-training.entity';

@Injectable({ providedIn: 'root' })
export class StudentTrainingRepository implements IStudentTrainingRepository {
  constructor(private readonly studentService: StudentService) {}

  getStudentTrainings(payload: GetStudentTrainingsPayload): Observable<StudentTrainingsResponse> {
    return this.studentService.getStudentTrainings(payload);
  }

  getCurrentStudentTrainings(): Observable<CurrentStudentTraining[]> {
    return this.studentService.getCurrentStudentTrainings();
  }

  getTrainingDetails(trainingId: number): Observable<any> {
    return this.studentService.getStudentTrainingDetails(trainingId);
  }
}
