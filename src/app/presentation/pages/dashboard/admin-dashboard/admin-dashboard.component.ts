import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, interval } from 'rxjs';
import { IAuthBusiness, AUTH_BUSINESS_TOKEN } from '../../../../domain/business-contracts/auth-business.contract';
import {
  IAdminDashboardBusiness,
  ADMIN_DASHBOARD_BUSINESS_TOKEN
} from '../../../../domain/business-contracts/admin-dashboard.business.contract';
import {
  IActivityFeedBusiness,
  ACTIVITY_FEED_BUSINESS_TOKEN
} from '../../../../domain/business-contracts/activity-feed.business.contract';
import {
  AdminKpis,
  AdminExamActivityData,
  AdminEnrollmentActivityData,
  AdminTopCourseItem
} from '../../../../domain/entities/admin-dashboard.entity';
import { ActivityEvent } from '../../../../domain/entities/activity-event.entity';
import { ExamCountPeriod, AdminExamType } from '../../../../domain/enums/admin-dashboard.enum';
import { ChartType } from '../dashboard.model';

export interface KpiCard {
  id: string;
  title: string;
  value: string;
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
  route: string;
}

export interface TopCourse {
  id?: number | string;
  name: string;
  code: string;
  enrolledStudents: number;
  avgMastery: number;
  avgScore: number;
  statusBadge: string;
  masteryBadge: string;
}

