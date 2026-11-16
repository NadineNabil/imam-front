import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { IAdminDashboardRepository } from '../../domain/repository-contracts/admin-dashboard.repository.contract';
import {
  AdminKpis,
  AdminExamActivityData,
  AdminEnrollmentActivityData,
  AdminTopCourseItem
} from '../../domain/entities/admin-dashboard.entity';
import { ExamCountPeriod, AdminExamType } from '../../domain/enums/admin-dashboard.enum';
import { AdminDashboardApiService } from '../api/admin-dashboard-api.service';
import { AdminKpisDto } from '../dto/response/admin-dashboard.response.dto';

@Injectable({ providedIn: 'root' })
export class AdminDashboardRepositoryImpl implements IAdminDashboardRepository {
  constructor(private readonly apiService: AdminDashboardApiService) {}

  getKpis(): Observable<AdminKpis> {
    return this.apiService.getKpis().pipe(
      timeout(4000),
      map((dto: AdminKpisDto) => ({
        registeredUserCount: dto?.registered_user_count ?? 0,
        activeStudentCount: dto?.active_student_count ?? 0,
        courseCount: dto?.course_count ?? 0,
        activeExamCount: dto?.active_exam_count ?? 0,
        averageMasteryRate: dto?.average_mastery_rate ?? 0,
        pendingInvitationCount: dto?.pending_invitation_count ?? 0
      })),
      catchError((err) => {
        console.warn('Admin KPIs endpoint fallback:', err);
        return of({
          registeredUserCount: 0,
          activeStudentCount: 0,
          courseCount: 0,
          activeExamCount: 0,
          averageMasteryRate: 0,
          pendingInvitationCount: 0
        });
      })
    );
  }

  getExamActivity(period: ExamCountPeriod | string, examType?: AdminExamType | string): Observable<AdminExamActivityData> {
    return this.apiService.getExamActivity(period, examType).pipe(
      timeout(4000),
      map((res: any) => this.mapExamActivityResponse(res, period)),
      catchError((err) => {
        console.warn('Admin Exam Activity endpoint fallback:', err);
        return of(this.getFallbackExamActivity(period));
      })
    );
  }

  getEnrollmentActivity(period: ExamCountPeriod | string): Observable<AdminEnrollmentActivityData> {
    return this.apiService.getEnrollmentActivity(period).pipe(
      timeout(4000),
      map((res: any) => this.mapEnrollmentActivityResponse(res, period)),
      catchError((err) => {
        console.warn('Admin Enrollment Activity endpoint fallback:', err);
        return of(this.getFallbackEnrollmentActivity(period));
      })
    );
  }

  getTopPerformingCourses(): Observable<AdminTopCourseItem[]> {
    return this.apiService.getTopPerformingCourses().pipe(
      timeout(4000),
      map((res: any) => this.mapTopCoursesResponse(res)),
      catchError((err) => {
        console.warn('Admin Top Performing Courses endpoint fallback:', err);
        return of([]);
      })
    );
  }

  private mapExamActivityResponse(res: any, period: string): AdminExamActivityData {
    if (!res) return this.getFallbackExamActivity(period);

    if (Array.isArray(res)) {
      const categories = res.map((item, idx) => item.date || item.day || item.label || `Day ${idx + 1}`);
      const seriesData = res.map((item) => Number(item.student_count ?? item.count ?? item.value ?? item.exams ?? 0));
      return { categories, seriesData };
    }

    if (typeof res === 'object') {
      if (Array.isArray(res.categories) && Array.isArray(res.seriesData)) {
        return { categories: res.categories, seriesData: res.seriesData.map(Number) };
      }
      if (Array.isArray(res.data)) {
        const categories = res.data.map((item: any, idx: number) => item.date || item.day || item.label || `Day ${idx + 1}`);
        const seriesData = res.data.map((item: any) => Number(item.student_count ?? item.count ?? item.value ?? 0));
        return { categories, seriesData };
      }
      if (Array.isArray(res.daily_counts)) {
        const categories = res.daily_counts.map((item: any) => item.day || item.date);
        const seriesData = res.daily_counts.map((item: any) => Number(item.student_count ?? item.enrollment_count ?? item.count ?? 0));
        return { categories, seriesData };
      }
    }

    return this.getFallbackExamActivity(period);
  }

