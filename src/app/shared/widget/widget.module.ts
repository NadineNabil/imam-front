import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgbDropdownModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RecentActivityComponent } from './recent-activity/recent-activity.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ToastsContainer } from './toast/toast.component';
import { PaginationComponent } from './pagination/pagination.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RecentActivityComponent,
    FileUploadComponent,
    ToastsContainer,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    NgbDropdownModule,
    DropzoneModule,
    NgbModule,
    NgbPaginationModule,
    TranslateModule

  ],
  exports: [RecentActivityComponent, FileUploadComponent,ToastsContainer,PaginationComponent]
})
export class WidgetModule { }
