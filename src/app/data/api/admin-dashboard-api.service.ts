import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../config';
import { AdminKpisDto } from '../dto/response/admin-dashboard.response.dto';
import { ExamCountPeriod, AdminExamType } from '../../domain/enums/admin-dashboard.enum';

@Injectable({ providedIn: 'root' })
export class AdminDashboardApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfig
  ) {}

  getKpis(): Observable<AdminKpisDto> {
    const url = this.apiConfig.getUrl(this.apiConfig.endpoints.adminDashboard.kpis);
    return this.http.get<AdminKpisDto>(url);
  }

  getExamActivity(period: ExamCountPeriod | string, examType?: AdminExamType | string): Observable<any> {
    const url = this.apiConfig.getUrl(this.apiConfig.endpoints.adminDashboard.examActivity(period));
    let params = new HttpParams();
    if (examType) {
      params = params.set('exam_type', examType);
    }
    return this.http.get<any>(url, { params });
  }

  getEnrollmentActivity(period: ExamCountPeriod | string): Observable<any> {
    const url = this.apiConfig.getUrl(this.apiConfig.endpoints.adminDashboard.enrollmentActivity(period));
    return this.http.get<any>(url);
  }

  getTopPerformingCourses(): Observable<any> {
    const url = this.apiConfig.getUrl(this.apiConfig.endpoints.adminDashboard.topPerformingCourses);
    return this.http.get<any>(url);
  }
}
