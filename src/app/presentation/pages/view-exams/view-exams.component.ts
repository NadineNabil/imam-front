import { Component, Inject, OnInit } from '@angular/core';
import { Observable, catchError, map, of, switchMap, shareReplay } from 'rxjs';
import { DataTableService } from 'src/app/shared/services/data-table.service';
import { TableColumn } from 'src/app/presentation/models/table-column-ui-model';
import { Exam } from 'src/app/domain/entities/exam.entity';
import { IExamBusiness, EXAM_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/exam-business.contract';
import { SharedPagination } from 'src/app/domain/entities/shared-pagination.entity';
import { ToastService } from 'src/app/shared/services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ExamStatusEnum } from 'src/app/domain/enums/exam-status.enum';
import { ExamStateService } from 'src/app/shared/services/exam-state.service';

@Component({
  selector: 'app-view-exams',
  templateUrl: './view-exams.component.html',
  styleUrl: './view-exams.component.scss',
  standalone:false
})
export class ViewExamsComponent implements OnInit {
examStatusEnum = ExamStatusEnum;
  columns: TableColumn[] = [
    { key: 'examName', label: 'EXAMS.NAME', sortable: true },
    { key: 'examStatus', label: 'EXAMS.STATUS', sortable: true },
    { key: 'categoryName', label: 'EXAMS.CATEGORY', sortable: true },
    { key: 'courseName', label: 'EXAMS.COURSE', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false } 
  ];

  exams$!: Observable<Exam[]>;
  totalExams = 0;
  isLoading = true;


  tableService = new DataTableService();

  constructor(
    @Inject(EXAM_BUSINESS_TOKEN) private readonly examBusiness: IExamBusiness,
    private readonly toastService: ToastService,
    private readonly translate: TranslateService,
    private router:Router,
    private examStateService:ExamStateService
  ) {}

  ngOnInit(): void {
    this.exams$ = this.tableService.query$.pipe(
      switchMap(query => {
        const payload: SharedPagination = {
          page: query.page,
          pageSize: query.pageSize,
          search: query.search,
          sortColumn: query.sortColumn,
          sortDirection: query.sortDirection
        };

        return this.examBusiness.getAllExams(payload).pipe(
       map(result => {
        console.log('Fetched exams:', result); // Debugging line
  this.totalExams = result.totalItems;
  const mappedExams= result.items.map(exam => ({
    ...exam,
    examStatus: exam.examStatus,
    examStatusEnum : exam.examStatus
    
  }));
    // Cache exams for guard
  this.examStateService.setExams(mappedExams);
  this.isLoading = false;

  return mappedExams;
})

,
catchError(error => {
  this.toastService.showError(
    this.translate.instant('EXAMS.FETCH_ERROR_MESSAGE')
  );
  this.isLoading = false;
  console.error(error);
  this.totalExams = 0;
  return of([]);
          })
        );
      })
      ,
      // ensure multiple async pipes in the template share one subscription
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
    viewDetails(id: any) {
  this.router.navigate(['/exam-details/', id]);
  }   
  duplicateExam(exam_id: any){
    debugger
     this.examBusiness.duplicateExam(exam_id).subscribe( {
       next: (response) => {
        this.toastService.showSuccess(
         this.translate.instant('EXAMS.DUPLICATE_SUCCESS_MESSAGE')
        );
        // Optionally, refresh the exam list after retrying
        this.tableService.refresh();
      },
      error: (error) => {
        this.toastService.showError(
          this.translate.instant('EXAMS.DUPLICATE_ERROR_MESSAGE')
        );
        console.error(error);
      }
    });
  }
  retry(id: any) {
   this.examBusiness.retryExam(id).subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.message);
        // Optionally, refresh the exam list after retrying
        this.tableService.refresh();
      },
      error: (error) => {
        this.toastService.showError(
          this.translate.instant('EXAMS.RETRY_ERROR_MESSAGE')
        );
        console.error(error);
      }
    });
  }
}
