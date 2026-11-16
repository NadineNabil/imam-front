import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { IpRepository } from "src/app/data/repositories/ip.repository";

export interface IipRepository {
  
   getIpAddress(): Observable<any> 
}
export const IP_REPOSITORY_TOKEN = new InjectionToken<IpRepository>('IPRepository');
