import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { COURSE_BUSINESS_TOKEN, ICourseBusiness } from 'src/app/domain/business-contracts/course-business.contract';
import { INVITATION_BUSINESS_TOKEN, InvitationBusiness } from 'src/app/domain/business-contracts/invitations-business.contract';
import { ToastService } from 'src/app/shared/services/toast-service';
import { InvitationStatus, StudentStatus } from 'src/app/domain/enums/Invitations.enum';
import { TranslateService } from '@ngx-translate/core';

// Presentation-level view model for courses - keep this in presentation layer to avoid importing domain entities
interface CourseView {
  id: number;
  name: string;
}

@Component({
  selector: 'app-view-invitations',
  templateUrl: './view-invitations.component.html',
  styleUrls: ['./view-invitations.component.scss'],
  standalone: false
})
export class ViewInvitationsComponent implements OnInit {
  invitations: any[] = [];
  InvitationStatusEnum=InvitationStatus;
  studentStatusEnum=StudentStatus;

  originalInvitations: any[] = [];
  totalCount: number = 0;
  courseId: number | null = null;
  courseName: string | null = null;
  filterCourseId: number | null = null;
  filterStatus: string | null = null;
 
  pageNo: number=1;
  pageSize:number=5;
  loading: boolean=false;
  studentName: any=null;
  email: any=null;
  status: any=null;

  constructor(
    private route: ActivatedRoute,
    @Inject(COURSE_BUSINESS_TOKEN) private courseBusiness: ICourseBusiness,
    @Inject(INVITATION_BUSINESS_TOKEN) private invitationBusiness: InvitationBusiness,
    private toast: ToastService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
     
     this.LoadInvitation(1);
       
    
  }

  LoadInvitation(pageNo:number)
  {
         this.loading=true;

    // Load invitations (all) from business
        var payload = {
                      "page_no": pageNo,
                      "page_size": this.pageSize,
                      "course_id": this.filterCourseId,
                      "student_name": this.studentName,
                      "email": this.email,
                      "status": this.filterStatus == "all" ?null:this.filterStatus 
                    };
                    
        this.invitationBusiness.getInvitations!(payload).subscribe({
          next: (data: any) => {
            
            const items =  data.items ;
            
            this.originalInvitations = items.map((i: any) => ({
              ...i,
              sent_at: i.sent_at || i.updated_at || i.created_at
            }));
            this.totalCount = data?.total_count;
            
            this.invitations=this.originalInvitations;
            
            this.loading=false;

          },
          error: () => {
            this.loading=false;

          }
        });
      
  }

  onFilterChange(courseId?: number) {
    this.filterCourseId = courseId ? Number(courseId) : null;
    this.LoadInvitation(1);
  }

  onStatusChange(status?: string) {
    this.filterStatus = status || null;
    this.LoadInvitation(1);
  }

 
/*
  onEmailChange(value: string) {
  this.email = value;
  this.LoadInvitation(1);
}
*/
/*
onStudentNameChange(value: string) {
  this.studentName = value;
  this.LoadInvitation(1);
}
*/

  resend(invitationId: number) {

    this.loading=true;
    
      this.invitationBusiness.resendInvitation!(invitationId).subscribe({
        next: () => {
          // update local row (set sent date and status)
          const inv = this.invitations.find(i => i.id === invitationId) || this.originalInvitations.find(i => i.id === invitationId);
          if (inv) {
            inv.sent_at = new Date().toISOString();
            inv.invitation_status = this.InvitationStatusEnum.PENDING;
           // inv.user_status = inv.user_status === 'Cancelled' ? inv.user_status : inv.user_status;
          }

          this.loading=false;
          this.toast.showSuccess(this.translate.instant('INVITATIONS.ACTIONS.RESEND'));
         
        },
        error: (err) => {

           this.loading=false;
            this.toast.showError(err);
        }
      });
    }
  

  cancel(invitationId: number) {

     this.loading=true;
     this.invitationBusiness.cancelInvitation!(invitationId).subscribe({
          next: (data: any) => {
              // update local row (set sent date and status)
          const inv = this.invitations.find(i => i.id === invitationId) || this.originalInvitations.find(i => i.id === invitationId);
          if (inv) {
            inv.sent_at = new Date().toISOString();
            inv.invitation_status = this.InvitationStatusEnum.CANCELED;
           // inv.user_status = inv.user_status === 'Cancelled' ? inv.user_status : inv.user_status;
          }
          this.toast.showSuccess(this.translate.instant('INVITATIONS.ACTIONS.CANCEL'));
            this.loading=false;

          },
          error: (err) => {
            this.toast.showError(err);
             this.loading=false;


          }
        });
  }

  applyAllFilters()
  {
    this.LoadInvitation(1);
  }

  hasDropdownActions(inv: any): boolean {
  return (
    inv.invitation_status === this.InvitationStatusEnum.PENDING ||
    inv.invitation_status === this.InvitationStatusEnum.EXPIRED ||
    (inv.student_status === this.studentStatusEnum.PENDING &&
     inv.invitation_status !== this.InvitationStatusEnum.CANCELED)
  );
}
}
