import { Observable } from "rxjs";
import { Inject, Injectable } from "@angular/core";
import { SUBCATEGORY_REPOSITORY_TOKEN, ISubCategoryRepository } from "../repository-contracts/subCategory-repository.contract";
import { SubCategory } from "../entities/subCategory.entity";
import { ISubCategoryBusiness } from "../business-contracts/subCategory-business.contract";

@Injectable({ providedIn: 'root' })
export class SubCategoryBusiness implements ISubCategoryBusiness {
    constructor(@Inject(SUBCATEGORY_REPOSITORY_TOKEN) private readonly subCategoryRepository: ISubCategoryRepository){}
   
       getSubCategoryById(subCategoryId: number): Observable<SubCategory> {
         return this.subCategoryRepository.getSubCategoryById(subCategoryId);
    }
/*     getAllSubCategories(): Observable<SubCategory[]> {
    getSubCategoryById(subCategoryId: number): Observable<SubCategory> {
         return this.subCategoryRepository.getSubCategoryById(subCategoryId);
    }
    getAllSubCategories(): Observable<any[]> {
        return this.subCategoryRepository.getAll();
    } */
    getSubCategoriesByCategoryId(categoryId: number): Observable<SubCategory[]> {
        return this.subCategoryRepository.getByCategoryId(categoryId);
    }
    createSubCategory(subCategory: SubCategory): Observable<SubCategory> {
        return this.subCategoryRepository.createSubCategory(subCategory) as Observable<SubCategory>;
    }
    updateSubCategory(subCategory: any): Observable<SubCategory> {
        return this.subCategoryRepository.updateSubCategory(subCategory) as Observable<SubCategory>;
    }
    deleteSubCategory(subCategoryId: number): Observable<void> {
        return this.subCategoryRepository.deleteSubCategory(subCategoryId);
    }
}
