import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddSubcategoryComponent } from './add-subcategory.component';
import { SUBCATEGORIES_ROUTES } from './subcategories.routes';
import { EditSubCategoryComponent } from './edit-sub-category/edit-sub-category.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AddSubcategoryComponent,EditSubCategoryComponent],
  imports: [CommonModule, RouterModule.forChild(SUBCATEGORIES_ROUTES), ReactiveFormsModule,SharedModule]
})
export class SubcategoriesModule {}
