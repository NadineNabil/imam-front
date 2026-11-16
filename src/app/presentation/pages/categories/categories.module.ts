import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "src/app/shared/shared.module";
import { AddCategoryComponent } from './add-category/add-category.component';
import { CATEGORIES_ROUTES } from './categories.routes';



@NgModule({
declarations: [
    AddCategoryComponent
],
imports: [
    CommonModule,
    RouterModule.forChild(CATEGORIES_ROUTES),
    ReactiveFormsModule, 
    SharedModule,
]
})

export class CategoriesModule {}