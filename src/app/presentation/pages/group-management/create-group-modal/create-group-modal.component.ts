import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GROUP_BUSINESS_TOKEN, IGroupBusiness } from 'src/app/domain/business-contracts/group-business.contract';
import { ToastService } from 'src/app/shared/services/toast-service';

@Component({
  selector: 'app-create-group-modal',
  standalone: false,
  templateUrl: './create-group-modal.component.html',
  styleUrl: './create-group-modal.component.scss',
})
export class CreateGroupModalComponent  {
  groupForm!:FormGroup
  private modal: any;
  @Output() groupCreated = new EventEmitter<any>();
    
  constructor(private fb:FormBuilder, @Inject(GROUP_BUSINESS_TOKEN)
  private readonly groupBusiness: IGroupBusiness,private toastService: ToastService,private translate: TranslateService) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      description: ['',  [
    Validators.minLength(3),
    Validators.maxLength(500)
  ]]
    });
  }
ngAfterViewInit(): void {
  const element = document.getElementById('createGroupModal');
  if (element) {
    this.modal = (window as any).bootstrap?.Modal?.getOrCreateInstance(element);
  }
}


saveGroup(){
  
 this.groupBusiness.createGroup(this.groupForm.value).subscribe({
  next:(response)=>{
    this.toastService.showSuccess(this.translate.instant('GROUP_MANAGEMENT.CREATE_SUCCESS_MESSAGE'));
     this.groupForm.reset();
     
      this.modal.hide(); 
// Notify parent
        this.groupCreated.emit(response);
  },
  error:(error)=>{
    this.toastService.showError(error);
  }
 })
}
resetForm(): void {
  this.groupForm.reset();
}
onHideModal(): void {
  (document.activeElement as HTMLElement)?.blur();
}
}
