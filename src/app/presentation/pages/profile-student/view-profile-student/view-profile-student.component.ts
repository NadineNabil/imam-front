import { Component, effect, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AUTH_BUSINESS_TOKEN, IAuthBusiness } from 'src/app/domain/business-contracts/auth-business.contract';
import { IStudentBusiness, STUDENT_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/student-business.contract';
import { Student } from 'src/app/domain/entities/student.entity';
import { ChangePasswordModalComponent } from 'src/app/shared/components/change-password-modal/change-password-modal.component';
import { FileToBase64Service } from 'src/app/shared/services/file-to-base64.service';
import { StudentProfileStateService } from 'src/app/shared/services/StudentProfileState.service';
import { ToastService } from 'src/app/shared/services/toast-service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-view-profile-student',
  templateUrl: './view-profile-student.component.html',
  styleUrl: './view-profile-student.component.scss',
  standalone: false
})
export class ViewProfileStudentComponent implements OnInit {
student!: Student
profileForm!: FormGroup;
selectedFile!: File;
profileChanged:boolean=false
imageControl = new FormControl('');
editPhone:boolean=false
fullPhoneNumber:any;
editLanguage:boolean=false
languages = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' }
];
  constructor(   @Inject(AUTH_BUSINESS_TOKEN) private authBusiness: IAuthBusiness, private translate:TranslateService,
  private toastService:ToastService,
  private fileService: FileToBase64Service,
  private fb: FormBuilder,private modalService:NgbModal
  ,private profileStore: StudentProfileStateService, 
  private  router: Router, 
   @Inject(STUDENT_BUSINESS_TOKEN) private studentBusiness: IStudentBusiness) {}
  
  ngOnInit(): void {
    

  this.getStudentProfile();
    const student = this.profileStore.student();
  // standalone image control
  console.log(student,'studfntt')
  

    this.imageControl.setValue(
      student?.profilePictureUrl
        ? environment.imageUrl +'/'+ student.profilePictureUrl
        : ''
    );

  
  }


  setFormData(student:any)
  {

    this.profileForm = this.fb.group({
      studentName: [`${student?.firstName || ''} ${student?.lastName || ''}`],
      phoneNumber: [{ phoneNumber: student?.phoneNumber || '',
      countryCode: student?.countryCode || '',
      isValid: true }],
      preferredLanguage: [student?.preferredLanguage || 'en'],
  });



    this.imageControl.setValue(
      student?.profilePictureUrl
        ?  environment.imageUrl +'/'+ student.profilePictureUrl
        : ''
    );


   this.profileForm.valueChanges.subscribe(value => {
  console.log('Form value changed:', value);
  this.profileChanged=true
});
  }
updatePhoto(){
this.router.navigate(['/profile-student/edit-profile-student']);
}
editProfile(){
this.router.navigate(['/profile-student/edit-profile-student']);
}

getStudentProfile(){
  const id = Number(this.authBusiness.getCurrentUser()?.id);
  this.studentBusiness.getStudentProfile(id).subscribe({
    next: (student) => {
      this.student = student;
      this.setFormData(student);
       this.profileStore.setStudent(student);
    },
    error: (err) => {
      console.error('Error fetching student profile:', err);
    }
  });
}

openPasswordModal(){
  
 this.modalService.open(ChangePasswordModalComponent,
     { centered: true });

  
}

