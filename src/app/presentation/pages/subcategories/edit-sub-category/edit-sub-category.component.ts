import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CATEGORY_BUSINESS_TOKEN, ICategoryBusiness } from 'src/app/domain/business-contracts/category-business.contract';
import { ISubCategoryBusiness, SUBCATEGORY_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/subCategory-business.contract';
import { Category } from 'src/app/domain/entities/category.entity';
import { SubCategory } from 'src/app/domain/entities/subCategory.entity';
import { ToastService } from 'src/app/shared/services/toast-service';
import noWhitespaceValidator from 'src/app/shared/validators/no-whitespace.validator';

@Component({
  selector: 'app-edit-sub-category',
  standalone:false,
  templateUrl: './edit-sub-category.component.html',
  styleUrl: './edit-sub-category.component.scss',
})
export class EditSubCategoryComponent {
 form: FormGroup;
  submit = false;
  loading = false;

  subCategoryId!: number;

  organizationId = 1;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private translate: TranslateService,
    @Inject(SUBCATEGORY_BUSINESS_TOKEN) private subCategoryBusiness: ISubCategoryBusiness
  ) {
    this.form = this.fb.group({
      id:[0],
      subCategoryName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        noWhitespaceValidator
      ]],
      subCategoryDescription:['',[
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(500),
        noWhitespaceValidator
      ]]
    });
  }

  ngOnInit(): void {
    this.subCategoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSubCategory();
  }

  
  loadSubCategory(): void {
    this.subCategoryBusiness.getSubCategoryById(this.subCategoryId).subscribe({
      next: (sc: any) => {
      
        this.form.patchValue({
          subCategoryName: sc.name,
          subCategoryDescription: sc.description,
          id:sc.parent_category_id
        });

      }
    });

  

  }

  submitForm(): void {
    this.submit = true;
    if (this.form.invalid) return;

    this.loading = true;

    const payload = 
                  {
                    "id": this.subCategoryId,
                    "name": this.form.value.subCategoryName.trim(),
                    "description": this.form.value.subCategoryDescription.trim(),
                    "image": null,
                    "parent_category_id": this.form.value.id,
                    "organization_id": this.organizationId
                  }
    

    this.subCategoryBusiness.updateSubCategory(payload).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.showSuccess(
          this.translate.instant('SUBCATEGORY.EDIT_SUCCESS_MESSAGE')
        );
        this.router.navigate(['/tree']);
      },
      error: (err) => {
        this.loading = false;
        this.toastService.showError(
          this.translate.instant('SUBCATEGORY.EDIT_ERROR_MESSAGE')
        );
      }
    });
  }
}