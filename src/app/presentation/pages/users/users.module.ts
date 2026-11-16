import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllUsersComponent } from './all-users/all-users.component';



import { FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AddUserComponent, AllUsersComponent],
  imports: [
    UsersRoutingModule,
    SharedModule,
    FlatpickrDirective,
    NgbTooltipModule
  ],
  providers: [
    provideFlatpickrDefaults()
  ]
})
export class UsersModule { }
