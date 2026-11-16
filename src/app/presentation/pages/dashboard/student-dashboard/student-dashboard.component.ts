import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { IStudentDashboardBusiness, STUDENT_DASHBOARD_BUSINESS_TOKEN } from '../../../../domain/business-contracts/student-dashboard.business.contract';
import { IAuthBusiness, AUTH_BUSINESS_TOKEN } from '../../../../domain/business-contracts/auth-business.contract';
import { StudentDashboard, DashboardCourseItem, DashboardUpcomingExam, DashboardCompletedExam } from '../../../../domain/entities/student-dashboard.entity';
import { Router } from '@angular/router';

interface ExamCountdown {
  id: number;
  formattedTime: string;
  isWithin24h: boolean;
  isAvailableNow: boolean;
  badgeTime?: string;
}

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
  standalone: false
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  viewResult(item: DashboardCompletedExam): void {
    if (item.examType?.toLowerCase() === 'training') {
      this.router.navigate(['/training-report', item.id]);
    } else {
      this.router.navigate(['/exam-report', item.id]);
    }
  }
  dashboardData!: StudentDashboard;
  isLoading = true;
  studentName = 'Student';
  lastLoginFormatted = '';

  // Course Filter state
  activeCourseFilter: 'All' | 'Active' | 'Revoked' = 'All';
  filteredCourses: DashboardCourseItem[] = [];

  // Exam Tab state
  activeExamTab: 'Upcoming' | 'Active' | 'Completed' = 'Upcoming';
  filteredUpcomingExams: DashboardUpcomingExam[] = [];

  // Countdowns map
  countdowns: { [examId: number]: ExamCountdown } = {};
  private timerSub?: Subscription;

  constructor(
    @Inject(STUDENT_DASHBOARD_BUSINESS_TOKEN)
    private readonly dashboardBusiness: IStudentDashboardBusiness,
    @Inject(AUTH_BUSINESS_TOKEN)
    private readonly authBusiness: IAuthBusiness,
    private router:Router
  ) {}

  ngOnInit(): void {
    // Get logged in student name
    const currentUser = this.authBusiness.getCurrentUser();
    if (currentUser) {
      this.studentName = currentUser.firstName || 'Student';
    }

    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }

  loadDashboardData(): void {
    this.isLoading = true;
    // Assuming student ID is retrieved or mocked
    const studentId = this.authBusiness.getCurrentUser()?.id || 1;

    this.dashboardBusiness.getStudentDashboardData(studentId).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.formatLastLogin(data.lastLogin);
        this.applyCourseFilter();
        this.applyExamFiltering();
        this.startCountdownTimer();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load student dashboard data:', err);
        this.isLoading = false;
      }
    });
  }

  formatLastLogin(lastLogin: Date | string): void {
    const date = new Date(lastLogin);
    // Format to: "Today at 10:24 AM" or a readable format
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.lastLoginFormatted = `Today at ${timeStr}`;
    } else {
      this.lastLoginFormatted = date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + 
        ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  // Courses Filtering
  setCourseFilter(filter: 'All' | 'Active' | 'Revoked'): void {
    this.activeCourseFilter = filter;
    this.applyCourseFilter();
  }

  applyCourseFilter(): void {
    if (!this.dashboardData) return;

    if (this.activeCourseFilter === 'All') {
      this.filteredCourses = this.dashboardData.courses;
    } else {
      this.filteredCourses = this.dashboardData.courses.filter(
        (c) => c.status === this.activeCourseFilter
      );
    }
  }

  // Exams Tab switching
  setExamTab(tab: 'Upcoming' | 'Active' | 'Completed'): void {
    this.activeExamTab = tab;
    this.applyExamFiltering();
  }

  applyExamFiltering(): void {
    if (!this.dashboardData) return;
    this.updateExamStates();
  }

  // Countdown timer logic
  private startCountdownTimer(): void {
    // Initial calculation
    this.updateExamStates();

    // Update every second
    this.timerSub = interval(1000).subscribe(() => {
      this.updateExamStates();
    });
  }

  private updateExamStates(): void {
    if (!this.dashboardData) return;

    const now = new Date().getTime();
    const list: DashboardUpcomingExam[] = [];

    this.dashboardData.upcomingExams.forEach((exam) => {
      const scheduledTime = new Date(exam.scheduledAt).getTime();
      const diffMs = scheduledTime - now;
      const durationMs = exam.durationMinutes * 60 * 1000;

      let formattedTime = '';
      let isWithin24h = false;
      let isAvailableNow = false;
      let badgeTime = '';

      if (diffMs <= 0 && Math.abs(diffMs) < durationMs) {
        // Exam has started and is currently ongoing
        isAvailableNow = true;
        formattedTime = 'Available Now';
      } else if (diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000) {
        // Starts in less than 24 hours
        isWithin24h = true;
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        // Pad zeros for the timer display format e.g. "02:35:12"
        const hStr = hours.toString().padStart(2, '0');
        const mStr = minutes.toString().padStart(2, '0');
        const sStr = seconds.toString().padStart(2, '0');
        formattedTime = `${hStr} : ${mStr} : ${sStr}`;
        badgeTime = `Starts in ${hours}h ${minutes}m`;
      } else if (diffMs > 24 * 60 * 60 * 1000) {
        // Scheduled in the future (more than 24h)
        const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
        formattedTime = `Starts in ${diffDays} days`;
        badgeTime = `Scheduled`;
      } else {
        // Already passed duration
        formattedTime = 'Ended';
      }

      this.countdowns[exam.id] = {
        id: exam.id,
        formattedTime,
        isWithin24h,
        isAvailableNow,
        badgeTime
      };

      // Filter upcoming exams based on active tab
      if (this.activeExamTab === 'Upcoming') {
        // Show everything scheduled for future or available now
        if (diffMs + durationMs > 0) {
          list.push(exam);
        }
      } else if (this.activeExamTab === 'Active') {
        // Only show available now exams
        if (isAvailableNow) {
          list.push(exam);
        }
      }
    });

    // Sort upcoming exams: Available Now first, then by date (nearest first)
    list.sort((a, b) => {
      const aTime = new Date(a.scheduledAt).getTime();
      const bTime = new Date(b.scheduledAt).getTime();
      const aAvail = this.countdowns[a.id]?.isAvailableNow ? 1 : 0;
      const bAvail = this.countdowns[b.id]?.isAvailableNow ? 1 : 0;
      
      if (aAvail !== bAvail) {
        return bAvail - aAvail; // Available first
      }
      return aTime - bTime; // Nearest first
    });

    this.filteredUpcomingExams = list;
  }

  // Helper to check if countdown hours/mins/secs are split
  getCountdownParts(examId: number) {
    const cd = this.countdowns[examId];
    if (!cd || !cd.isWithin24h) return null;
    const parts = cd.formattedTime.split(' : ');
    return {
      h: parts[0] || '00',
      m: parts[1] || '00',
      s: parts[2] || '00'
    };
  }

  getCompletedExamStatusClass(status: string): string {
    switch (status) {
      case 'Graded':
      case 'Completed':
        return 'badge-soft-success';
      case 'Pending Review':
      case 'Processing':
        return 'badge-soft-warning';
      case 'Submitted':
        return 'badge-soft-info';
      case 'Failed':
        return 'badge-soft-danger';
      default:
        return 'badge-soft-secondary';
    }
  }
startExam(examId: number,examType:string) {
  if(examType==='Training'){
    this.router.navigate(['training', examId]);
  }
  else
  this.router.navigate(['exam', examId]);
}

onImageError(event: Event): void {
  const imgElement = event.target as HTMLImageElement;
  if (imgElement) {
    imgElement.onerror = null;
    imgElement.src = 'assets/images/default-subject.jpg';
  }
}
}
