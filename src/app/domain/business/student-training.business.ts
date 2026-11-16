import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IStudentTrainingBusiness, GetStudentTrainingsPayload, StudentTrainingsResponse } from '../business-contracts/student-training.business.contract';
import { IStudentTrainingRepository, STUDENT_TRAINING_REPOSITORY_TOKEN } from '../repository-contracts/student-training.repository.contract';
import { CurrentStudentTraining } from '../entities/student-training.entity';

@Injectable({ providedIn: 'root' })
export class StudentTrainingBusiness implements IStudentTrainingBusiness {
  constructor(
    @Inject(STUDENT_TRAINING_REPOSITORY_TOKEN)
    private readonly repository: IStudentTrainingRepository
  ) {}

  getStudentTrainings(payload: GetStudentTrainingsPayload): Observable<StudentTrainingsResponse> {
    return this.repository.getStudentTrainings(payload);
  }

  getCurrentStudentTrainings(): Observable<CurrentStudentTraining[]> {
    return this.repository.getCurrentStudentTrainings();
  }

  getTrainingDetails(trainingId: number): Observable<any> {
    return this.repository.getTrainingDetails(trainingId);
  }
}
