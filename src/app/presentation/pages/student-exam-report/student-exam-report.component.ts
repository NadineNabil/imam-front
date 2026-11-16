import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IStudentExamReportBusiness,
  STUDENT_EXAM_REPORT_BUSINESS_TOKEN
} from 'src/app/domain/business-contracts/student-exam-report-business.contract';
import {
  IAuthBusiness,
  AUTH_BUSINESS_TOKEN
} from 'src/app/domain/business-contracts/auth-business.contract';
import {
  StudentExamReport,
  StudentObjectiveReport,
  StudentQuestionAnswerReport,
  QuestionAnswerStatus
} from 'src/app/domain/entities/student-exam-report.entity';

@Component({
  selector: 'app-student-exam-report',
  templateUrl: './student-exam-report.component.html',
  styleUrls: ['./student-exam-report.component.scss'],
  standalone: false
})
export class StudentExamReportComponent implements OnInit {
  examId!: number;
  requestedAttemptId?: string;
  requestedAttemptNumber?: number;
  report?: StudentExamReport;
  selectedAttemptIndex: number = 0;
  isLoading: boolean = true;
  errorMessage?: string;
  studentName: string = '';
  reportType: 'exam' | 'training' = 'exam';
  reportTitleKey = 'EXAM_REPORT.STUDENT_REPORT';

  // SVG Gauge calculations
  stroke = 10;
  radius = 50;
  normalizedRadius = this.radius - this.stroke * 0.5;
  circumference = 2 * Math.PI * this.normalizedRadius;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    @Inject(STUDENT_EXAM_REPORT_BUSINESS_TOKEN)
    private readonly reportBusiness: IStudentExamReportBusiness,
    @Inject(AUTH_BUSINESS_TOKEN)
    private readonly authBusiness: IAuthBusiness
  ) { }

  ngOnInit(): void {
    const user = this.authBusiness.getCurrentUser();
    if (user) {
      this.studentName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Student';
    }

    this.reportType = this.getReportTypeFromRoute();
    this.reportTitleKey = this.reportType === 'training' ? 'training.report_title' : 'EXAM_REPORT.STUDENT_REPORT';

    this.route.params.subscribe((params) => {
      const idParam = params['id'] || params['examId'];
      const query = this.route.snapshot.queryParamMap;
      this.requestedAttemptId = query.get('attemptId') || undefined;
      const attemptNumber = Number(query.get('attemptNumber'));
      this.requestedAttemptNumber = Number.isFinite(attemptNumber) && attemptNumber > 0 ? attemptNumber : undefined;

      if (idParam) {
        this.examId = +idParam;
        this.loadReport();
      } else {
        this.route.queryParams.subscribe((qParams) => {
          if (qParams['examId']) {
            this.examId = +qParams['examId'];
            this.loadReport();
          } else {
            this.isLoading = false;
            this.errorMessage = 'No report ID provided';
          }
        });
      }
    });
  }

  private getReportTypeFromRoute(): 'exam' | 'training' {
    const routeData = this.route.snapshot.data || {};
    const parentData = this.route.parent?.snapshot.data || {};
    return (routeData['reportType'] as 'exam' | 'training') || (parentData['reportType'] as 'exam' | 'training') || 'exam';
  }

  loadReport(): void {
    this.isLoading = true;
    this.errorMessage = undefined;

    const report$ = this.requestedAttemptId
      ? this.reportBusiness.getStudentTrainingReport(this.examId, this.requestedAttemptId)
      : this.reportBusiness.getStudentExamReport(this.examId);

    report$.subscribe({
      next: (resReport) => {
        const attempts = resReport.allAttempts?.length ? resReport.allAttempts : [resReport];
        const selectedIndex = attempts.findIndex((attempt) =>
          (this.requestedAttemptId && String(attempt.attemptId) === this.requestedAttemptId) ||
          (this.requestedAttemptNumber && attempt.attemptNumber === this.requestedAttemptNumber)
        );

        this.selectedAttemptIndex = selectedIndex >= 0 ? selectedIndex : 0;
        this.report = attempts[this.selectedAttemptIndex];
        this.report.allAttempts = attempts;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load student report:', err);
        this.isLoading = false;
        this.errorMessage = this.reportType === 'training'
          ? 'Failed to load training report details.'
          : 'Failed to load exam report details.';
      }
    });
  }


  getOffset(percent: number): number {
    const validPercent = Math.max(0, Math.min(100, percent || 0));
    return this.circumference - (validPercent / 100) * this.circumference;
  }

  getScoreColor(percent: number): string {
    if (percent >= 50) return '#2ab57d'; // green

    return '#fd625e'; // red
  }

  getQuestionTextGrammar(num: number): string {
    if (num === 1) return 'سؤال';
    if (num >= 2 && num <= 10) return 'أسئلة';
    return 'سؤالًا';
  }

  goBack(): void {
    if (this.requestedAttemptId) {
      this.router.navigate(['/student-trainings', this.examId]);
      return;
    }

    this.router.navigate(['/student-dashboard']);
  }
}
