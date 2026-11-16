import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IStudentBusiness, STUDENT_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/student-business.contract';
import { Student } from 'src/app/domain/entities/student.entity';
import { FileToBase64Service } from 'src/app/shared/services/file-to-base64.service';
import { StudentProfileStateService } from 'src/app/shared/services/StudentProfileState.service';
import { ToastService } from 'src/app/shared/services/toast-service';

@Component({
  selector: 'app-edit-profile-student',
  standalone: false,
  templateUrl: './edit-profile-student.component.html',
  styleUrl: './edit-profile-student.component.scss',
})
export class EditProfileStudentComponent {
profileForm!: FormGroup;
selectedFile!: File;
profileChanged = false; 
languages = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' }
];
constructor( @Inject(STUDENT_BUSINESS_TOKEN) private studentBusiness: IStudentBusiness, private translate:TranslateService,private toastService:ToastService,private fileService: FileToBase64Service,private fb: FormBuilder,private profileStore: StudentProfileStateService) {}
ngOnInit() {

  const student = this.profileStore.student();

  this.profileForm = this.fb.group({
    imageUrl: [student?.profilePictureUrl || ''],
    studentName: [`${student?.firstName || ''} ${student?.lastName || ''}`],
    phoneNumber: [{ phoneNumber: student?.phoneNumber || '', countryCode: student?.countryCode || '', isValid: true }],
    preferredLanguage: [student?.preferredLanguage || 'en'],
  });

   this.profileForm.valueChanges.subscribe(value => {
  this.profileChanged=true
});
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
    this.profileForm.patchValue({ imageUrl: base64 });
  }
  );
}

applyChanges() {
  //check if phone number is valid before sending the request
  const data = this.profileForm.value;

    if(!data.phoneNumber.isValid){
    this.toastService.showError(this.translate.instant('PROFILE.WRONG_PHONE_NUMBER'));
    return;}
  
  //prepare the data to be sent to the API
  const updatedStudent: Partial<Student> = {
  profilePictureUrl: data.imageUrl,
  phoneNumber: data.phoneNumber.phoneNumber,
  countryCode: data.phoneNumber.countryCode
};
//send the update request to the API
   this.studentBusiness.editStudentProfile({
    updatedStudent
    } as any
).subscribe({
    next: (res) => {
      this.toastService.showSuccess(res.message);
      // Update the student profile in the state store
      this.profileStore.setStudent({
        ...this.profileStore.student(),
        phoneNumber: data.phoneNumber.phoneNumber,
        countryCode:data.phoneNumber.countryCode,
        profilePictureUrl: data.imageUrl
      }as Student);
    }
    ,error: (err) => {
      console.log(err.message)
      this.toastService.showError(this.translate.instant(err.message));
    }
  }); 


}

}
