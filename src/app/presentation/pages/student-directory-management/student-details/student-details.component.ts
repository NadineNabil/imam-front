import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ADMIN_STUDENT_BUSINESS_TOKEN, IAdminStudentBusiness } from 'src/app/domain/business-contracts/admin-student-business.contract';
import { Student } from 'src/app/domain/entities/student.entity';
import { studentStatus } from 'src/app/domain/enums/student-status.enum';
import { studentCourseStatus } from 'src/app/domain/enums/studentCourseStatus';
import { ToastService } from 'src/app/shared/services/toast-service';

@Component({
  selector: 'app-student-details',
  standalone: false,
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.scss',
})
export class StudentDetailsComponent implements OnInit {
  stdId!:number
  student!:Student
  studentCourseStatus=studentCourseStatus
  studentStatus=studentStatus
constructor(private route:ActivatedRoute,private toastService:ToastService,private translate:TranslateService,@Inject(ADMIN_STUDENT_BUSINESS_TOKEN) private readonly adminStudentBusiness:IAdminStudentBusiness){}
ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');

    if (!id) return;

    this.stdId = Number(id);

    this.adminStudentBusiness.getStudentById(this.stdId).subscribe({
      next: (res) => {
        console.log(res)
        this.student=res
      },
      error: (err) => {
        console.error(err);
      }
    });
  });
}
getStatusClass(status: string|undefined): string {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'status-active';
    case 'revoked':
      return 'status-revoked';
        case 'cancelled':
      return 'status-cancelled';
    default:
      return '';
  }
}
revoke(courseId:number){
  this.adminStudentBusiness.updateCourseStatus(this.stdId,courseId,this.studentCourseStatus.Revoked).subscribe({
    next:(res)=>{
      this.toastService.showSuccess(this.translate.instant(res.message));
      this.adminStudentBusiness.getStudentById(this.stdId).subscribe({
        next: (res) => {
           this.student=res
   
        },
        error: (err) => {
          this.toastService.showError(err);
        }
      });
    },
    error:(err)=>{
      this.toastService.showError(err);
    }
  })
}
getStudentStatusClass(status: string|undefined): string {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'std-status-active';
    case 'revoked':
      return 'std-status-revoked';
      case 'pending':
      return 'std-status-pending';
    case 'cancelled':
      return 'std-status-cancelled';
    default:
      return '';
  }
}
}


