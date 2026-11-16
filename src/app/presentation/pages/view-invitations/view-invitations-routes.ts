import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewInvitationsComponent } from './view-invitations.component';


const routes: Routes = [
  { path: '', component: ViewInvitationsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class viewInvitationsRoutingModule { }
