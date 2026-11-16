import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AuditLog } from "src/app/domain/entities/AuditLog.entity";
import { PagedResult } from "src/app/domain/entities/PagedResult.entity";
import { auditService } from "../api/audit-api.service";
import { AuditLogMapper } from "../mappers/audit.mapper";
import { IAuditLogRepository } from "src/app/domain/repository-contracts/audit-log.repository.contract";

@Injectable({ providedIn: 'root' })
export class AuditLogRepositoryImpl implements IAuditLogRepository {
    constructor(private auditService:auditService){}
    getLogs(pageNo: number, pageSize: number,searchItem:string): Observable<PagedResult<AuditLog>> {
        return this.auditService.getLogs(pageNo,pageSize,searchItem).pipe(
    map(response => AuditLogMapper.toPagedDomain(response))
  );
    }

}