import { HttpClient } from "@angular/common/http";
import { ApiConfig } from '../config/api.config';
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })

export class InvitationsApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfig: ApiConfig
  ) {}  

  addInvitationToStudent( payload: { email: string; full_name: string,course_id:number }): any {
    return this.http.post<any>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.invitations.addInvitation),
      payload
    );
    
  }

  allInvitations(payload: {
      "page_no": number,
      "page_size": number,
      "course_id": number,
      "student_name": string,
      "email": string,
      "status": string
    }): any {
    return this.http.post<any>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.invitations.allInvitations),
      payload
    );
  }

  cancelInvitation(invitation_id:number){
     return this.http.post<any>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.invitations.cancelInvitation)+invitation_id,
      null
    );
  }

   resendInvitation(invitation_id:number){
     return this.http.post<any>(
      this.apiConfig.getUrl(this.apiConfig.endpoints.invitations.resendInvitation)+invitation_id,
      null
    );
  }
}