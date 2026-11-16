import { Component, effect, EventEmitter, Inject, Input, Output, signal, Signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FileToBase64Service } from 'src/app/shared/services/file-to-base64.service';
import { COURSE_BUSINESS_TOKEN, ICourseBusiness } from 'src/app/domain/business-contracts/course-business.contract';
import { ToastService } from 'src/app/shared/services/toast-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/domain/entities/category.entity';
import { SubCategory } from 'src/app/domain/entities/subCategory.entity';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { ISubCategoryBusiness, SUBCATEGORY_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/subCategory-business.contract';
import { CATEGORY_BUSINESS_TOKEN, ICategoryBusiness } from 'src/app/domain/business-contracts/category-business.contract';
import { FileUploadComponent } from 'src/app/shared/widget/file-upload/file-upload.component';
@Component({
  selector: 'app-add-course',
  standalone:false,
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.scss',
})
export class AddCourseComponent {
  @ViewChild('fileInput') fileUpload!: FileUploadComponent;
  addCourseform:FormGroup
  submit!: boolean;
  loading!: boolean;
  fileError:boolean=false
  exceededMessage: string = 'SUBJECT.MAX_FILES_EXCEEDED';
  previewImage: string | null = null;
  maxImageSize = 2 * 1024 * 1024; // 1MB
  category_id:any;
  // @Output() categoryChanged = new EventEmitter<number>();
  // @Output()  subCategoryChanged= new EventEmitter<number>();
  selectedCategoryId = signal<number | null>(null);
  selectedSubCategoryId = signal<number | null>(null);
  categories = toSignal(this.CategoryBusiness.getAllCategories(), { initialValue: [] });

 subCategories = toSignal(toObservable(this.selectedCategoryId).pipe(
    
    switchMap(categoryId => {
      if (categoryId === null) return of([]);
      return this.SubCategoryBusiness.getSubCategoriesByCategoryId(categoryId);
    })
  ), { initialValue: [] })

constructor(private fb:FormBuilder,private fileToBase64Service:FileToBase64Service,private translate:TranslateService,
    @Inject(COURSE_BUSINESS_TOKEN) private  ICourseBusiness: ICourseBusiness,private toast:ToastService,
    private router:Router,private route: ActivatedRoute,
     @Inject(CATEGORY_BUSINESS_TOKEN) private readonly CategoryBusiness: ICategoryBusiness,
        @Inject(SUBCATEGORY_BUSINESS_TOKEN) private readonly SubCategoryBusiness: ISubCategoryBusiness,
        
){ 
this.addCourseform = this.fb.group({
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
});
let initialized = false;
 effect(() => {
  if (initialized) return;
   this.route.queryParamMap.subscribe(params => {
  const categoryID = params.has('categoryId')
    ? Number(params.get('categoryId'))
    : null;

  const subCategoryID = params.has('subCategoryId')
    ? Number(params.get('subCategoryId'))
    : null;


    const cats = this.categories();

    if (!categoryID || !cats.length) return;

    const selectedCategory = cats.find(c => c.id === categoryID);

    if (selectedCategory) {
      this.addCourseform.patchValue({
        category: selectedCategory   // ✅ object → TEXT shows
      });
      this.selectedCategoryId.set(categoryID);
      if(subCategoryID){
        const subCats = this.subCategories();
        const selectedSubCategory = subCats.find(s => s.id === subCategoryID);
        if(selectedSubCategory){
          this.addCourseform.patchValue({
            subCategory: selectedSubCategory,
            category_id: subCategoryID
          });
          this.selectedSubCategoryId.set(subCategoryID);
          initialized = true;
        }
      }
    }
  });

});

}
setCategoryFromRoute() {
  const id = Number(this.route.snapshot.paramMap.get('id'));

  if (!id) return;

  const selectedCategory = this.categories().find(
    c => c.id === id
  );

  if (selectedCategory) {
    this.addCourseform.patchValue({
      category: selectedCategory // ✅ object
    });
  }
}


onAddingFile(file:File|null){
  if(!file){
     this.addCourseform.patchValue({ image: null });
     this.previewImage = null;
    return;
  }
  // ✅ Size validation
  if (file.size > this.maxImageSize) {
     // ✅ remove file from Dropzone
    this.fileUpload.removeFileProgrammatically(file);
     this.toast.showError(
      this.translate.instant('COURSE.IMAGE_LARGE')
    );
    this.addCourseform.patchValue({ image: null });
    this.previewImage = null;
    return;
  }
  // // ✅ Resize image for preview
  // this.fileToBase64Service.resizeImage(file, 300, 300).then(resizedBase64 => {
  //   this.previewImage = resizedBase64;
  //   // store ONLY base64 data (without header)
  //   const image = resizedBase64.split(',')[1];
  //   this.addCourseform.patchValue({ image: image });
  // }).catch(err => {
  //   console.error('Image processing failed', err);
  // });
this.fileToBase64Service.fileToBase64(file).then(base64 => {
  const image=base64.split(',')[1];
  this.addCourseform.patchValue({ image: base64 });
  this.previewImage = base64;
}).catch(error => {
  console.error('Error converting file to Base64:', error)
});
}
addCourseSubmit(){
    this.submit = true;
    this.selectedSubCategoryId() ==null? this.addCourseform.patchValue({ category_id: this.selectedCategoryId() }):this.addCourseform.patchValue({ category_id: this.selectedSubCategoryId() });
   
if(this.addCourseform.valid){
this.loading = true;
this.ICourseBusiness.addCourse(this.addCourseform.value).subscribe({
  next:()=>{
    this.loading = false;
    this.submit = false;
    this.router.navigate(['/tree']);
       this.toast.showSuccess(this.translate.instant('COURSE.ADD_SUCCESS_MESSAGE'));

  },
  error:(err)=>{
    this.toast.showError( err,5000);
    // this.toast.showError(this.translate.instant('COURSE.ADD_ERROR_MESSAGE'));
    this.loading = false;
    this.submit = false;
}

});
}}

 onCategoryChange(category: Category) {
    this.selectedSubCategoryId.set(null);
    this.selectedCategoryId.set(category.id);
     this.addCourseform.get('subCategory')?.reset();
    this.addCourseform.patchValue({
    subCategory: null,
  });
  }
    onSubCategoryChange(subCategory: SubCategory) {
    this.selectedSubCategoryId.set(subCategory.id);
  }

}
