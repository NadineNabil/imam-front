import { Component, Inject, OnInit } from '@angular/core';
import { TableColumn } from '../../models/table-column-ui-model';
import { Student } from 'src/app/domain/entities/student.entity';
import { catchError, map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { DataTableService } from 'src/app/shared/services/data-table.service';
import { ADMIN_STUDENT_BUSINESS_TOKEN, IAdminStudentBusiness } from 'src/app/domain/business-contracts/admin-student-business.contract';
import { ToastService } from 'src/app/shared/services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { SharedPagination } from 'src/app/domain/entities/shared-pagination.entity';
import { studentStatus } from 'src/app/domain/enums/student-status.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-directory-management',
   standalone:false, 
    templateUrl: './student-directory-management.component.html',
  styleUrl: './student-directory-management.component.scss',
})
export class StudentDirectoryManagementComponent implements OnInit{

columns: TableColumn[] = [
  {
    key: 'name',
    label: 'STUDENT-MANAGEMENT.NAME',
    sortable: true
  },
  {
    key: 'email',
    label: 'STUDENT-MANAGEMENT.EMAIL',
    sortable: true
  },
  {
    key: 'status',
    label: 'STUDENT-MANAGEMENT.STATUS',
    sortable: true
  },
  {
    key: 'enrollmentsCount',
    label: 'STUDENT-MANAGEMENT.ENROLLMENTS',
    sortable: true
  },
  {
    key: 'actions',
    label: 'COMMON.ACTIONS',
    sortable: false
  }
];
isLoading:boolean=false
  students$!: Observable<Student[]>;
  totalStudents = 0;
  tableService = new DataTableService();
  statusOptions = Object.values(studentStatus).map(status => ({
  label: `ENUM.STUDENT_STATUS.${status}`,
  value: status
})); 
 
constructor(private router:Router,private toastService:ToastService,private translate:TranslateService,@Inject(ADMIN_STUDENT_BUSINESS_TOKEN) private readonly adminStudentBusiness: IAdminStudentBusiness, ){}
  
 ngOnInit(): void {
 this.isLoading=true
  this.students$ = this.tableService.query$.pipe(
      switchMap(query => {
        const payload: SharedPagination = {
          page: query.page,
          pageSize: query.pageSize,
          search: query.search,
          sortColumn: query.sortColumn,
          sortDirection: query.sortDirection,
          status: query.status,
          columnFilters: query.columnFilters
        };

        return this.adminStudentBusiness.getAllStudents(payload).pipe(
          map((result: { totalItems: number; items: any[] }) => {
            console.log('Fetched students:', result); // Debugging line
                  this.totalStudents = result.totalItems;
                  const mappedStudents= result.items.map((student:any) => ({
                  ...student,
                  name: student.firstName + ' ' + student.lastName,
                  email: student.email,
                  enrollmentsCount: student.enrollmentsCount
                }));
                this.isLoading = false;

  return mappedStudents;
})

,
catchError(error => {
  this.toastService.showError(
    error.message
  );
  this.isLoading = false;
  console.error(error);
  this.totalStudents = 0;
  return of([]);
          })
        );
      })
      ,
      // ensure multiple async pipes in the template share one subscription
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }


  viewStudent(id:number){
   this.router.navigate([`/student-management/student-details/${id}`])
  }
}
