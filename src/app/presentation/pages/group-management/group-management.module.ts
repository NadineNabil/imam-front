import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupManagementRoutingModule } from './group-management-routing.module';
import { GroupManagementComponent } from './group-management/group-management.component';
import { CreateGroupModalComponent } from './create-group-modal/create-group-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditGroupComponent } from './edit-group/edit-group.component';
import { AddStudentsModalComponent } from './add-students-modal/add-students-modal.component';
import { AllCoursesModalComponent } from './all-courses-modal/all-courses-modal.component';
import {  ItemSearchPipe } from './FilterName.pipe';
import { emailFilterPipe } from './emailFilter.pipe';
import { NgbAccordionItem } from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [AllCoursesModalComponent,GroupManagementComponent, CreateGroupModalComponent,EditGroupComponent,AddStudentsModalComponent],
  imports: [
    CommonModule,
    GroupManagementRoutingModule,
    SharedModule,
    WidgetModule,
    ReactiveFormsModule,
    FormsModule,
    ItemSearchPipe,
    emailFilterPipe,
    NgbAccordionItem
]
})
export class GroupManagementModule { }
