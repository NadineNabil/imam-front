import { Observable } from 'rxjs';
import { StudentDashboard } from '../entities/student-dashboard.entity';
import { InjectionToken } from '@angular/core';

export interface IStudentDashboardRepository {
  getStudentDashboardData(studentId: number): Observable<StudentDashboard>;
}

export const STUDENT_DASHBOARD_REPOSITORY_TOKEN = new InjectionToken<IStudentDashboardRepository>(
  'IStudentDashboardRepository'
);
