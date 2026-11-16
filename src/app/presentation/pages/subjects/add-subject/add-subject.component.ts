import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FileToBase64Service } from 'src/app/shared/services/file-to-base64.service';
import { COURSE_BUSINESS_TOKEN, ICourseBusiness } from 'src/app/domain/business-contracts/course-business.contract';
import { ToastService } from 'src/app/shared/services/toast-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-subject',
  standalone: false,
  templateUrl: './add-subject.component.html',
  styleUrl: './add-subject.component.scss',
})
export class AddSubjectComponent {
addCourseform:FormGroup
  submit!: boolean;
  loading!: boolean;
  fileError:boolean=false
  exceededMessage: string = 'SUBJECT.MAX_FILES_EXCEEDED';

constructor(private fb:FormBuilder,private fileToBase64Service:FileToBase64Service,private translate:TranslateService,
    @Inject(COURSE_BUSINESS_TOKEN) private  ICourseBusiness: ICourseBusiness,private toast:ToastService,
    private router:Router
){ 
this.addCourseform = this.fb.group({
  name: ['', [Validators.required, Validators.pattern(/\S+/)]],
  description: [''],
  courseImage: ['']
});

}

onAddingFile(file:File|null){
  if(!file){
     this.addCourseform.patchValue({ courseImage: null });
    return;
  }
this.fileToBase64Service.fileToBase64(file).then(base64 => {
  const image=base64.split(',')[1];
  this.addCourseform.patchValue({ courseImage: image });
}).catch(error => {
  console.error('Error converting file to Base64:', error)
});
}
addCourseSubmit(){
    this.submit = true;
if(this.addCourseform.valid){
this.loading = true;
this.ICourseBusiness.addCourse(this.addCourseform.value).subscribe({
  next:()=>{
    this.loading = false;
    this.submit = false;
    this.router.navigate(['/subjects/all-subjects']);
       this.toast.showSuccess(this.translate.instant('COURSE.ADD_SUCCESS_MESSAGE'));

  },
  error:(err)=>{
    this.toast.showError(this.translate.instant('COURSE.ADD_ERROR_MESSAGE'));
    this.loading = false;
    this.submit = false;
}

});
}}

}
