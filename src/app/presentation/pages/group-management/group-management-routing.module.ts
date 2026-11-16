import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupManagementComponent } from './group-management/group-management.component';
import { EditGroupComponent } from './edit-group/edit-group.component';

const routes: Routes = [{path:'',component:GroupManagementComponent},
  {path:'view-group/:id',component:EditGroupComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupManagementRoutingModule { }
