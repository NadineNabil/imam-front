import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";
import { SubCategory } from "../entities/subCategory.entity";

export interface ISubCategoryBusiness {
/*     getAllSubCategories(): Observable<SubCategory[]>;
 */  /*   getSubCategoriesByCategoryId(categoryId: number): Observable<SubCategory[]>; */
    createSubCategory(subCategory: SubCategory): Observable<SubCategory>;
    updateSubCategory(subCategory: any): Observable<SubCategory>;
  deleteSubCategory(subCategoryId: number): Observable<void>;
/*     getAllSubCategories(): Observable<SubCategory[]>;
 */    getSubCategoriesByCategoryId(categoryId: number): Observable<SubCategory[]>;
  getSubCategoryById(subCategoryId: number): Observable<SubCategory>;
}
export const SUBCATEGORY_BUSINESS_TOKEN = new InjectionToken<ISubCategoryBusiness>(
  'ISubCategoryBusiness'
);
