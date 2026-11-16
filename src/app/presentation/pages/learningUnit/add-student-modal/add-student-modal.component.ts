import { Component, Inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subject, takeUntil } from 'rxjs';
import { INVITATION_BUSINESS_TOKEN, InvitationBusiness } from 'src/app/domain/business-contracts/invitations-business.contract';

@Component({
  selector: 'app-add-student-modal',
  templateUrl: './add-student-modal.component.html',
  styleUrls: ['./add-student-modal.component.scss'],
  standalone: false
})
export class AddStudentModalComponent {
  @Input() courseId!: number;

  email = '';
  fullName = '';
  loading = false;


  private destroy$ = new Subject<void>();

  constructor(public activeModal: NgbActiveModal,
        @Inject(INVITATION_BUSINESS_TOKEN) private readonly InvitationBusiness: InvitationBusiness,

  ) {}

  confirm() {
    this.loading = true;

    // add send invitation to student 
    this.InvitationBusiness
      .addInvitationToStudent({ email: this.email, full_name: this.fullName, course_id: this.courseId })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (data) => {

              var response={message: data.message,result: true};
              this.activeModal.close(response)  
           }, 
           error: (err) => {

             var response={
                    message: err,result: false};
                    this.activeModal.close(response)  
           }
  });
  
 }

  cancel() {
    this.activeModal.dismiss('cancel');
  }


  addInvitationToStudent() {
  }


   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
