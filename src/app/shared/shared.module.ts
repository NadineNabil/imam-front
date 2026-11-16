import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WidgetModule } from './widget/widget.module';
import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { TranslateModule } from '@ngx-translate/core';
import { LogoutConfirmationModalComponent } from './components/logout-confirmation-modal/logout-confirmation-modal.component';
import { LoadingSpinnerComponent } from './components/logout-confirmation-modal/loading-spinner/loading-spinner.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DataTableSortableDirective } from './directives/datatable-sortable.directive';
import { QuestionsFormComponent } from './questions-form/questions-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { StepperComponent } from './components/stepper/stepper.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { TrimInputDirective } from "src/app/presentation/directives/trimInput";
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingSpinner2Component } from './components/loading-spinner/loading-spinner.component';
import { PhoneInputComponent } from './components/phone-input/phone-input.component';
import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal.component';

@NgModule({
  declarations: [
    PagetitleComponent,
    LogoutConfirmationModalComponent,
    LoadingSpinnerComponent,
    DataTableComponent,
    StepperComponent,
    DataTableSortableDirective,
    LoadingSpinner2Component,
    PhoneInputComponent,
    ChangePasswordModalComponent,
    QuestionsFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WidgetModule, TranslateModule,
    NgSelectModule,
    CdkStepperModule,
    NgStepperModule,
    FormsModule ,
    TrimInputDirective,
    NgbAlertModule,
],
  exports: [
    CommonModule,
    PagetitleComponent,
    TranslateModule,
    ReactiveFormsModule,
    WidgetModule,
    LogoutConfirmationModalComponent,
    LoadingSpinnerComponent,
    QuestionsFormComponent,
    DataTableComponent,
    DataTableSortableDirective,
    StepperComponent,
    NgbAlertModule ,
    LoadingSpinner2Component,
    NgSelectModule,
    PhoneInputComponent,
    ChangePasswordModalComponent
  ]
})
export class SharedModule { }
