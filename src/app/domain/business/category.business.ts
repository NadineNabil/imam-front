import { Observable, shareReplay } from "rxjs";
import { Inject, Injectable } from "@angular/core";
import { CATEGORY_REPOSITORY_TOKEN, ICategoryRepository } from "../repository-contracts/category-repository.contract";
import { Category } from "../entities/category.entity";
import { ICategoryBusiness } from "../business-contracts/category-business.contract";
import { CategoryDto, CategoryResponseDto, CreateCategoryResponseDto } from "src/app/data/dto/response/category.response.dto";

@Injectable({ providedIn: 'root' })
export class CategoryBusiness implements ICategoryBusiness {
    constructor(@Inject(CATEGORY_REPOSITORY_TOKEN) private readonly categoryRepository: ICategoryRepository){}
    getAllCategories(): Observable<Category[]> {
        return this.categoryRepository.getAll();
    }
    getCategoriesTree(): Observable<Category[]> {
            return this.categoryRepository.getCategoriesTree().pipe(shareReplay(1)
);
    }
    getCategoryById(id: number): Observable<Category> {
        return this.categoryRepository.getCategoryById(id);
    }
    createCategory(category: Category): Observable<Category> {
        return this.categoryRepository.createCategory(category);
    }
    
    updateCategory(category: Category): Observable<Category> {
        return this.categoryRepository.updateCategory(category);
    }

    deleteCategory(id: number): Observable<void> {
        return this.categoryRepository.deleteCategory(id);
    }
}