export interface DashboardCourseItem {
  id: number;
  name: string;
  description: string;
  enrolledAt: Date | string;
  examsCount: number;
  status: 'Active' | 'Revoked' | string;
  image?: string;
  learningUnitsCount?: number;
}

export interface DashboardUpcomingExam {
  id: number;
  examName: string;
  courseName: string;
  scheduledAt: Date;
  durationMinutes: number;
  examType:string;
  /** false when API returns null for scheduled_date — display "Available anytime" */
  hasFixedSchedule?: boolean;
  /** false when API returns "0" for timelimit_minutes — display "No time limit" */
  hasTimeLimit?: boolean;
}

export interface DashboardCompletedExam {
  id: number;
  examName: string;
  completedAt: Date | string;
  score: number | null;
  status: 'Submitted' | 'Graded' | 'Pending Review' | string;
  examType?: string;
}

export class StudentDashboard {
  constructor(
    public studentName: string,
    public lastLogin: Date | string,
    public totalEnrolledCourses: number,
    public upcomingExamsCount: number,
    public completedExamsCount: number,
    public courses: DashboardCourseItem[],
    public upcomingExams: DashboardUpcomingExam[],
    public completedExams: DashboardCompletedExam[]
  ) {}
}
