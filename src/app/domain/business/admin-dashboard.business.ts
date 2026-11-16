import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IAdminDashboardBusiness } from '../business-contracts/admin-dashboard.business.contract';
import {
  IAdminDashboardRepository,
  ADMIN_DASHBOARD_REPOSITORY_TOKEN
} from '../repository-contracts/admin-dashboard.repository.contract';
import {
  AdminKpis,
  AdminExamActivityData,
  AdminEnrollmentActivityData,
  AdminTopCourseItem
} from '../entities/admin-dashboard.entity';
import { ExamCountPeriod, AdminExamType } from '../enums/admin-dashboard.enum';

@Injectable({ providedIn: 'root' })
export class AdminDashboardBusiness implements IAdminDashboardBusiness {
  constructor(
    @Inject(ADMIN_DASHBOARD_REPOSITORY_TOKEN)
    private readonly repository: IAdminDashboardRepository
  ) {}

  getKpis(): Observable<AdminKpis> {
    return this.repository.getKpis();
  }

  getExamActivity(period: ExamCountPeriod | string, examType?: AdminExamType | string): Observable<AdminExamActivityData> {
    return this.repository.getExamActivity(period, examType);
  }

  getEnrollmentActivity(period: ExamCountPeriod | string): Observable<AdminEnrollmentActivityData> {
    return this.repository.getEnrollmentActivity(period);
  }

  getTopPerformingCourses(): Observable<AdminTopCourseItem[]> {
    return this.repository.getTopPerformingCourses();
  }
}
