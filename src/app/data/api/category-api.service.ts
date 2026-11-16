import { HttpClient } from "@angular/common/http";
import { ApiConfig } from '../config/api.config';
import { Injectable } from "@angular/core";
import { CategoryDto, CategoryResponseDto, CreateCategoryResponseDto, GetCategoryResponseDto } from "../dto/response/category.response.dto";
import {  CreateCategoryRequestDto, EditCategoryDto } from "../dto/request/category.request.dto";
import { catchError, map, Observable, shareReplay, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CategoryApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfig
  ) {}  

  /**
   * Get flat list of categories for selects, etc.
   * Uses real backend: GET /category/all
   */
  getAll(): Observable<CategoryResponseDto[]> {
    return this.http
      .get<CategoryDto[]>(
        this.apiConfig.getUrl(
          this.apiConfig.endpoints.categories.all
        )
      )
      .pipe(
        shareReplay(),
        catchError(error => {
          console.error('Category API error', error);
          return throwError(() => error);
        })
      );
  }



getCategoryById(id: number): Observable<GetCategoryResponseDto> {
    return this.http.get<GetCategoryResponseDto>(
        this.apiConfig.getUrl(this.apiConfig.endpoints.categories.getCategoryById(id))
    ).pipe(
        map(category => {
            // تعديل رابط الصورة
            if (category.image) {
                category.image = `${this.apiConfig.imageUrl}/${category.image}`;
            }
            return category;
        })
    );   
}
GetCategoriesTree(): Observable<CategoryDto[]> {
            return this.http.get<CategoryDto[]>(this.apiConfig.getUrl(this.apiConfig.endpoints.categories.getCategoriesTree));
        }

createCategory(category: CreateCategoryRequestDto): Observable<CreateCategoryResponseDto> {
  return this.http.post<CreateCategoryResponseDto>(this.apiConfig.getUrl(this.apiConfig.endpoints.categories.createCategory), category);    
}

updateCategory(category: EditCategoryDto): Observable<EditCategoryDto> {
  return this.http.put<EditCategoryDto>(this.apiConfig.getUrl(this.apiConfig.endpoints.categories.updateCategory+category.id), category);    
} 

deleteCategory(id: number): Observable<void> {
  return this.http.delete<void>(
    this.apiConfig.getUrl(this.apiConfig.endpoints.categories.deleteCategory(id))
  );
}
}

