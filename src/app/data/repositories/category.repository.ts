import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Course } from "src/app/domain/entities/course.entity";
import { CategoryApiService } from "../api/category-api.service";
import { ICategoryRepository } from "src/app/domain/repository-contracts/category-repository.contract";
import { CategoryMapper } from "../mappers/category.mapper";
import { Category } from "src/app/domain/entities/category.entity";
import { CreateCategoryRequestDto, EditCategoryDto } from "../dto/request/category.request.dto";
import { CategoryDto, CreateCategoryResponseDto, GetCategoryResponseDto } from "../dto/response/category.response.dto";
@Injectable({ providedIn: 'root' })
export class CategoryRepositoryImpl implements ICategoryRepository {
    constructor (private categoryApiService: CategoryApiService) { }
    getAll(): Observable<Category[]> {
        return this.categoryApiService.getAll().pipe(
            map(dto=>{
                return CategoryMapper.fromResponseDtoList(dto);  
            })
        )
    }
    getCategoriesTree(): Observable<Category[]> {
        return this.categoryApiService.GetCategoriesTree().pipe(
                    map((response) =>
                    response.map((dto) => CategoryMapper.fromCategoryDTO(dto))
                    )
                );
    }

    getCategoryById(id: number): Observable<Category> {
        return this.categoryApiService.getCategoryById(id).pipe(
            map((dto: GetCategoryResponseDto) => CategoryMapper.fromGetCategoryResponseDto(dto))
        );
    }
    
    createCategory(category: Category): Observable<Category> {
        const categoryDto = CategoryMapper.toCreateCategoryRequestDto(category);
        return this.categoryApiService.createCategory(categoryDto).pipe(
            map((response) => CategoryMapper.fromCreateCategoryResponseDto(response))
        );
    }

    updateCategory(category: Category): Observable<Category> {
        const dto: EditCategoryDto = CategoryMapper.toEditCategoryDto(category);
        return this.categoryApiService.updateCategory(dto).pipe(
            map((response: EditCategoryDto) => CategoryMapper.fromEditCategoryDto(response))
        );
    }

    deleteCategory(id: number): Observable<void> {
        return this.categoryApiService.deleteCategory(id);
    }
}