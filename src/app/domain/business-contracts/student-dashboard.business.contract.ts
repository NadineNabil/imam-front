import { Observable } from 'rxjs';
import { StudentDashboard } from '../entities/student-dashboard.entity';
import { InjectionToken } from '@angular/core';

export interface IStudentDashboardBusiness {
  getStudentDashboardData(studentId: number): Observable<StudentDashboard>;
}

export const STUDENT_DASHBOARD_BUSINESS_TOKEN = new InjectionToken<IStudentDashboardBusiness>(
  'IStudentDashboardBusiness'
);
