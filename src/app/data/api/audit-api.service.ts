import { Injectable } from "@angular/core";
import { ApiConfig } from '../config/api.config';
import { HttpClient } from "@angular/common/http";
import { PagedResult } from "src/app/domain/entities/PagedResult.entity";
import { AuditLog } from "src/app/domain/entities/AuditLog.entity";
import { map, Observable } from "rxjs";
import { AuditLogMapper } from "../mappers/audit.mapper";
import { AuditLogResponseDto } from "../dto/response/audit.response.dto";


@Injectable({ providedIn: 'root' })
export class auditService {
constructor(    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfig){}

getLogs(
  pageNo: number,
  pageSize: number,
  searchItem:string
): Observable<AuditLogResponseDto> {

  return this.http.get<AuditLogResponseDto>(
    this.apiConfig.getUrl(this.apiConfig.endpoints.logs.getLogs),
    {
      params: {
        page_no: pageNo,
        page_size: pageSize,
        search_term:searchItem
      }
    }
  )
}
}