import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Observable, catchError, combineLatest, map, of, shareReplay, startWith, switchMap } from 'rxjs';
import { IStudentTrainingBusiness, STUDENT_TRAINING_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/student-training.business.contract';
import { ToastService } from 'src/app/shared/services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { CurrentStudentTraining, StudentTraining, StudentTrainingStatus } from 'src/app/domain/entities/student-training.entity';
import { StudentService } from 'src/app/data/api/student-api.service';
import { TableColumn } from 'src/app/presentation/models/table-column-ui-model';
import { DataTableService } from 'src/app/shared/services/data-table.service';
import { SharedPagination } from 'src/app/domain/entities/shared-pagination.entity';

@Component({
  selector: 'app-student-trainings',
  templateUrl: './student-trainings.component.html',
  styleUrl: './student-trainings.component.scss',
  standalone: false,
  providers: [DatePipe]
})
export class StudentTrainingsComponent implements OnInit {
  columns: TableColumn[] = [
    { key: 'exam_name', label: 'training.TRAINING_NAME', sortable: true },
    { key: 'course_name', label: 'training.COURSE', sortable: true },
    { key: 'last_attempt_date_display', label: 'training.LAST_ATTEMPT_DATE', sortable: true },
    { key: 'last_score_display', label: 'training.LAST_SCORE', sortable: true },
    { key: 'attempts_display', label: 'training.TOTAL_ATTEMPTS', sortable: true },
    { key: 'status_display', label: 'EXAMS.STATUS', sortable: true },
    { key: 'actions', label: 'STUDENT_DASHBOARD.TABLE.ACTION', sortable: false }
  ];

  statuses = [
    { value: 'All', label: 'ALL' },
    { value: 'Completed', label: 'COMPLETED' },
    { value: 'Not Started', label: 'NOT_STARTED' },
    { value: 'Scheduled', label: 'SCHEDULED' },
    { value: 'Expired', label: 'EXPIRED' }
  ];

  filterForm = new FormGroup({
    courseId: new FormControl<number | null>(null),
    status: new FormControl<string>('All'),
    fromDate: new FormControl<string | null>(null),
    toDate: new FormControl<string | null>(null)
  });

  trainings$: Observable<any[]> = of([]);
  activeTrainings$: Observable<CurrentStudentTraining[]> = of([]);
  courses$: Observable<{ id: number; name: string }[]> = of([]);
  isLoading = true;
  totalTrainings = 0;
  tableService = new DataTableService();

  coursesList: { id: number; name: string }[] = [];

  constructor(
    @Inject(STUDENT_TRAINING_BUSINESS_TOKEN)
    private readonly trainingBusiness: IStudentTrainingBusiness,
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

    this.trainings$ = combineLatest([
      this.tableService.query$,
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
      this.translate.onLangChange.pipe(startWith(null))
    ]).pipe(
      switchMap(([query, filters]) => this.loadTrainings(query, filters)),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.activeTrainings$ = this.loadCurrentTrainings();
    this.courses$ = this.loadCourses();
  }

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

  private loadCurrentTrainings(): Observable<CurrentStudentTraining[]> {
    return this.trainingBusiness.getCurrentStudentTrainings().pipe(
      catchError(error => {
        this.toastService.showError(this.translate.instant('EXAMS.FETCH_ERROR_MESSAGE'));
        console.error(error);
        return of([]);
      })
    );
  }

  private loadTrainings(query: SharedPagination, filters: any): Observable<any[]> {
    this.isLoading = true;
    const statusValue = query.status || filters.status || 'All';

    const fromDateStr = filters.fromDate instanceof Date
      ? this.datePipe.transform(filters.fromDate, 'yyyy-MM-dd')
      : filters.fromDate;
    const toDateStr = filters.toDate instanceof Date
      ? this.datePipe.transform(filters.toDate, 'yyyy-MM-dd')
      : filters.toDate;

    return this.trainingBusiness.getStudentTrainings({
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
        this.totalTrainings = result.total_count ?? items.length;

        if (query.search && query.search.trim()) {
          const term = query.search.toLowerCase().trim();
          items = items.filter((item: any) =>
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

        return items.map((item: any) => {
          const status = item.status as StudentTrainingStatus;
          const attemptsCount = item.attempts ?? 0;
          return {
            ...item,
            status,
            last_attempt_date_display: this.formatDate(item.last_attempt_date),
            last_score_display: item.last_score != null ? `${item.last_score}/100` : '-',
            attempts_display: attemptsCount,
            status_display: 'EXAMS.STATUS_OPTIONS.' + this.getStatusLabel(status)
          };
        });
      }),
      catchError(error => {
        this.isLoading = false;
        this.totalTrainings = 0;
        this.toastService.showError(this.translate.instant('EXAMS.FETCH_ERROR_MESSAGE'));
        console.error(error);
        return of([]);
      })
    );
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '-';

    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '-';

    const language = this.translate.currentLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB';
    return new Intl.DateTimeFormat(language, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  clearDate(field: 'fromDate' | 'toDate'): void {
    this.filterForm.controls[field].setValue(null);
  }

  startTraining(examId: number): void {
    this.router.navigate(['/training', examId]);
  }

  retake(examId: number): void {
    this.router.navigate(['/training', examId]);
  }

  viewDetails(examId: number): void {
    this.router.navigate(['/student-trainings', examId]);
  }

  getStatusClass(status: StudentTrainingStatus | string): string {
    switch (status) {
      case StudentTrainingStatus.COMPLETED:
        return 'bg-success-subtle text-success';
      case StudentTrainingStatus.NOT_STARTED:
        return 'bg-primary-subtle text-primary';
      case StudentTrainingStatus.EXPIRED:
        return 'bg-danger-subtle text-danger';
      case StudentTrainingStatus.SCHEDULED:
        return 'bg-warning-subtle text-warning';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  }

  getStatusLabel(status: StudentTrainingStatus | string): string {
    switch (status) {
      case StudentTrainingStatus.COMPLETED:
        return 'COMPLETED';
      case StudentTrainingStatus.NOT_STARTED:
        return 'NOT_STARTED';
      case StudentTrainingStatus.EXPIRED:
        return 'EXPIRED';
      case StudentTrainingStatus.SCHEDULED:
        return 'SCHEDULED';
      default:
        return 'ALL';
    }
  }
}
