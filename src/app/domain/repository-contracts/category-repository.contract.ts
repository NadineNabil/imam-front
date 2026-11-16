import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { Category } from "../entities/category.entity";

export interface ICategoryRepository {
    getAll(): Observable<Category[]>;
    getCategoriesTree(): Observable<Category[]>;
    getCategoryById(id: number): Observable<Category>;
    createCategory(category: Category): Observable<Category>;
    updateCategory(category: Category): Observable<Category>;
    deleteCategory(id: number): Observable<void>;
}
export const CATEGORY_REPOSITORY_TOKEN = new InjectionToken<ICategoryRepository>('ICategoryRepository');