import { Routes } from '@angular/router';
import { AddSubcategoryComponent } from './add-subcategory.component';
import { EditSubCategoryComponent } from './edit-sub-category/edit-sub-category.component';

export const SUBCATEGORIES_ROUTES: Routes = [
  { path: 'add-subcategory/:id', component: AddSubcategoryComponent },
  { path: 'edit-subcategory/:id', component: EditSubCategoryComponent },
];
