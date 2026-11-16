import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, combineLatest, map, of, shareReplay, startWith, switchMap } from 'rxjs';
import { IStudentTrainingBusiness, STUDENT_TRAINING_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/student-training.business.contract';
import { ToastService } from 'src/app/shared/services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn } from 'src/app/presentation/models/table-column-ui-model';
import { DataTableService } from 'src/app/shared/services/data-table.service';

export interface TrainingAttempt {
  attempt_number: number;
  attempt_label: string;
  date: string | null;
  score: number | null;
  duration_minutes: number | null;
  exam_attempt_id?: number | string | null;
  latest?: boolean;
}

export interface TrainingDetailData {
  exam_id: number;
  exam_name: string;
  course_name: string;
  status: string;
  total_attempts: number;
  attempts: TrainingAttempt[];
}

@Component({
  selector: 'app-training-detail',
  templateUrl: './training-detail.component.html',
  styleUrl: './training-detail.component.scss',
  standalone: false,
})
export class TrainingDetailComponent implements OnInit {
  trainingId!: number;
  trainingDetail$: Observable<TrainingDetailData | null> = of(null);
  isLoading = true;
  attemptColumns: TableColumn[] = [
    { key: 'attempt_display', label: 'training.ATTEMPT_LABEL', sortable: true },
    { key: 'date_display', label: 'training.DATE', sortable: true },
    { key: 'score_display', label: 'training.SCORE', sortable: true },
    { key: 'duration_display', label: 'training.DURATION', sortable: true },
    { key: 'actions', label: 'training.ACTION', sortable: false }
  ];

  tableService = new DataTableService();
  attempts$: Observable<any[]> = of([]);
  totalAttemptRecords = 0;
  attemptRowClass = (attempt: TrainingAttempt): string => attempt.latest ? 'attempt-latest' : '';

  constructor(
    @Inject(STUDENT_TRAINING_BUSINESS_TOKEN)
    private readonly trainingBusiness: IStudentTrainingBusiness,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastService: ToastService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.trainingId = Number(this.route.snapshot.paramMap.get('id'));

    this.trainingDetail$ = this.translate.onLangChange.pipe(
      startWith(null),
      switchMap(() => this.fetchDetail()),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.attempts$ = combineLatest([
      this.trainingDetail$,
      this.tableService.query$,
      this.translate.onLangChange.pipe(startWith(null))
    ]).pipe(
      map(([detail, query]) => {
        let attempts = (detail?.attempts ?? []).map(a => ({
          ...a,
          attempt_display: `${a.attempt_label}${a.latest ? ` (${this.translate.instant('training.LATEST')})` : ''}`,
          date_display: this.formatDate(a.date),
          score_display: this.formatScore(a.score),
          duration_display: this.formatDuration(a.duration_minutes)
        }));

        this.totalAttemptRecords = attempts.length;

        if (query.sortColumn && query.sortDirection) {
          const direction = query.sortDirection === 'asc' ? 1 : -1;
          attempts = [...attempts].sort((a: any, b: any) => {
            const valueA = a[query.sortColumn!] ?? '';
            const valueB = b[query.sortColumn!] ?? '';

            if (valueA < valueB) return -1 * direction;
            if (valueA > valueB) return 1 * direction;
            return 0;
          });
        }

        return attempts;
      })
    );
  }

  private fetchDetail(): Observable<TrainingDetailData | null> {
    this.isLoading = true;
    return this.trainingBusiness.getTrainingDetails(this.trainingId).pipe(
      map((data: any) => {
        this.isLoading = false;
        const history = data.training_history ?? data.attempts ?? [];
        const attempts: TrainingAttempt[] = history.map((item: any, idx: number) => {
          const durationSeconds = item.duration_seconds ?? item.durationSeconds;
          const durationMinutes = item.duration_minutes ?? item.durationMinutes ?? item.duration ?? null;
          const attemptNumber = item.attempt_number ?? item.attemptNumber ?? null;

          return {
            attempt_number: attemptNumber ?? idx + 1,
            attempt_label: item.attempt_name ?? item.attemptName ?? '',
            date: item.started_at ?? item.startedAt ?? item.completed_at ?? item.completedAt ?? item.date ?? item.attempt_date ?? item.attemptDate ?? null,
            score: item.student_score ?? item.studentScore ?? item.score ?? null,
            duration_minutes: durationSeconds != null ? Math.round(Number(durationSeconds) / 60) : (durationMinutes != null ? Math.round(Number(durationMinutes)) : null),
            exam_attempt_id: item.attempt_id ?? item.attemptId ?? item.exam_attempt_id ?? item.examAttemptId ?? item.student_exam_id ?? null
          };
        });

        attempts.sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        const fallbackPrefix = this.translate.currentLang === 'ar' ? 'محاولة' : 'Attempt';

        return {
          exam_id: data.training_id ?? data.exam_id,
          exam_name: data.training_name ?? data.exam_name,
          course_name: data.course_name,
          status: data.status ?? 'Completed',
          total_attempts: attempts.length,
          attempts: attempts.map((attempt, index) => ({
            ...attempt,
            attempt_label: attempt.attempt_label || `${fallbackPrefix} ${attempt.attempt_number || attempts.length - index}`,
            latest: index === 0
          }))
        };
      }),
      catchError(error => {
        this.isLoading = false;
        this.toastService.showError(this.translate.instant('EXAMS.FETCH_ERROR_MESSAGE'));
        console.error(error);
        return of(null);
      })
    );
  }

  goBack(): void {
    this.router.navigate(['/student-trainings']);
  }

  viewAttemptDetail(attempt: TrainingAttempt): void {
    if (!attempt.exam_attempt_id) {
      return;
    }

    this.router.navigate(['/exam-report', this.trainingId], {
      queryParams: {
        attemptNumber: attempt.attempt_number,
        attemptId: attempt.exam_attempt_id
      }
    });
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

  formatScore(score: number | null): string {
    return score != null ? `${score}%` : '-';
  }

  formatDuration(minutes: number | null): string {
    if (minutes == null) return '-';

    return `${minutes} ${this.translate.instant('training.DURATION_MINUTES')}`;
  }

  getScoreClass(score: number | null): string {
    if (score == null) return 'text-muted';
    if (score >= 80) return 'text-success fw-semibold';
    if (score >= 60) return 'text-warning fw-semibold';
    return 'text-danger fw-semibold';
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      'Completed':   'bg-success text-white',
      'Not Started': 'bg-secondary text-white',
      'Scheduled':   'bg-info text-white',
      'Expired':     'bg-danger text-white'
    };
    return map[status] ?? 'bg-secondary text-white';
  }
}
