import { Inject, Injectable } from "@angular/core";
import { IAuditLogBusiness } from "../business-contracts/audit-log.business.contract";
import { Observable } from "rxjs";
import { AuditLog } from "../entities/AuditLog.entity";
import { PagedResult } from "../entities/PagedResult.entity";
import { AUDIT_REPOSITORY_TOKEN, IAuditLogRepository } from "../repository-contracts/audit-log.repository.contract";

@Injectable({ providedIn: 'root' })
export class AuditLogBusiness implements IAuditLogBusiness {
    constructor(@Inject(AUDIT_REPOSITORY_TOKEN)
    private readonly auditRepository: IAuditLogRepository ){}
    getLogs(pageNo: number, pageSize: number,searchItem:string): Observable<PagedResult<AuditLog>> {
        return this.auditRepository.getLogs(pageNo,pageSize,searchItem)
    }

}