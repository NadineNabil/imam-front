import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";

export interface InvitationBusiness{
    
    addInvitationToStudent( payload: { email: string; full_name: string ,course_id: number}): Observable<any>;
   
   getInvitations?(payload: any): Observable<any>;
    resendInvitation?(invitationId: number): Observable<any>;
    cancelInvitation?(invitationId: number): Observable<any>;

}
export const INVITATION_BUSINESS_TOKEN = new InjectionToken<InvitationBusiness>(
  'InvitationBusiness'
);







