import { Component, Inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FileToBase64Service } from 'src/app/shared/services/file-to-base64.service';
import { COURSE_BUSINESS_TOKEN, ICourseBusiness } from 'src/app/domain/business-contracts/course-business.contract';
import { CATEGORY_BUSINESS_TOKEN, ICategoryBusiness } from 'src/app/domain/business-contracts/category-business.contract';
import { SUBCATEGORY_BUSINESS_TOKEN, ISubCategoryBusiness } from 'src/app/domain/business-contracts/subCategory-business.contract';
import { ToastService } from 'src/app/shared/services/toast-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of, config } from 'rxjs';
import { Category } from 'src/app/domain/entities/category.entity';
import { SubCategory } from 'src/app/domain/entities/subCategory.entity';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConfig } from 'src/app/data/config/api.config';
import { FileUploadComponent } from 'src/app/shared/widget/file-upload/file-upload.component';

@Component({
  selector: 'app-edit-course',
  standalone:false,
  templateUrl: './edit-course.component.html',
  styleUrl: './edit-course.component.scss',
})

export class EditCourseComponent {
  maxImageSize = 2 * 1024 * 1024; // 1MB
  Courseform:FormGroup
  submit!: boolean;
  loading!: boolean;
  fileError:boolean=false
  exceededMessage: string = 'SUBJECT.MAX_FILES_EXCEEDED';
  selectedCategoryId = signal<number | null>(null);
  selectedSubCategoryId = signal<number | null>(null);
  categories = toSignal(this.CategoryBusiness.getAllCategories(), { initialValue: [] });
  courseId:any;
  @ViewChild('fileInput') fileUpload!: FileUploadComponent;
 apiConfig = { baseUrl: this.apiConfigService.baseUrl }; 
 subCategories = toSignal(toObservable(this.selectedCategoryId).pipe(

    switchMap(categoryId => {
      if (categoryId === null) return of([]);
      return this.SubCategoryBusiness.getSubCategoriesByCategoryId(categoryId);
    })
  ), { initialValue: [] })

  constructor(private fb:FormBuilder,private fileToBase64Service:FileToBase64Service,private translate:TranslateService, private router: Router,private route: ActivatedRoute,
    @Inject(COURSE_BUSINESS_TOKEN) private  ICourseBusiness: ICourseBusiness,private toast:ToastService,
     @Inject(CATEGORY_BUSINESS_TOKEN) private readonly CategoryBusiness: ICategoryBusiness,
        @Inject(SUBCATEGORY_BUSINESS_TOKEN) private readonly SubCategoryBusiness: ISubCategoryBusiness,
    private apiConfigService: ApiConfig
  ){ 
this.Courseform = this.fb.group({
  name: [
        '',
        [
          Validators.required,
          Validators.pattern(/[^#@!$%^&*]+$/),
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
  description: 
  ['',[
          Validators.required,
          Validators.pattern(/[^#@!$%^&*]+$/),
          Validators.minLength(3),
          Validators.maxLength(450),]],
  image: [''],
  category: [null, Validators.required],
  subCategory: [null],
  category_id: [0, Validators.required],
  id: [0, Validators.required],
  parent_category_id: [0]

});
this.courseId = this.route.snapshot.paramMap.get('id');
this.fetchCourseDetails( this.courseId );
}

fetchCourseDetails(courseId: any) {
  if (courseId) {
    this.ICourseBusiness.getCourseById(courseId).subscribe({
      next: (course) => {
        this.CategoryBusiness.getAllCategories().subscribe({
          next: (categories) => {
              this.SubCategoryBusiness.getSubCategoriesByCategoryId(course.parent_category_id?course.parent_category_id : course.category_id || 0)
             .subscribe({
              next: (subCategories) => {
                 var cat=course.parent_category_id? categories.find(c => c.id === course.parent_category_id):categories.find(c => c.id === course.category_id);
                 var subCat=course.category_id? subCategories.find(s => s.id === course.category_id):null;
                  this.selectedCategoryId.set(course.parent_category_id? course.parent_category_id : course.category_id || null);
                  this.selectedSubCategoryId.set(course.category_id || null);
                 this.Courseform.patchValue({
                    category: cat,
                    subCategory: subCat}
                  )}
                  
              });
          }});     
      

       this.Courseform.patchValue({
          name: course.name,
          description: course.description,
          id: course.id,
          // category: cat ,
          // subCategory: subCat ,
          image: course.image,
          category_id: course.category_id,
          parent_category_id: course.parent_category_id
        });
       
        if (course.image) {
          this.Courseform.patchValue({ image: course.image });
        }
      },
      error: (err) => {
        this.toast.showError(this.translate.instant('COURSE.FETCH_ERROR_MESSAGE'));
      }
    });
  }
}
onAddingFile(file: File | null) {
  // No file selected
  if (!file) {
    this.Courseform.patchValue({ image: null });
    return;
  }

  // ❌ Image too large → stop here
  if (file.size > this.maxImageSize) {
    // ✅ remove file from Dropzone
    this.fileUpload.removeFileProgrammatically(file);
    this.toast.showError(
      this.translate.instant('COURSE.IMAGE_LARGE')
    );
    this.Courseform.patchValue({ image: null });
     
    return; // ⛔ prevents upload
  }

  // ✅ Image size is valid → convert & upload
  this.fileToBase64Service.fileToBase64(file)
    .then(base64 => {
      this.Courseform.patchValue({ image: base64 });
    })
    .catch(error => {
      console.error('Error converting file to Base64:', error);
      this.Courseform.patchValue({ image: null });
    });
}
CourseSubmit(){
    this.submit = true;
    this.selectedSubCategoryId() ==null? this.Courseform.patchValue({ category_id: this.selectedCategoryId() }):this.Courseform.patchValue({ category_id: this.selectedSubCategoryId() });
   this.Courseform.patchValue({ image: this.Courseform.get('image')?.value?.startsWith(this.apiConfig.baseUrl) ?  this.Courseform.get('image')?.value?.split(this.apiConfig.baseUrl)[1] :this.Courseform.get('image')?.value });
if(this.Courseform.valid){
this.loading = true;
this.ICourseBusiness.updateCourse(this.Courseform.value).subscribe({
  next:()=>{
    this.loading = false;
    this.submit = false;
    this.router.navigate(['/tree']);
       this.toast.showSuccess(this.translate.instant('COURSE.UPDATE_SUCCESS_MESSAGE'));

  },
  error:(err)=>{
    this.toast.showError( err,5000);
    this.loading = false;
    this.submit = false;
}

});
}}

 onCategoryChange(category: Category) {
    this.selectedSubCategoryId.set(null);
    this.selectedCategoryId.set(category.id);
    this.Courseform.get('subCategory')?.reset();
    this.Courseform.patchValue({
    subCategory: null
  });
  }
    onSubCategoryChange(subCategory: SubCategory) {
    this.selectedSubCategoryId.set(subCategory.id)
  }

}
