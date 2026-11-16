import { Routes } from '@angular/router';
import { AddCategoryComponent } from './add-category/add-category.component';

export const CATEGORIES_ROUTES: Routes = [
  { path: 'add-category', component: AddCategoryComponent },
  { path: 'edit-category/:id', component: AddCategoryComponent }
];
