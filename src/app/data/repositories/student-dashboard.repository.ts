import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StudentDashboard, DashboardCourseItem, DashboardUpcomingExam, DashboardCompletedExam } from '../../domain/entities/student-dashboard.entity';
import { IStudentDashboardRepository } from '../../domain/repository-contracts/student-dashboard.repository.contract';
import { StudentService } from '../api/student-api.service';
import { environment } from '../../../environments/environment';

/** Strip any leading slashes from the API path, then prepend the image base URL. */
function buildImageUrl(raw: string | null): string | undefined {
  if (!raw) return undefined;
  const clean = raw.replace(/^\/+/, '');          // remove leading "/" or "////"
  return `${environment.imageUrl}/${clean}`;
}

@Injectable({ providedIn: 'root' })
export class StudentDashboardRepositoryImpl implements IStudentDashboardRepository {

  constructor(private readonly studentService: StudentService) {}

  getStudentDashboardData(studentId: number): Observable<StudentDashboard> {

    // Call all 4 APIs in parallel
    return forkJoin({
      summary: this.studentService.getStudentSummary(),
      courses: this.studentService.getStudentCourses(),
      exams: this.studentService.getStudentExamsToSolve(),
      completedExams: this.studentService.getStudentCompletedExams()
    }).pipe(
      map(({ summary, courses, exams, completedExams }) => {

        // Map API courses DTO → domain entity
        const domainCourses: DashboardCourseItem[] = courses.map(c => ({
          id: c.course_id,
          name: c.course_name,
          description: '',
          enrolledAt: c.enrolled_date,
          examsCount: c.exam_count,
          status: c.status,
          image: buildImageUrl(c.course_image)
        }));

        // Map API exams-to-solve DTO → domain entity
        // timelimit_minutes comes as a string; parse safely, fall back to 60 if 0 or missing
        // scheduled_date can be null (exam has no fixed schedule = always available)
        const domainUpcomingExams: DashboardUpcomingExam[] = exams.map(e => {
          const rawDuration = parseInt(e.timelimit_minutes, 10);
          const hasTimeLimit = rawDuration > 0;
          const durationMinutes = hasTimeLimit ? rawDuration : 60; // 60 is only for countdown logic

          const hasFixedSchedule = !!e.scheduled_date;
          // If no scheduled date but exam is active → treat as started 1 second ago (Available Now)
          const scheduledAt = e.scheduled_date
            ? new Date(e.scheduled_date)
            : (e.exam_status === 'Active' ? new Date(Date.now() - 1000) : new Date());

          return {
            id: e.exam_id,
            examType:e.exam_type,
            examName: e.exam_name,
            courseName: '',           // not returned by this endpoint
            scheduledAt,
            durationMinutes,
            hasFixedSchedule,
            hasTimeLimit
          };
        });

        // Map API completed-exams DTO → domain entity
        // student_score is a large decimal string — parse it to a rounded number
        const domainCompletedExams: DashboardCompletedExam[] = completedExams.map(e => {
          const rawScore = e.student_score !== null ? parseFloat(e.student_score) : null;
          const score = rawScore !== null && !isNaN(rawScore) ? Math.round(rawScore * 100) / 100 : null;

          return {
            id: e.exam_id,
            examName: e.exam_name,
            completedAt: e.end_date ? new Date(e.end_date) : new Date(),
            score,
            status: e.exam_status,
            examType: e.exam_type
          };
        });

        return new StudentDashboard(
          'Student',
          new Date(),
          summary.total_courses,
          summary.exams_to_solve_count,
          summary.completed_exams_count,
          domainCourses,
          domainUpcomingExams,
          domainCompletedExams
        );
      }),
      catchError(err => {
        console.error('Failed to load student dashboard data from API, falling back to static data:', err);

        const now = new Date();

        const fallbackCourses: DashboardCourseItem[] = [
          {
            id: 1,
            name: 'Web Development Fundamentals',
            description: 'Learn the core concepts of HTML, CSS, and modern JavaScript.',
            enrolledAt: new Date(2025, 3, 10),
            examsCount: 4,
            status: 'Active'
          },
          {
            id: 2,
            name: 'Database Management',
            description: 'Understand relational databases and SQL queries.',
            enrolledAt: new Date(2025, 3, 12),
            examsCount: 3,
            status: 'Active'
          },
          {
            id: 3,
            name: 'Python Programming',
            description: 'Master Python syntax and object-oriented concepts.',
            enrolledAt: new Date(2025, 3, 15),
            examsCount: 5,
            status: 'Active'
          }
        ];

        const fallbackUpcomingExams: DashboardUpcomingExam[] = [
          {
            id: 101,
            examType:'Training',
            examName: 'Database Fundamentals',
            courseName: 'Database Course',
            scheduledAt: new Date(now.getTime() - 5 * 60 * 1000),
            durationMinutes: 60
          },
          {
            id: 102,
             examType:'Training',
            examName: 'Web Development Basics',
            courseName: 'Web Development Course',
            scheduledAt: new Date(now.getTime() + (2 * 60 * 60 * 1000) + (35 * 60 * 1000)),
            durationMinutes: 90
          }
        ];

        return of(new StudentDashboard(
          'Student',
          new Date(),
          fallbackCourses.length,
          fallbackUpcomingExams.length,
          0,
          fallbackCourses,
          fallbackUpcomingExams,
          []
        ));
      })
    );
  }
}
