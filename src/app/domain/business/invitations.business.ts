import { Inject, Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { IinvitationRepository, Invitation_REPOSITORY_TOKEN } from "../repository-contracts/invitations-repository.contract";


@Injectable({ providedIn: 'root' })
export class InvitationBusiness  implements InvitationBusiness {

    constructor(@Inject(Invitation_REPOSITORY_TOKEN) private  invitationRepository: IinvitationRepository){}

    
    getInvitations(payload:any) {
        return this.invitationRepository.getInvitations!(payload); 
    }


    resendInvitation(invitationId: number) {
       return this.invitationRepository.resendInvitation!(invitationId);

    }

    cancelInvitation(invitationId: number) {
        return this.invitationRepository.cancelInvitation!(invitationId);

    }

 
    addInvitationToStudent(payload: { email: string; full_name: string; course_id: number }): Observable<any> {
      
        return this.invitationRepository.addInvitationToStudent!(payload);
    }
    
}