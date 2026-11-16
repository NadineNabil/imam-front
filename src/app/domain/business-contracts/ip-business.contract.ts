import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";

export interface IipBusiness {

    
     getIpAddress(): Observable<any>;
}
export const IP_BUSINESS_TOKEN = new InjectionToken<IipBusiness>(
  'IipBusiness'
);
