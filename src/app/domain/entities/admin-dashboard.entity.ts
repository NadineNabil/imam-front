export interface AdminKpis {
  registeredUserCount: number;
  activeStudentCount: number;
  courseCount: number;
  activeExamCount: number;
  averageMasteryRate: number;
  pendingInvitationCount: number;
}

export interface AdminExamActivityData {
  categories: string[];
  seriesData: number[];
}

export interface AdminEnrollmentActivityData {
  categories: string[];
  seriesData: number[];
}

export interface AdminTopCourseItem {
  id?: number | string;
  name: string;
  code: string;
  enrolledStudents: number;
  avgMastery: number;
  avgScore: number;
  statusBadge: string;
}
