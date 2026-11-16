import { Observable } from "rxjs";
import { Course } from "../entities/course.entity";
import { InjectionToken } from "@angular/core";
import { Category } from "../entities/category.entity";
import { CategoryDto, CategoryResponseDto, CreateCategoryResponseDto } from "src/app/data/dto/response/category.response.dto";

export interface ICategoryBusiness{
    getAllCategories(): Observable<Category[]>;
    getCategoriesTree(): Observable<Category[]>;
    getCategoryById(id: number): Observable<Category>;
    createCategory(category: Category): Observable<Category>;
    updateCategory(category: Category): Observable<Category>;
    deleteCategory(id: number): Observable<void>;
}
export const CATEGORY_BUSINESS_TOKEN = new InjectionToken<ICategoryBusiness>(
  'ICategoryBusiness'
);