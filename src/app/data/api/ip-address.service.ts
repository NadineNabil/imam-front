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
export class ipAddressApiService {
  constructor(
    private readonly http: HttpClient,
  ) { }

     getIpAddress(): any {
       return this.http.get<any>('https://ipinfo.io/json');
            
     }    
}