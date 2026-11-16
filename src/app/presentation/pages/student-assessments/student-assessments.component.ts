import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Observable, catchError, combineLatest, map, of, shareReplay, startWith, switchMap } from 'rxjs';
import { IStudentAssessmentBusiness, STUDENT_ASSESSMENT_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/student-assessment.business.contract';
import { ToastService } from 'src/app/shared/services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { CurrentStudentAssessment, StudentAssessment, StudentAssessmentStatus } from 'src/app/domain/entities/student-assessment.entity';
import { StudentService } from 'src/app/data/api/student-api.service';
import { TableColumn } from 'src/app/presentation/models/table-column-ui-model';
import { DataTableService } from 'src/app/shared/services/data-table.service';
import { SharedPagination } from 'src/app/domain/entities/shared-pagination.entity';

@Component({
  selector: 'app-student-assessments',
  templateUrl: './student-assessments.component.html',
  styleUrl: './student-assessments.component.scss',
  standalone: false,
  providers: [DatePipe]
})
export class StudentAssessmentsComponent implements OnInit {
  columns: TableColumn[] = [
    { key: 'exam_name', label: 'STUDENT_DASHBOARD.TABLE.EXAM_NAME', sortable: true },
    { key: 'course_name', label: 'EXAMS.COURSE', sortable: true },
    { key: 'date_taken_display', label: 'EXAMS.DATE_TAKEN', sortable: true },
    { key: 'start_date_display', label: 'EXAMS.START_DATE', sortable: true },
    { key: 'score_display', label: 'EXAMS.SCORE', sortable: true },
    { key: 'pass_fail_display', label: 'EXAMS.PASS_FAIL', sortable: true },
    { key: 'status_display', label: 'EXAMS.STATUS', sortable: true },
    { key: 'actions', label: 'STUDENT_DASHBOARD.TABLE.ACTION', sortable: false }
  ];

  statuses = [
    { value: 'All', label: 'ALL' },
    { value: 'Completed', label: 'COMPLETED' },
    { value: 'Not Started', label: 'NOT_STARTED' },
    { value: 'Expired', label: 'EXPIRED' }
  ];

  filterForm = new FormGroup({
    courseId: new FormControl<number | null>(null),
    status: new FormControl<string>('All'),
    fromDate: new FormControl<string | null>(null),
    toDate: new FormControl<string | null>(null)
  });

  assessments$: Observable<any[]> = of([]);
  activeExams$: Observable<CurrentStudentAssessment[]> = of([]);
  courses$: Observable<{ id: number; name: string }[]> = of([]);
  isLoading = true;
  totalAssessments = 0;
  tableService = new DataTableService();

  constructor(
    @Inject(STUDENT_ASSESSMENT_BUSINESS_TOKEN)
    private readonly assessmentBusiness: IStudentAssessmentBusiness,
    private readonly router: Router,
    private readonly toastService: ToastService,
    private readonly translate: TranslateService,
    private readonly studentService: StudentService,
    private readonly datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.tableService.page = 1;
    });

    this.assessments$ = combineLatest([
      this.tableService.query$,
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value))
    ]).pipe(
      switchMap(([query, filters]) => this.loadAssessments(query, filters)),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.activeExams$ = this.loadCurrentAssessments();
    this.courses$ = this.loadCourses();
  }

  coursesList: { id: number; name: string }[] = [];

  private loadCourses(): Observable<{ id: number; name: string }[]> {
    return this.studentService.getStudentCoursesDetails().pipe(
      map(courses => {
        const mapped = courses.map(course => ({
          id: course.course_id,
          name: course.course_name
        }));
        this.coursesList = mapped;
        return mapped;
      }),
      catchError(error => {
        this.toastService.showError(this.translate.instant('EXAMS.FETCH_ERROR_MESSAGE'));
        console.error(error);
        return of([]);
      })
    );
  }

  getSelectedCourseName(courseId: number | null | undefined): string {
    if (!courseId) return '';
    const found = this.coursesList.find(c => c.id === courseId);
    return found ? found.name : '';
  }

  getSelectedStatusLabel(statusValue: string | null | undefined): string {
    const found = this.statuses.find(s => s.value === statusValue);
    return found ? found.label : 'ALL';
  }

  private loadCurrentAssessments(): Observable<CurrentStudentAssessment[]> {
    return this.assessmentBusiness.getCurrentStudentAssessments().pipe(
      catchError(error => {
        this.toastService.showError(this.translate.instant('EXAMS.FETCH_ERROR_MESSAGE'));
        console.error(error);
        return of([]);
      })
    );
  }

  private loadAssessments(query: SharedPagination, filters: any): Observable<any[]> {
    this.isLoading = true;
    const statusValue = query.status || filters.status || 'All';

    const fromDateStr = filters.fromDate instanceof Date
      ? this.datePipe.transform(filters.fromDate, 'yyyy-MM-dd')
      : filters.fromDate;
    const toDateStr = filters.toDate instanceof Date
      ? this.datePipe.transform(filters.toDate, 'yyyy-MM-dd')
      : filters.toDate;

    return this.assessmentBusiness.getStudentAssessments({
      page_no: query.page,
      page_size: query.pageSize,
      status: statusValue,
      course_id: filters.courseId ?? null,
      from_date: fromDateStr,
      to_date: toDateStr
    }).pipe(
      map(result => {
        this.isLoading = false;
        let items = result.items || [];
        this.totalAssessments = result.total_count ?? items.length;

        if (query.search && query.search.trim()) {
          const term = query.search.toLowerCase().trim();
          items = items.filter(item =>
            item.exam_name?.toLowerCase().includes(term) ||
            item.course_name?.toLowerCase().includes(term)
          );
        }

        if (query.sortColumn && query.sortDirection) {
          const col = query.sortColumn;
          const dir = query.sortDirection === 'asc' ? 1 : -1;
          items.sort((a: any, b: any) => {
            const valA = a[col] ?? '';
            const valB = b[col] ?? '';
            if (valA < valB) return -1 * dir;
            if (valA > valB) return 1 * dir;
            return 0;
          });
        }

        return items.map(item => {
          const status = item.status as StudentAssessmentStatus;
          return {
            ...item,
            status,
            date_taken_display: item.date_taken ? (this.datePipe.transform(item.date_taken, 'medium') || '-') : '-',
            start_date_display: item.start_date ? (this.datePipe.transform(item.start_date, 'medium') || '-') : '-',
            score_display: this.isSubmitted(status) && item.score != null ? `${item.score}/100` : '-',
            pass_fail_display: this.isSubmitted(status) ? (item.has_passed ? 'COMMON.PASS' : 'COMMON.FAIL') : '-',
            status_display: 'EXAMS.STATUS_OPTIONS.' + this.getStatusLabel(status)
          };
        });
      }),
      catchError(error => {
        this.isLoading = false;
        this.totalAssessments = 0;
        this.toastService.showError(this.translate.instant('EXAMS.FETCH_ERROR_MESSAGE'));
        console.error(error);
        return of([]);
      })
    );
  }

  clearDate(field: 'fromDate' | 'toDate'): void {
    this.filterForm.controls[field].setValue(null);
  }

  startExam(examId: number): void {
    this.router.navigate(['/exam', examId]);
  }

  viewResult(examId: number): void {
    this.router.navigate(['/exam-report', examId]);
  }

  getActionLabel(status: StudentAssessmentStatus): string {
    if (this.isNotStarted(status)) {
      return 'START_EXAM';
    }

    if (this.isSubmitted(status)) {
      return 'VIEW_RESULT';
    }

    return '';
  }

  canPerformAction(status: StudentAssessmentStatus): boolean {
    return this.isNotStarted(status) || this.isSubmitted(status);
  }

  isSubmitted(status: StudentAssessmentStatus | string): boolean {
    return status === StudentAssessmentStatus.COMPLETED || status === StudentAssessmentStatus.SUBMITTED;
  }

  isNotStarted(status: StudentAssessmentStatus | string): boolean {
    return status === StudentAssessmentStatus.NOT_STARTED;
  }

  getStatusClass(status: StudentAssessmentStatus | string): string {
    switch (status) {
      case StudentAssessmentStatus.COMPLETED:
      case StudentAssessmentStatus.SUBMITTED:
        return 'bg-success-subtle text-success';
      case StudentAssessmentStatus.NOT_STARTED:
        return 'bg-primary-subtle text-primary';
      case StudentAssessmentStatus.EXPIRED:
        return 'bg-danger-subtle text-danger';
      case StudentAssessmentStatus.SCHEDULED:
        return 'bg-warning-subtle text-warning';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  }

  getStatusLabel(status: StudentAssessmentStatus): string {
    switch (status) {
      case StudentAssessmentStatus.COMPLETED:
      case StudentAssessmentStatus.SUBMITTED:
        return 'SUBMITTED';
      case StudentAssessmentStatus.NOT_STARTED:
        return 'NOT_STARTED';
      case StudentAssessmentStatus.EXPIRED:
        return 'EXPIRED';
      case StudentAssessmentStatus.SCHEDULED:
        return 'SCHEDULED';
      default:
        return 'ALL';
    }
  }
}
