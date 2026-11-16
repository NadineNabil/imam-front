import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { min } from 'rxjs';
import { CATEGORY_BUSINESS_TOKEN, ICategoryBusiness } from 'src/app/domain/business-contracts/category-business.contract';
import { Category } from 'src/app/domain/entities/category.entity';
import { FileToBase64Service } from 'src/app/shared/services/file-to-base64.service';
import { ToastService } from 'src/app/shared/services/toast-service';

@Component({
  selector: 'app-add-category',
  standalone:false,
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss',
})
export class AddCategoryComponent implements OnInit {
  categoyForm!: FormGroup;
  submit!: boolean;
  loading!: boolean;
  exceededMessage: string = 'SUBJECT.MAX_FILES_EXCEEDED';
  isEditMode = false;
  // الصورة المستخدمة للعرض داخل كومبوننت الرفع
  imagePreview: string | null = null;  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private fileToBase64Service:FileToBase64Service,
    public toastService: ToastService,
    private translate: TranslateService,
    @Inject(CATEGORY_BUSINESS_TOKEN) private CategoryBusiness: ICategoryBusiness
  ) {
    this.categoyForm = this.fb.group({
      id: [0],
      categoryName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?!\s)(?!.*\s$)[A-Za-z\u0600-\u06FF0-9 ]+$/),
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      categoryDescription: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?!\s)(?!.*\s$)[^#@!$%^&*]+$/),
          Validators.minLength(3),
          Validators.maxLength(450),
        ],
      ],
      categoryImage: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.loading = true;
        const id = Number(idParam);
        this.categoyForm.patchValue({ id });
        this.loadCategory(id);
      } else {
        this.isEditMode = false;
      }
    });
  }

  private loadCategory(id: number): void {
    this.loading = true;

    this.CategoryBusiness.getCategoryById(id).subscribe({
      next: (category) => {
        if (category) {
          this.categoyForm.patchValue({
            id: category.id,
            categoryName: category.categoryName,
            categoryDescription: category.categoryDescription,
            // نخزن قيمة الصورة كما هي (غالباً URL) في الفورم
            categoryImage: category.categoryImage ?? ''
          });
          // نعرض الصورة الحالية (URL راجع من الـ API) في كومبوننت الرفع
          this.imagePreview = category.categoryImage ?? null;
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        setTimeout(()=>{
          this.router.navigateByUrl("/tree");
        },1500)
        
      },
    });
  }
onAddingFile(file:File|null){
  if(!file){
    this.categoyForm.patchValue({ categoryImage: null });
    this.imagePreview = null;
    return;
  }
this.fileToBase64Service.fileToBase64(file).then(base64 => {
  // base64 بيبقى بالشكل data:image/png;base64,XXXXX
  const onlyData = base64.split(',')[1];
  // نخزن الجزء الخاص بالبيانات فقط في الفورم عشان الـ API
  this.categoyForm.patchValue({ categoryImage: onlyData });
  // ونستخدم الـ string الكامل للعرض داخل Dropzone
  this.imagePreview = base64;
}).catch(error => {
  console.error('Error converting file to Base64:', error)
});
}
  addCategorySubmit() {
    this.submit = true;
    if (!this.categoyForm.valid) {
        return;
    }

    this.loading = true;
    const formValue = this.categoyForm.value;

    const category: Category = new Category(
      formValue.id ?? 0,
      formValue.categoryName,
      formValue.categoryDescription,
      null,
      null,
      formValue.categoryImage
    );

    const request$ = this.isEditMode
      ? this.CategoryBusiness.updateCategory(category)
      : this.CategoryBusiness.createCategory(category);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.submit = false;
        this.router.navigate(['/tree']);
        const messageKey = this.isEditMode
          ? 'CATEGORY.EDIT_SUCCESS_MESSAGE'
          : 'CATEGORY.ADD_SUCCESS_MESSAGE';
        this.toastService.showSuccess(this.translate.instant(messageKey));
      },
      error: (err) => {
        console.log(err);
        const messageKey = this.isEditMode
          ? 'CATEGORY.EDIT_ERROR_MESSAGE'
          : 'CATEGORY.ADD_ERROR_MESSAGE';
        this.toastService.showError(err);
        this.loading = false;
        this.submit = false;
      },
    });
  }

}
