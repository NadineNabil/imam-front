import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError, of } from "rxjs";
import { ICourseRepository } from "src/app/domain/repository-contracts/course-repository.contract";
import { Course } from "src/app/domain/entities/course.entity";
import { CourseApiService } from "../api/course-api.service";
import { CourseMapper } from "../mappers/course.mapper";
import { SharedPagination } from 'src/app/domain/entities/shared-pagination.entity';
import { PaginationMapper } from '../mappers/pagination.mapper';
import { PagedResult } from 'src/app/domain/entities/PagedResult.entity';
import { CourseRequestDto } from "../dto/request/course.request.dto";
import { ApiConfig } from '../config/api.config';
import { IinvitationRepository } from "src/app/domain/repository-contracts/invitations-repository.contract";
import { InvitationsApiService } from "../api/invitations-api";

@Injectable({ providedIn: 'root' })
export class InvitationsRepositoryImpl implements IinvitationRepository {
    
    constructor (private invitationApiService: InvitationsApiService,private apiConfigService: ApiConfig) { }
    
    addInvitationToStudent( payload: { email: string; full_name: string ,course_id: number}): Observable<any> {
      return this.invitationApiService.addInvitationToStudent(payload);
      
    
  }

  getInvitations(payload:any) {
      return this.invitationApiService.allInvitations(payload);
  }


  /** Resend invitation (mock) */
  resendInvitation(invitationId: number) {
      return this.invitationApiService.resendInvitation(invitationId);
   
  }

  /** Cancel invitation (mock) */
  cancelInvitation(invitationId: number) {
      return this.invitationApiService.cancelInvitation(invitationId);
   
  }
}
