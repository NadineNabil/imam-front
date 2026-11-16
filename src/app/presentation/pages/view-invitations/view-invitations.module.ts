import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewInvitationsComponent } from './view-invitations.component';
import { viewInvitationsRoutingModule } from './view-invitations-routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
   ViewInvitationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    viewInvitationsRoutingModule,
    NgbPaginationModule
  ],
})
export class ViewInvitationsModule { }
