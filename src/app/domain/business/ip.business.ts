import { Observable } from "rxjs";
import { Inject, Injectable } from "@angular/core";

import { IipBusiness } from "../business-contracts/ip-business.contract";
import { IpRepository } from "src/app/data/repositories/ip.repository";

@Injectable({ providedIn: 'root' })
export class ipBusiness implements IipBusiness {
    constructor(@Inject(IpRepository) private readonly IpRepository: IpRepository){}
    
    getIpAddress(): Observable<any> {
        return this.IpRepository.getIpAddress();
    }
   
    }
