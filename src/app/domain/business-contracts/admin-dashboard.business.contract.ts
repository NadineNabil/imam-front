import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AdminKpis,
  AdminExamActivityData,
  AdminEnrollmentActivityData,
  AdminTopCourseItem
} from '../entities/admin-dashboard.entity';
import { ExamCountPeriod, AdminExamType } from '../enums/admin-dashboard.enum';

export interface IAdminDashboardBusiness {
  getKpis(): Observable<AdminKpis>;
  getExamActivity(period: ExamCountPeriod | string, examType?: AdminExamType | string): Observable<AdminExamActivityData>;
  getEnrollmentActivity(period: ExamCountPeriod | string): Observable<AdminEnrollmentActivityData>;
  getTopPerformingCourses(): Observable<AdminTopCourseItem[]>;
}

export const ADMIN_DASHBOARD_BUSINESS_TOKEN = new InjectionToken<IAdminDashboardBusiness>(
  'IAdminDashboardBusiness'
);
