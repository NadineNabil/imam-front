import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentDashboard } from '../entities/student-dashboard.entity';
import { IStudentDashboardBusiness } from '../business-contracts/student-dashboard.business.contract';
import { IStudentDashboardRepository, STUDENT_DASHBOARD_REPOSITORY_TOKEN } from '../repository-contracts/student-dashboard.repository.contract';

@Injectable({ providedIn: 'root' })
export class StudentDashboardBusiness implements IStudentDashboardBusiness {
  constructor(
    @Inject(STUDENT_DASHBOARD_REPOSITORY_TOKEN)
    private readonly repository: IStudentDashboardRepository
  ) {}

  getStudentDashboardData(studentId: number): Observable<StudentDashboard> {
    return this.repository.getStudentDashboardData(studentId);
  }
}
