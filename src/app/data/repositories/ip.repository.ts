import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ipAddressApiService } from '../api/ip-address.service';


@Injectable({ providedIn: 'root' })
export class  IpRepository {
   
     constructor(private readonly IPService: ipAddressApiService) {}
     
     getIpAddress(): Observable<any> {
      return this.IPService.getIpAddress();
    }
}