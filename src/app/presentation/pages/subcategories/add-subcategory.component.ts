import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { CATEGORY_BUSINESS_TOKEN, ICategoryBusiness } from 'src/app/domain/business-contracts/category-business.contract';
import { SubCategory } from 'src/app/domain/entities/subCategory.entity';
import { SUBCATEGORY_BUSINESS_TOKEN, ISubCategoryBusiness } from 'src/app/domain/business-contracts/subCategory-business.contract';
import { Category } from 'src/app/domain/entities/category.entity';
import { ToastService } from 'src/app/shared/services/toast-service';
import noWhitespaceValidator from 'src/app/shared/validators/no-whitespace.validator';

@Component({
  selector: 'app-add-subcategory',
  templateUrl: './add-subcategory.component.html',
  styleUrls: ['./add-subcategory.component.scss'],
  standalone: false
})
export class AddSubcategoryComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submit = false;
  categories: Category[] = [];
  parentId: number | null = null;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    @Inject(CATEGORY_BUSINESS_TOKEN) private categoryBusiness: ICategoryBusiness,
    @Inject(SUBCATEGORY_BUSINESS_TOKEN) private subCategoryBusiness: ISubCategoryBusiness
  ) {
    this.form = this.fb.group({
      parentId: [null, [Validators.required]],
      subCategoryName: ['', [
                              Validators.required,
                              Validators.minLength(3),
                              Validators.maxLength(100),
                              noWhitespaceValidator ]],
      subCategoryDescription: ['', [Validators.required,
                                    Validators.minLength(3),
                                    Validators.maxLength(450),
                                    noWhitespaceValidator
      ]],
    });
  }

  ngOnInit(): void {
    // try to read parentId from route params or query params
    const pid = this.route.snapshot.paramMap.get('id') ?? this.route.snapshot.queryParamMap.get('parentId');
    this.parentId = pid != null ? Number(pid) : null;

    // load categories for the select
    this.categoryBusiness.getCategoriesTree().subscribe({
      next: (cats: Category[]) => {
        this.categories = cats || [];
        // if parentId was provided via URL, ensure the form selects it after categories load
        if (this.parentId !== null) {
          this.form.get('parentId')?.setValue(this.parentId);
        }
      },
      error: () => (this.categories = [])
    });

    this.loadCategories();
  }

loadCategories(): void {
  this.categoryBusiness.getCategoriesTree().subscribe({
    next: (cats: Category[]) => {
      this.categories = cats || [];

      // Only set value AFTER categories exist
      if (
        this.parentId != null
      ) {
        this.form.patchValue({ parentId: this.parentId });

  
      }
    },
    error: () => {
      this.categories = [];
    }
  });
}




  submitForm() {
    this.submit = true;
    if (this.form.invalid) return;
    this.loading = true;
    // SubCategory constructor: (id, subCategoryName, subCategoryDescription, organizationId?, parentId?, courses?)
    const parent = this.form.value.parentId ?? null;
    const payload = new SubCategory(
      0,
      this.form.value.subCategoryName.trim(),
       Number(parent),
      this.form.value.subCategoryDescription.trim(),
    );

    this.subCategoryBusiness.createSubCategory(payload).subscribe({
      next: () => {
        this.loading = false;
        this.toastService.showSuccess(this.translate.instant('SUBCATEGORY.ADD_SUCCESS_MESSAGE'));
        this.router.navigate(['/tree']);
      },
      error: (err) => {
     
        this.loading = false;
        //'SUBCATEGORY.ADD_ERROR_MESSAGE'
        this.toastService.showError(err);
      }
    });
  }

}
