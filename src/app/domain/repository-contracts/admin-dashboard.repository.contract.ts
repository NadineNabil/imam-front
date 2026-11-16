import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AdminKpis,
  AdminExamActivityData,
  AdminEnrollmentActivityData,
  AdminTopCourseItem
} from '../entities/admin-dashboard.entity';
import { ExamCountPeriod, AdminExamType } from '../enums/admin-dashboard.enum';

export interface IAdminDashboardRepository {
  getKpis(): Observable<AdminKpis>;
  getExamActivity(period: ExamCountPeriod | string, examType?: AdminExamType | string): Observable<AdminExamActivityData>;
  getEnrollmentActivity(period: ExamCountPeriod | string): Observable<AdminEnrollmentActivityData>;
  getTopPerformingCourses(): Observable<AdminTopCourseItem[]>;
}

export const ADMIN_DASHBOARD_REPOSITORY_TOKEN = new InjectionToken<IAdminDashboardRepository>(
  'IAdminDashboardRepository'
);
