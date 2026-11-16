import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export interface IinvitationRepository {
  
    addInvitationToStudent?( payload: { email: string; full_name: string ,course_id: number}): Observable<any>;
   
    getInvitations?(payload: any): any;
    resendInvitation?(invitationId: number): any;
    cancelInvitation?(invitationId: number): any;


}
export const Invitation_REPOSITORY_TOKEN = new InjectionToken<IinvitationRepository>('IinvitationRepository');
