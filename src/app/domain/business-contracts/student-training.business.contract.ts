import { Observable } from 'rxjs';
import { CurrentStudentTraining, StudentTraining } from '../entities/student-training.entity';
import { InjectionToken } from '@angular/core';

export interface GetStudentTrainingsPayload {
  page_no: number;
  page_size: number;
  status: string;
  from_date?: string | null;
  to_date?: string | null;
  course_id?: number | null;
}

export interface StudentTrainingsResponse {
  total_count: number;
  items: StudentTraining[];
}

export interface IStudentTrainingBusiness {
  getStudentTrainings(payload: GetStudentTrainingsPayload): Observable<StudentTrainingsResponse>;
  getCurrentStudentTrainings(): Observable<CurrentStudentTraining[]>;
  getTrainingDetails(trainingId: number): Observable<any>;
}

export const STUDENT_TRAINING_BUSINESS_TOKEN = new InjectionToken<IStudentTrainingBusiness>(
  'IStudentTrainingBusiness'
);
