import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { SubCategoryResponseDto } from "src/app/data/dto/response/sub-category.response.dto";
import { SubCategory } from "../entities/subCategory.entity";

export interface ISubCategoryRepository {
    createSubCategory(subCategory: any): Observable<any>;
    updateSubCategory(subCategory: any): Observable<any>;
    deleteSubCategory(subCategoryId: number): Observable<void>;
/*     getAll(): Observable<SubCategoryResponseDto[]>;
 */    getByCategoryId(categoryId: number): Observable<SubCategory[]>;
    getSubCategoryById(subCategoryId: number): Observable<SubCategory>;
    
}
export const SUBCATEGORY_REPOSITORY_TOKEN = new InjectionToken<ISubCategoryRepository>('ISubCategoryRepository');