  private mapEnrollmentActivityResponse(res: any, period: string): AdminEnrollmentActivityData {
    if (!res) return this.getFallbackEnrollmentActivity(period);

    if (Array.isArray(res)) {
      const categories = res.map((item, idx) => item.date || item.day || item.label || `Day ${idx + 1}`);
      const seriesData = res.map((item) => Number(item.count ?? item.value ?? item.students ?? 0));
      return { categories, seriesData };
    }

    if (typeof res === 'object') {
      if (Array.isArray(res.categories) && Array.isArray(res.seriesData)) {
        return { categories: res.categories, seriesData: res.seriesData.map(Number) };
      }
      if (Array.isArray(res.data)) {
        const categories = res.data.map((item: any, idx: number) => item.date || item.label || `Day ${idx + 1}`);
        const seriesData = res.data.map((item: any) => Number(item.count ?? item.value ?? 0));
        return { categories, seriesData };
      }
      if (Array.isArray(res.daily_counts)) {
        const categories = res.daily_counts.map((item: any) => item.day || item.date);
        const seriesData = res.daily_counts.map((item: any) => Number(item.enrollment_count ?? item.count ?? 0));
        return { categories, seriesData };
      }
    }

    return this.getFallbackEnrollmentActivity(period);
  }

  private mapTopCoursesResponse(res: any): AdminTopCourseItem[] {
    const list = Array.isArray(res) ? res : res?.items || res?.data || [];
    if (!list.length) return [];

    return list.slice(0, 5).map((item: any, idx: number) => {
      const mastery = Number(item.avg_mastery ?? item.average_mastery_rate ?? 0);
      const score = Number(item.avg_score ?? item.average_score ?? 0);
      return {
        id: item.id || item.course_id || idx + 1,
        name: item.course_name || item.name || `Course ${idx + 1}`,
        code: item.code || `CRS-${item.course_id || item.id || idx + 1}`,
        enrolledStudents: Number(item.enrolled_students ?? item.student_count ?? 0),
        avgMastery: Math.round(mastery),
        avgScore: Math.round(score),
        statusBadge: score >= 75 ? 'badge-soft-success' : score >= 50 ? 'badge-soft-primary' : 'badge-soft-warning',
        masteryBadge: mastery >= 75 ? 'badge-soft-success' : mastery >= 50 ? 'badge-soft-primary' : 'badge-soft-warning'
      };
    });
  }

  private getFallbackExamActivity(period: string): AdminExamActivityData {
    if (period === ExamCountPeriod.TODAY || period === 'today') {
      return { categories: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'], seriesData: [0, 0, 0, 0, 0, 0] };
    } else if (period === ExamCountPeriod.LAST_7_DAYS || period === '7d') {
      return { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], seriesData: [0, 0, 0, 0, 0, 0, 0] };
    } else if (period === ExamCountPeriod.LAST_90_DAYS || period === '90d') {
      return { categories: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'], seriesData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
    } else {
      return { categories: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'], seriesData: [0, 0, 0, 0, 0, 0, 0] };
    }
  }

  private getFallbackEnrollmentActivity(period: string): AdminEnrollmentActivityData {
    if (period === ExamCountPeriod.TODAY || period === 'today') {
      return { categories: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'], seriesData: [0, 0, 0, 0, 0, 0] };
    } else if (period === ExamCountPeriod.LAST_7_DAYS || period === '7d') {
      return { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], seriesData: [0, 0, 0, 0, 0, 0, 0] };
    } else if (period === ExamCountPeriod.LAST_90_DAYS || period === '90d') {
      return { categories: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'], seriesData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
    } else {
      return { categories: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'], seriesData: [0, 0, 0, 0, 0, 0, 0] };
    }
  }
}
