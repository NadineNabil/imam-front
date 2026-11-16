import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast-service';
import { AuthApiService } from 'src/app/data/api';
import { UpdatePasswordData } from 'src/app/domain/entities';
import { AUTH_BUSINESS_TOKEN, IAuthBusiness } from 'src/app/domain/business-contracts';
import { StorageService } from '../../services';
import { ModalService } from '../../services/modal-service.service';
import { ApiResponse, ErrorApiResponse } from 'src/app/domain/entities/api-response.entity';
import { LogoutConfirmationModalComponent } from '../logout-confirmation-modal/logout-confirmation-modal.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-change-password-modal',
  standalone:false,
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss',
})
export class ChangePasswordModalComponent implements OnInit {
passwordForm!:FormGroup
showCurrentPassword = false;
showNewPassword = false;
showConfirmPassword = false;
constructor(private router:Router,
  @Inject(AUTH_BUSINESS_TOKEN) private authBusiness: IAuthBusiness,
   private storageService: StorageService,
   public activeModal: NgbActiveModal,
   private toastService:ToastService,private fb:FormBuilder){}



ngOnInit(): void {
this.passwordForm=this.fb.group({
currentPassword:['',Validators.required],
newPassword: ['', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$/)
  ]],
  confirmPassword: ['', Validators.required]
}, { validators: this.passwordMatchValidator });

}
passwordMatchValidator(form:any){
  const newPassword=form.get('newPassword')?.value;
   const confirmPassword = form.get('confirmPassword')?.value;
   const confirmPassControl=form.get('confirmPassword')
 if(newPassword!==confirmPassword && confirmPassControl.dirty){
  return { mismatch: true };
  }
  return null
}
changePassword() {
  if (this.passwordForm.invalid) {
    this.passwordForm.markAllAsTouched();
    return;
  }
  const authTokens = this.storageService.getSession('auth_tokens') as { access_token?: string };
const token = authTokens?.access_token  ;
if(!token){
  return
}

const email = this.authBusiness.getCurrentUser()?.username||'';
const payload = {
  current_password: this.passwordForm.get('currentPassword')?.value,
  new_password: this.passwordForm.get('newPassword')?.value,
  comfirm_password: this.passwordForm.get('confirmPassword')?.value
};
  this.authBusiness.changePassword(payload).subscribe({
    next: (res: ApiResponse) => {

      
      
      this.toastService.showSuccess(res.message);

    this.activeModal.close();
 
    },
  error: (err: string) => {

  this.toastService.showError(err);
}
  });
}
resetPasswordForm(){
   this.passwordForm.reset()
     this.showCurrentPassword = false;
  this.showNewPassword = false;
  this.showConfirmPassword = false;
}
cancel(){
  this.activeModal.close()
}
/*   logout() {

        this.authBusiness.logout().subscribe({
          complete: () => {
            this.router.navigate(['/account/auth/logout']);
          }
        });
      }
 */
}


