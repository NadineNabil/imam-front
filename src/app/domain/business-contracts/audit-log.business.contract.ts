import { Observable } from "rxjs";
import { PagedResult } from "../entities/PagedResult.entity";
import { AuditLog } from "../entities/AuditLog.entity";
import { InjectionToken } from "@angular/core";

export interface IAuditLogBusiness {
        getLogs(pageNo: number, pageSize: number,searchItem:string): Observable<PagedResult<AuditLog>>;
    
}
export const AUDIT_BUSINESS_TOKEN = new InjectionToken<IAuditLogBusiness>('IAuditLogBusiness');