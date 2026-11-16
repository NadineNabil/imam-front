import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, delay, Observable, of, shareReplay, throwError } from "rxjs";
import { SubCategoryResponseDto } from "../dto/response/sub-category.response.dto";
import { CreateCategoryResponseDto } from "../dto/response/category.response.dto";
import { ApiConfig } from "../config/api.config";
import { TranslateService } from '@ngx-translate/core';
import { Category } from "src/app/domain/entities/category.entity";
import { SubCategory } from "src/app/domain/entities/subCategory.entity";

@Injectable({ providedIn: 'root' })
export class SubCategoryApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly translate: TranslateService,
    private readonly apiConfig: ApiConfig
  ) { }

  getAll(): Observable<SubCategoryResponseDto[]> {

    const mockSubCategories: SubCategoryResponseDto[] = [
      {
        id: 1, name: 'sub-CAT1', parentId: 0
      },
      { id: 2, name: 'sub-CAT1 TypeScript', parentId: 1 },
      { id: 3, name: 'sub-CAT1 RxJS', parentId: 1 }
    ];

    return of(mockSubCategories).pipe(
      delay(500),
      shareReplay(),
      catchError(error => {
        console.error('Mock API error', error);
        return throwError(() => error);
      })
    );
  }  

  getByCategoryId(categoryId: number): Observable<SubCategoryResponseDto[]> {
    return this.http
      .get<SubCategoryResponseDto[]>(
        this.apiConfig.getUrl(
          this.apiConfig.endpoints.subCategories.getsubCategories + `${categoryId}`
        )
      )
      .pipe(
        shareReplay(),
        catchError(error => {
          console.error('SubCategory API error', error);
          return throwError(() => error);
        })
      );
  }

  //create and update can be implemented similarly, using of() to return mock responses or throwError() to simulate errors.
    create(dto: any): Observable<any> {
     
      const lang =  this.translate.currentLang ??this.translate.defaultLang ??'en';
     
      const headers = new HttpHeaders({ 'Accept-Language': lang });
      return this.http.post<CreateCategoryResponseDto>(
    this.apiConfig.getUrl(this.apiConfig.endpoints.categories.createCategory),
    dto
     ,{headers} );
    }

   updateCategory(subCategory: SubCategory): Observable<SubCategory> {
    
     const lang =  this.translate.currentLang ??this.translate.defaultLang ??'en';
     
      const headers = new HttpHeaders({ 'Accept-Language': lang });
     
    return this.http.put<SubCategory>(this.apiConfig.getUrl(this.apiConfig.endpoints.categories.updateCategory+subCategory.id), subCategory,{headers});    
   } 

    delete(id: number): Observable<any> {
        // For now simulate delete or call real API if configured
        // If backend exists: DELETE /category/{id}
        try {
          const lang = this.translate.currentLang || this.translate.getDefaultLang?.() || 'en';
          const headers = new HttpHeaders({ 'Accept-Language': lang });
          const url = this.apiConfig.getUrl(this.apiConfig.endpoints.categories.updateCategory + id);
          return this.http.delete(url, { headers });
        } catch (e) {
          // fallback mock
          return of({ success: true });
        }
     }

     getSubCategoryById(subCategoryId: number): any {
        return this.http.get<SubCategory>(
             this.apiConfig.getUrl(this.apiConfig.endpoints.categories.getCategoryById(subCategoryId))
         );
            
     }    
}