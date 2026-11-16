import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { SubCategoryApiService } from "../api/subCategory-api.service";
import { ISubCategoryRepository } from "src/app/domain/repository-contracts/subCategory-repository.contract";
import { SubCategory } from "src/app/domain/entities/subCategory.entity";
import { SubCategoryMapper } from "../mappers/subCategory.mapper";
import { CategoryMapper } from "../mappers/category.mapper";
import { EditCategoryDto } from "../dto/request/category.request.dto";

@Injectable({ providedIn: 'root' })
export class SubCategoryRepositoryImpl implements ISubCategoryRepository {
   
    constructor (private subCategoryApiService: SubCategoryApiService) { }
    
    getSubCategoryById(subCategoryId: number): Observable<SubCategory> {
          return this.subCategoryApiService.getSubCategoryById(subCategoryId);
    }
   
    updateSubCategory(subCategory: any): Observable<any> {
            const dto: any = subCategory;
            return this.subCategoryApiService.updateCategory(dto);
    }

    getAll(): Observable<any[]> {
        return this.subCategoryApiService.getAll().pipe(
            map((dto:any) => SubCategoryMapper.fromResponseDtoList(dto))
        );
    }
    
    getByCategoryId(categoryId: number): Observable<any[]> {
        return this.subCategoryApiService.getByCategoryId(categoryId).pipe(
            map((dto:any) => SubCategoryMapper.fromResponseDtoList(dto))
        );
    }
    createSubCategory(subCategory: SubCategory): Observable<any> {
        const dto = SubCategoryMapper.toRequestDto(subCategory);
        return this.subCategoryApiService.create(dto).pipe(
            map((resDto: any) => SubCategoryMapper.fromResponseDto(resDto))
        );
    }

    deleteSubCategory(subCategoryId: number): Observable<void> {
        // simply call API delete; higher-level checks (courses) are performed by callers
        return this.subCategoryApiService.delete(subCategoryId).pipe(
            map(() => undefined)
        );
    }
  
}
