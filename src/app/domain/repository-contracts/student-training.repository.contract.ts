import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { GetStudentTrainingsPayload, StudentTrainingsResponse } from '../business-contracts/student-training.business.contract';
import { CurrentStudentTraining } from '../entities/student-training.entity';

export interface IStudentTrainingRepository {
  getStudentTrainings(payload: GetStudentTrainingsPayload): Observable<StudentTrainingsResponse>;
  getCurrentStudentTrainings(): Observable<CurrentStudentTraining[]>;
  getTrainingDetails(trainingId: number): Observable<any>;
}

export const STUDENT_TRAINING_REPOSITORY_TOKEN = new InjectionToken<IStudentTrainingRepository>(
  'IStudentTrainingRepository'
);