onFileChange(event: any) {
    const file: File = event.target.files?.[0];

  if (!file) return;

  // 1. Validate size (5MB max)
  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    this.toastService.showError(this.translate.instant('PROFILE.FILE_SIZE_ERROR'));
    return;
  }

  // 2. Validate type (JPG / PNG only)
  const allowedTypes = ['image/jpeg', 'image/png'];

  if (!allowedTypes.includes(file.type)) {
    this.toastService.showError(this.translate.instant('PROFILE.INVALID_FILE_TYPE'));
    return;
  }
    this.selectedFile = event.target.files[0];
  this.fileService.fileToBase64(this.selectedFile).then((base64) => {

   this.imageControl.setValue(base64);

    const updatedStudent: Partial<Student> = {
      profilePictureUrl: base64
    };

    this.studentBusiness.editStudentImageProfile(
      updatedStudent as Student
    ).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message);
      },
      error: (err) => {
        this.toastService.showError(this.translate.instant(err));
      }
    });

  });
}
cancelPhoneEdit() {

  const student = this.profileStore.student();


  this.profileForm.patchValue({
    phoneNumber: {
      phoneNumber: student?.phoneNumber || '',
      countryCode: student?.countryCode || '',
      isValid: true
    }
  });

  this.editPhone = false;
}
savePhoneNumber(){

  const data = this.profileForm.value;
    if(!data.phoneNumber.isValid){
    this.toastService.showError(this.translate.instant('PROFILE.WRONG_PHONE_NUMBER'));
    return;}

    var countryCode=this.profileForm.get('phoneNumber')?.value?.countryCode;
    var fullPhone=this.profileForm.get('phoneNumber')?.value?.phoneNumber;
  
    const phone = fullPhone.startsWith(countryCode)
                  ? fullPhone.slice(countryCode.length)
                  : fullPhone;

        this.profileForm.patchValue({
          phoneNumber: {
            countryCode: countryCode,
            phoneNumber: phone,
            isValid:true

          }
        });

  this.profileStore.setStudent({
    ...this.profileStore.student(),
    phoneNumber:this.profileForm.get('phoneNumber')?.value?.phoneNumber,
    countryCode: this.profileForm.get('phoneNumber')?.value?.countryCode
  } as Student);
  this.editPhone=false
}
saveLanguage() {

  const language = this.profileForm.get('preferredLanguage')?.value;

  this.profileStore.setStudent({
    ...this.profileStore.student(),
    preferredLanguage: language
  } as Student);

  this.editLanguage = false;
}
cancelLanguageEdit() {

  this.profileForm.patchValue({
    preferredLanguage:
      this.profileStore.student()?.preferredLanguage || 'en'
  });

  this.editLanguage = false;
}
applyChanges() {
  //check if phone number is valid before sending the request
  const data = this.profileForm.value;

    if(!data.phoneNumber.isValid){
    this.toastService.showError(this.translate.instant('PROFILE.WRONG_PHONE_NUMBER'));
      return;
    }
  
    const countryCode =data.phoneNumber.countryCode? data.phoneNumber.countryCode.startsWith('+')
  ? data.phoneNumber.countryCode
  : `+${data.phoneNumber.countryCode}`:null;

const phone = data.phoneNumber.phoneNumber;

const updatedStudent: Partial<Student> = {
  countryCode,
  phoneNumber: phone.startsWith(countryCode)
    ? phone.replace(countryCode, '')
    : phone,
  preferredLanguage: data.preferredLanguage
};
//send the update request to the API
   this.studentBusiness.editStudentProfile(
     updatedStudent as Student
    
).subscribe({
    next: (res) => {
      this.toastService.showSuccess(res.message);
      // Update the student profile in the state store
    }
    ,error: (err) => {
      this.toastService.showError(this.translate.instant(err));
    }
  }); 


}

getDisplayPhone(): string {
  const phone = this.profileForm.get('phoneNumber')?.value?.phoneNumber || '';
  const countryCode = this.profileForm.get('phoneNumber')?.value?.countryCode || '';

 
  const phoneNumber = phone.startsWith('+')
    ? phone.slice(countryCode.length+1)
    : phone;

 
  return phoneNumber
}
editPhoneNumber() {
  const student = this.profileStore.student();

  const countryCode = student?.countryCode ?? '';
  let phone = student?.phoneNumber ?? '';

  // Remove country code if it is included
  if (phone.startsWith(countryCode)) {
    phone = phone.substring(countryCode.length);
  }

  this.profileForm.patchValue({
    phoneNumber: {
      countryCode,
      phoneNumber: phone,
      isValid: true
    }
  });

  this.editPhone = true;
}

}