export interface LiveActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  icon: string;
  badgeColor: string;
  avatarText?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: false,
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  // Enum references for template access
  ExamCountPeriod = ExamCountPeriod;
  AdminExamType = AdminExamType;

  // Selected filters for charts using domain enums
  examActivityFilter: ExamCountPeriod = ExamCountPeriod.LAST_30_DAYS;
  examActivityType: AdminExamType = AdminExamType.ASSESSMENT;
  enrollmentFilter: ExamCountPeriod = ExamCountPeriod.LAST_30_DAYS;
  trainingFilter: ExamCountPeriod = ExamCountPeriod.LAST_30_DAYS;

  todayDate: Date = new Date();

  // ApexCharts Options
  examActivityChartOptions!: ChartType;
  enrollmentChartOptions!: ChartType;
  trainingCompletionChartOptions!: ChartType;

  // Loading & Data availability states
  isTrainingLoading = true;
  hasTrainingData = false;
  isCoursesLoading = true;
  isExamActivityLoading = true;
  hasExamActivityData = false;
  isEnrollmentLoading = true;
  hasEnrollmentData = false;

  // KPI Cards Data (Top Section - 6 Cards)
  kpiCards: KpiCard[] = [
    {
      id: 'total-users',
      title: 'ADMIN_DASHBOARD.KPI.TOTAL_USERS',
      value: '0',
      icon: 'users',
      iconBgClass: 'bg-primary-subtle',
      iconColorClass: 'text-primary',
      route: '/student-management'
    },
    {
      id: 'active-students',
      title: 'ADMIN_DASHBOARD.KPI.ACTIVE_STUDENTS',
      value: '0',
      icon: 'user-check',
      iconBgClass: 'bg-success-subtle',
      iconColorClass: 'text-success',
      route: '/student-management'
    },
    {
      id: 'total-courses',
      title: 'ADMIN_DASHBOARD.KPI.TOTAL_COURSES',
      value: '0',
      icon: 'book-open',
      iconBgClass: 'bg-info-subtle',
      iconColorClass: 'text-info',
      route: '/courses/all-courses'
    },
    {
      id: 'exams-this-month',
      title: 'ADMIN_DASHBOARD.KPI.EXAMS_THIS_MONTH',
      value: '0',
      icon: 'file-text',
      iconBgClass: 'bg-warning-subtle',
      iconColorClass: 'text-warning',
      route: '/view-exams'
    },
    {
      id: 'avg-mastery-rate',
      title: 'ADMIN_DASHBOARD.KPI.AVG_MASTERY_RATE',
      value: '0%',
      icon: 'award',
      iconBgClass: 'bg-purple-subtle',
      iconColorClass: 'text-purple',
      route: '/tree'
    },
    {
      id: 'pending-invitations',
      title: 'ADMIN_DASHBOARD.KPI.PENDING_INVITATIONS',
      value: '0',
      icon: 'mail',
      iconBgClass: 'bg-danger-subtle',
      iconColorClass: 'text-danger',
      route: '/view-invitations'
    }
  ];

  // Quick Actions List
  quickActions = [
    {
      title: 'ADMIN_DASHBOARD.QUICK_ACTIONS.ADD_USER',
      subtitle: 'ADMIN_DASHBOARD.QUICK_ACTIONS.ADD_USER_SUB',
      icon: 'user-plus',
      bgClass: 'bg-primary-subtle',
      btnClass: 'btn-primary',
      route: '/users/add-user'
    },
    {
      title: 'ADMIN_DASHBOARD.QUICK_ACTIONS.CREATE_EXAM',
      subtitle: 'ADMIN_DASHBOARD.QUICK_ACTIONS.CREATE_EXAM_SUB',
      icon: 'file-plus',
      bgClass: 'bg-success-subtle',
      btnClass: 'btn-success',
      route: '/exams/create-exam'
    },
    {
      title: 'ADMIN_DASHBOARD.QUICK_ACTIONS.ADD_COURSE',
      subtitle: 'ADMIN_DASHBOARD.QUICK_ACTIONS.ADD_COURSE_SUB',
      icon: 'book-open',
      bgClass: 'bg-info-subtle',
      btnClass: 'btn-info',
      route: '/courses/add-course'
    }
  ];

  // Top Performing Courses — populated from API / WebSocket only
  topPerformingCourses: TopCourse[] = [];

  // Live Activity Feed — populated from WebSocket events only
  activities: LiveActivity[] = [];

  private activitySub?: Subscription;
  private mockTimerSub?: Subscription;
  private apiSubs: Subscription[] = [];

  constructor(
    @Inject(AUTH_BUSINESS_TOKEN) private readonly authBusiness: IAuthBusiness,
    @Inject(ADMIN_DASHBOARD_BUSINESS_TOKEN) private readonly adminDashboardBusiness: IAdminDashboardBusiness,
    @Inject(ACTIVITY_FEED_BUSINESS_TOKEN) private readonly activityFeedBusiness: IActivityFeedBusiness,
    private readonly router: Router,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.initCharts();
    this.setupLiveActivityFeed();

    // Listen for language changes to update chart labels dynamically
    const langSub = this.translateService.onLangChange.subscribe(() => {
      // Re-fetch all charts so date/month labels refresh in the new language
      this.fetchExamActivityData(this.examActivityFilter, this.examActivityType);
      this.fetchEnrollmentActivityData(this.enrollmentFilter);
      this.fetchTrainingActivityData(this.trainingFilter);

      // Also update the donut chart total label instantly
      if (this.trainingCompletionChartOptions?.plotOptions?.pie?.donut?.labels?.total) {
        this.trainingCompletionChartOptions = {
          ...this.trainingCompletionChartOptions,
          plotOptions: {
            ...this.trainingCompletionChartOptions.plotOptions,
            pie: {
              ...this.trainingCompletionChartOptions.plotOptions.pie,
              donut: {
                ...this.trainingCompletionChartOptions.plotOptions.pie.donut,
                labels: {
                  ...this.trainingCompletionChartOptions.plotOptions.pie.donut.labels,
                  total: {
                    ...this.trainingCompletionChartOptions.plotOptions.pie.donut.labels.total,
                    label: this.translateService.instant('ADMIN_DASHBOARD.CHARTS.TOTAL_TRAININGS') || 'Total Trainings'
                  }
                }
              }
            }
          }
        };
      }
    });
    this.apiSubs.push(langSub);

    // Fetch backend API statistics following Clean Architecture
    this.fetchKpisData();
    this.fetchExamActivityData(this.examActivityFilter, this.examActivityType);
    this.fetchTrainingActivityData(this.trainingFilter);
    this.fetchEnrollmentActivityData(this.enrollmentFilter);
    this.fetchTopPerformingCoursesData();
  }

  ngOnDestroy(): void {
    if (this.activitySub) {
      this.activitySub.unsubscribe();
    }
    if (this.mockTimerSub) {
      this.mockTimerSub.unsubscribe();
    }
    this.apiSubs.forEach(sub => sub.unsubscribe());
  }

  navigateTo(route: string): void {
    if (route) {
      this.router.navigateByUrl(route);
    }
  }

  viewCourseDetails(course: TopCourse): void {
    if (course && course.id) {
      this.router.navigate(['/learningUnits/AlllearningUnits', course.id], {
        queryParams: { courseName: course.name }
      });
    } else {
      this.router.navigate(['/courses/all-courses']);
    }
  }

  // --- API Integrations ---
  private fetchKpisData(): void {
    const sub = this.adminDashboardBusiness.getKpis().subscribe({
      next: (data: AdminKpis) => {
        if (data) {
          this.updateKpiCardValue('total-users', data.registeredUserCount.toLocaleString());
          this.updateKpiCardValue('active-students', data.activeStudentCount.toLocaleString());
          this.updateKpiCardValue('total-courses', data.courseCount.toString());
          this.updateKpiCardValue('exams-this-month', data.activeExamCount.toString());
          this.updateKpiCardValue('avg-mastery-rate', this.formatPercentage(data.averageMasteryRate));
          this.updateKpiCardValue('pending-invitations', data.pendingInvitationCount.toString());
        }
      },
      error: (err) => {
        console.warn('Error fetching KPIs data:', err);
      }
    });
    this.apiSubs.push(sub);
  }

  private formatPercentage(raw: number | string | undefined | null): string {
    if (raw === undefined || raw === null) return '0%';
    let val = typeof raw === 'string' ? parseFloat(raw) : Number(raw);
    if (isNaN(val)) return '0%';
    // If backend returns ratio (e.g. 0.854 instead of 85.4)
    if (val > 0 && val <= 1) {
      val = val * 100;
    }
    // Clean precision to 1 decimal place without trailing .0 (e.g. 78.5% or 80%)
    const rounded = Math.round(val * 10) / 10;
    return `${rounded}%`;
  }

  private updateKpiCardValue(cardId: string, value: string): void {
    const card = this.kpiCards.find(c => c.id === cardId);
    if (card) {
      card.value = value;
    }
  }

  private fetchExamActivityData(period: ExamCountPeriod, examType: AdminExamType): void {
    this.isExamActivityLoading = true;
    const sub = this.adminDashboardBusiness.getExamActivity(period, examType).subscribe({
      next: (data: AdminExamActivityData) => {
        this.isExamActivityLoading = false;
        if (data && data.categories && data.seriesData && data.seriesData.length > 0) {
          const total = data.seriesData.reduce((a, b) => a + (Number(b) || 0), 0);
          if (total > 0) {
            this.hasExamActivityData = true;
            const examTypeKey = examType === AdminExamType.TRAINING
              ? 'ADMIN_DASHBOARD.CHARTS.TRAINING_EXAMS_TAKEN'
              : 'ADMIN_DASHBOARD.CHARTS.ASSESSMENT_EXAMS_TAKEN';
            const seriesName = this.translateService.instant(examTypeKey) || `${examType} Exams Taken`;
            this.examActivityChartOptions = {
              ...this.examActivityChartOptions,
              series: [{ name: seriesName, data: data.seriesData }],
              xaxis: { ...this.examActivityChartOptions.xaxis, categories: data.categories }
            };
          } else {
            this.hasExamActivityData = false;
          }
        } else {
          this.hasExamActivityData = false;
        }
      },
      error: (err) => {
        console.warn('Error fetching exam activity data:', err);
        this.isExamActivityLoading = false;
        this.hasExamActivityData = false;
      }
    });
    this.apiSubs.push(sub);
  }

  private fetchEnrollmentActivityData(period: ExamCountPeriod): void {
    this.isEnrollmentLoading = true;
    const sub = this.adminDashboardBusiness.getEnrollmentActivity(period).subscribe({
      next: (data: AdminEnrollmentActivityData) => {
        this.isEnrollmentLoading = false;
        if (data && data.categories && data.seriesData && data.seriesData.length > 0) {
          const total = data.seriesData.reduce((a, b) => a + (Number(b) || 0), 0);
          if (total > 0) {
            this.hasEnrollmentData = true;
            const seriesName = this.translateService.instant('ADMIN_DASHBOARD.CHARTS.NEW_ENROLLMENTS') || 'New Enrollments';
            this.enrollmentChartOptions = {
              ...this.enrollmentChartOptions,
              series: [{ name: seriesName, data: data.seriesData }],
              xaxis: { ...this.enrollmentChartOptions.xaxis, categories: data.categories }
            };
          } else {
            this.hasEnrollmentData = false;
          }
        } else {
          this.hasEnrollmentData = false;
        }
      },
      error: (err) => {
        console.warn('Error fetching enrollment activity data:', err);
        this.isEnrollmentLoading = false;
        this.hasEnrollmentData = false;
      }
    });
    this.apiSubs.push(sub);
  }

  private fetchTrainingActivityData(period: ExamCountPeriod): void {
    this.isTrainingLoading = true;
    const sub = this.adminDashboardBusiness.getExamActivity(period, AdminExamType.TRAINING).subscribe({
      next: (data: AdminExamActivityData) => {
        this.isTrainingLoading = false;
        if (data && data.categories && data.seriesData && data.seriesData.length > 0) {
          const total = data.seriesData.reduce((a, b) => a + (Number(b) || 0), 0);
          if (total > 0) {
            this.hasTrainingData = true;
            this.buildTrainingDonut(data.categories, data.seriesData);
          } else {
            this.hasTrainingData = false;
            this.trainingCompletionChartOptions = {
              ...this.trainingCompletionChartOptions,
              series: [],
              labels: []
            };
          }
        } else {
          this.hasTrainingData = false;
          this.trainingCompletionChartOptions = {
            ...this.trainingCompletionChartOptions,
            series: [],
            labels: []
          };
        }
      },
      error: (err) => {
        console.warn('Error fetching training activity data:', err);
        this.isTrainingLoading = false;
        this.hasTrainingData = false;
      }
    });
    this.apiSubs.push(sub);
  }

  /** Aggregate daily counts into weekly buckets and build donut chart */
  private buildTrainingDonut(categories: string[], seriesData: number[]): void {
    const lang = this.translateService.currentLang || this.translateService.defaultLang || 'en';
    const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
    const weekMap: { [label: string]: number } = {};
    categories.forEach((day, idx) => {
      const date = new Date(day);
      const weekNum = Math.ceil(date.getDate() / 7);
      const monthShort = date.toLocaleString(locale, { month: 'short' });
      const weekLabel = this.translateService.instant('ADMIN_DASHBOARD.CHARTS.WEEK_ABBR') || 'W';
      const label = `${monthShort} ${weekLabel}${weekNum}`;
      weekMap[label] = (weekMap[label] || 0) + (seriesData[idx] || 0);
    });
    const labels = Object.keys(weekMap);
    const values = Object.values(weekMap);
    const total = values.reduce((a, b) => a + b, 0);

    this.trainingCompletionChartOptions = {
      ...this.trainingCompletionChartOptions,
      series: values,
      labels,
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '13px',
                offsetY: -6
              },
              value: {
                show: true,
                fontSize: '22px',
                fontWeight: '700',
                offsetY: 6,
                formatter: (val: string) => val
              },
              total: {
                show: true,
                label: this.translateService.instant('ADMIN_DASHBOARD.CHARTS.TOTAL_TRAININGS') || 'Total Trainings',
                fontSize: '13px',
                formatter: () => String(total)
              }
            }
          }
        }
      }
    };
  }

  private fetchTopPerformingCoursesData(): void {
    this.isCoursesLoading = true;
    const sub = this.adminDashboardBusiness.getTopPerformingCourses().subscribe({
      next: (courses: AdminTopCourseItem[]) => {
        this.isCoursesLoading = false;
        if (courses && courses.length > 0) {
          this.topPerformingCourses = courses.map(c => {
            const rawMastery = Number(c.avgMastery ?? 0);
            const normalizedMastery = rawMastery > 0 && rawMastery <= 1 ? rawMastery * 100 : rawMastery;
            const avgMastery = Math.round(normalizedMastery * 10) / 10;
            const rawScore = Number(c.avgScore ?? 0);
            const avgScore = Math.round(rawScore * 10) / 10;
            return {
              id: c.id,
              name: c.name,
              code: c.code,
              enrolledStudents: c.enrolledStudents,
              avgMastery,
              avgScore,
              statusBadge: c.statusBadge || (avgScore >= 75 ? 'badge-soft-success' : avgScore >= 50 ? 'badge-soft-primary' : 'badge-soft-warning'),
              masteryBadge: (c as any).masteryBadge || (avgMastery >= 75 ? 'badge-soft-success' : avgMastery >= 50 ? 'badge-soft-primary' : 'badge-soft-warning')
            };
          });
        } else {
          this.topPerformingCourses = [];
        }
      },
      error: (err) => {
        console.warn('Error fetching top performing courses:', err);
        this.isCoursesLoading = false;
        this.topPerformingCourses = [];
      }
    });
    this.apiSubs.push(sub);
  }

  // --- Filter Control Handlers ---
  setExamActivityFilter(period: ExamCountPeriod): void {
    this.examActivityFilter = period;
    this.fetchExamActivityData(this.examActivityFilter, this.examActivityType);
  }

  setExamActivityType(type: AdminExamType): void {
    this.examActivityType = type;
    this.fetchExamActivityData(this.examActivityFilter, this.examActivityType);
  }

  setEnrollmentFilter(period: ExamCountPeriod): void {
    this.enrollmentFilter = period;
    this.fetchEnrollmentActivityData(this.enrollmentFilter);
  }

  setTrainingFilter(period: ExamCountPeriod): void {
    this.trainingFilter = period;
    this.fetchTrainingActivityData(this.trainingFilter);
  }

  // --- Charts Initialization ---
  private initCharts(): void {
    this.initExamActivityChart();
    this.initEnrollmentChart();
    this.initTrainingCompletionChart();
  }

  private formatDateLabel(val: string): string {
    if (!val) return '';
    if (typeof val === 'string' && (val.includes('-') || val.includes('/'))) {
      const date = new Date(val);
      if (!isNaN(date.getTime())) {
        const lang = this.translateService.currentLang || this.translateService.defaultLang || 'en';
        const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
        return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
      }
    }
    return val;
  }

  private initExamActivityChart(): void {
    this.examActivityChartOptions = {
      series: [],
      chart: {
        type: 'area',
        height: 310,
        redrawOnParentResize: true,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'Inter, sans-serif',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 250,
          animateGradually: { enabled: false },
          dynamicAnimation: {
            enabled: true,
            speed: 150
          }
        }
      },
      colors: ['#5156be'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 90, 100]
        }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: {
        categories: [],
        axisBorder: { show: false },
        axisTicks: { show: false },
        tickAmount: 6,
        labels: {
          style: { colors: '#74788d', fontSize: '11px' },
          rotate: -45,
          rotateAlways: false,
          hideOverlappingLabels: true,
          trim: false,
          // maxHeight: 60,
          formatter: (val: string) => this.formatDateLabel(val)
        }
      },
      yaxis: {
        labels: { style: { colors: '#74788d' } }
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 3
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (val: number) => {
            const unit = this.translateService.instant('ADMIN_DASHBOARD.CHARTS.UNIT_EXAMS') || 'Exams';
            return `${val} ${unit}`;
          }
        }
      }
    };
  }

  private initEnrollmentChart(): void {
    this.enrollmentChartOptions = {
      series: [],
      chart: {
        type: 'area',
        height: 310,
        redrawOnParentResize: true,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'Inter, sans-serif',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 250,
          animateGradually: { enabled: false },
          dynamicAnimation: {
            enabled: true,
            speed: 150
          }
        }
      },
      colors: ['#2ab57d'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 90, 100]
        }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: {
        categories: [],
        axisBorder: { show: false },
        axisTicks: { show: false },
        tickAmount: 6,
        labels: {
          style: { colors: '#74788d', fontSize: '11px' },
          rotate: -45,
          rotateAlways: false,
          hideOverlappingLabels: true,
          trim: false,
          // maxHeight: 60,
          formatter: (val: string) => this.formatDateLabel(val)
        }
      },
      yaxis: {
        labels: { style: { colors: '#74788d' } }
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 3
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (val: number) => {
            const unit = this.translateService.instant('ADMIN_DASHBOARD.CHARTS.UNIT_STUDENTS') || 'Students';
            return `${val} ${unit}`;
          }
        }
      }
    };
  }
  

  private initTrainingCompletionChart(): void {
    this.trainingCompletionChartOptions = {
      series: [],
      chart: {
        type: 'donut',
        height: 310,
        redrawOnParentResize: true,
        fontFamily: 'Inter, sans-serif',
        animations: {
          enabled: true,
          speed: 250,
          dynamicAnimation: {
            enabled: true,
            speed: 150
          }
        }
      },
      labels: [],
      colors: ['#5156be', '#2ab57d', '#4ba6ef', '#ffbf53', '#ff715b'],
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center'
      },
      dataLabels: {
        enabled: true,
        dropShadow: { enabled: false },
        style: {
          colors: ['#ffffff'],
          fontWeight: '600'
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '13px',
                offsetY: -6
              },
              value: {
                show: true,
                fontSize: '22px',
                fontWeight: '700',
                offsetY: 6,
                formatter: (val: string) => val
              },
              total: {
                show: true,
                label: this.translateService.instant('ADMIN_DASHBOARD.CHARTS.TOTAL_TRAININGS') || 'Total Trainings',
                fontSize: '13px',
                formatter: () => '0'
              }
            }
          }
        }
      },
      stroke: { width: 0 }
    };
  }

  // --- Real-time Activity Feed setup ---
  private setupLiveActivityFeed(): void {
    try {
      this.activityFeedBusiness.connect();
      this.activitySub = this.activityFeedBusiness.events$.subscribe((event: ActivityEvent) => {
        this.handleRealtimeEvent(event);
      });
    } catch (e) {
      console.warn('Activity feed WebSocket init error:', e);
    }

    const mockNames = ['Youssef Nader', 'Tariq Ziad', 'Nour El-Din', 'Fatima Al-Zahra', 'Kareem Fahmy'];
    const mockActions = ['submitted practice test', 'completed training module', 'joined course group', 'scored 100% on quiz', 'received course badge'];
    const mockTargets = ['Math 101 Quiz #3', 'Physics II Lab 1', 'CS-301 Algorithms', 'Organic Chemistry Test', 'History Unit 4'];
    const mockAvatars = ['YN', 'TZ', 'ND', 'FZ', 'KF'];

    this.mockTimerSub = interval(12000).subscribe(() => {
      const idx = Math.floor(Math.random() * mockNames.length);
      this.pushLiveActivity({
        id: `mock-${Date.now()}`,
        user: mockNames[idx],
        action: mockActions[idx],
        target: mockTargets[idx],
        time: 'Just now',
        icon: 'activity',
        badgeColor: 'badge-soft-success',
        avatarText: mockAvatars[idx]
      });
    });
  }

  private handleRealtimeEvent(event: ActivityEvent): void {
    if (!event || !event.type || event.type === 'info' || event.type === 'ping' || event.type === 'warning') {
      return;
    }

    let handledInline = false;

    // 1. Process Real-time Admin KPIs Payload if provided by WebSocket server
    if (event['admin_kpis']) {
      handledInline = true;
      const kpis = event['admin_kpis'];
      this.updateKpiCardValue('total-users', Number(kpis.registered_user_count ?? 0).toLocaleString());
      this.updateKpiCardValue('active-students', Number(kpis.active_student_count ?? 0).toLocaleString());
      this.updateKpiCardValue('total-courses', String(kpis.course_count ?? 0));
      this.updateKpiCardValue('exams-this-month', String(kpis.active_exam_count ?? 0));
      this.updateKpiCardValue('avg-mastery-rate', this.formatPercentage(kpis.average_mastery_rate));
      this.updateKpiCardValue('pending-invitations', String(kpis.pending_invitation_count ?? 0));
    }

    // 2. Process Real-time Top Performing Courses Payload if provided
    if (Array.isArray(event['top_performing_courses'])) {
      handledInline = true;
      this.topPerformingCourses = event['top_performing_courses'].slice(0, 5).map((item: any) => {
        const mastery = Number(item.avg_mastery ?? item.average_mastery_rate ?? 0);
        const normalizedMastery = mastery > 0 && mastery <= 1 ? mastery * 100 : mastery;
        const avgMastery = Math.round(normalizedMastery * 10) / 10;
        const score = Number(item.avg_score ?? item.average_score ?? 0);
        const avgScore = Math.round(score * 10) / 10;
        return {
          id: item.id || item.course_id,
          name: item.course_name || item.name || 'Course',
          code: item.code || `CRS-${item.course_id || item.id}`,
          enrolledStudents: Number(item.enrolled_students ?? item.student_count ?? 0),
          avgMastery,
          avgScore,
          statusBadge: avgScore >= 75 ? 'badge-soft-success' : avgScore >= 50 ? 'badge-soft-primary' : 'badge-soft-warning',
          masteryBadge: avgMastery >= 75 ? 'badge-soft-success' : avgMastery >= 50 ? 'badge-soft-primary' : 'badge-soft-warning'
        };
      });
    }

    // 3. Process Real-time Enrollment Activity Payload if provided
    const enrollmentObj = event['enrollment_activity_today'] || event['enrollment_activity'];
    if (enrollmentObj && Array.isArray(enrollmentObj.daily_counts)) {
      handledInline = true;
      const categories = enrollmentObj.daily_counts.map((item: any) => item.day || item.date);
      const seriesData = enrollmentObj.daily_counts.map((item: any) => Number(item.enrollment_count ?? item.count ?? 0));
      const seriesName = this.translateService.instant('ADMIN_DASHBOARD.CHARTS.NEW_ENROLLMENTS') || 'New Enrollments';
      this.enrollmentChartOptions = {
        ...this.enrollmentChartOptions,
        series: [{ name: seriesName, data: seriesData }],
        xaxis: { ...this.enrollmentChartOptions.xaxis, categories }
      };
    }

    // 4. Add Live Activity Feed Entry
    const formattedType = event.type.replace(/_/g, ' ');
    this.pushLiveActivity({
      id: `ws-${Date.now()}`,
      user: event.user || event.username || 'System User',
      action: event.action || formattedType,
      target: event.target || event.message || 'Platform Resource',
      time: 'Just now',
      icon: 'bell',
      badgeColor: 'badge-soft-primary',
      avatarText: 'WS'
    });

    // 5. Only re-fetch HTTP endpoints if the payload was NOT included in the WS event
    if (!handledInline) {
      this.fetchKpisData();
      this.fetchEnrollmentActivityData(this.enrollmentFilter);
      this.fetchExamActivityData(this.examActivityFilter, this.examActivityType);
      this.fetchTrainingActivityData(this.trainingFilter);
      this.fetchTopPerformingCoursesData();
    }
  }

  private pushLiveActivity(item: LiveActivity): void {
    this.activities = [item, ...this.activities.slice(0, 7)];
  }
}
