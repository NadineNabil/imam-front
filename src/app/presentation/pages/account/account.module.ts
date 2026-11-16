import { NgModule } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthModule } from './auth/auth.module';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { set } from 'lodash';
import { SetPasswordComponent } from './set-password/set-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    SetPasswordComponent
  ],
  imports: [
    CommonModule,
    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,
    AccountRoutingModule,
    AuthModule,
    SharedModule
  ]
})
export class AccountModule { }

