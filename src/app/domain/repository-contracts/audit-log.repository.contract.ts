import { Observable } from "rxjs";
import { AuditLog } from "../entities/AuditLog.entity";
import { PagedResult } from "../entities/PagedResult.entity";
import { InjectionToken } from "@angular/core";

export interface IAuditLogRepository {
    getLogs(pageNo: number, pageSize: number,searchItem:string): Observable<PagedResult<AuditLog>>;
}
export const AUDIT_REPOSITORY_TOKEN = new InjectionToken<IAuditLogRepository>('IAuditLogRepository');