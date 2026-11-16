import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { QuestionVM } from 'src/app/presentation/models/questions-ui-model';
import { ReadXlsxAsJsonService } from 'src/app/shared/services/read-xlsx-as-json.service';
import { ToastService } from 'src/app/shared/services/toast-service';
import { FileUploadComponent } from 'src/app/shared/widget/file-upload/file-upload.component';

@Component({
  selector: 'app-xlsx-question-upload',
  templateUrl: './xlsx-question-upload.component.html',
  styleUrl: './xlsx-question-upload.component.scss',
  standalone:false
})
export class XlsxQuestionUploadComponent {
   @ViewChild('fileUpload') fileUploadComponent!: FileUploadComponent;
fileSize='8.6kb'
  @Output() fileChanged = new EventEmitter<any[]>();
constructor(private readXlsxAsJsonService:ReadXlsxAsJsonService,private toastr:ToastService,private translate:TranslateService){}
onFileAdded(file: File | null) {
    if (file === null) {
    this.fileChanged.emit([]);
    return;
  }

  this.readXlsxAsJsonService.readXlsxAsJson(file)
    .then(data => {
      if (data.length === 0) {
        this.removeFile(file!);
        this.toastr.showError(
          this.translate.instant('exam.empty_file') // or your translation key
        );
        this.fileChanged.emit([]);
        return;
      }
      this.fileChanged.emit(data); // send to parent
    })
    .catch(err => {
      this.removeFile(file as File); // remove invalid file from dropzone
      this.toastr.showError(err);
      this.fileChanged.emit([]);
    });
}
downloadTemplate(){
  const fileUrl='../../../../../assets/templates/old_questions_template.xlsx';
  const link=document.createElement('a');
  link.href=fileUrl;
  link.download='questions_template.xlsx'
   link.click();
}
removeFile(file:File){
 if (!this.fileUploadComponent) return;

  // Remove the file from Dropzone directly
  this.fileUploadComponent.removeFileProgrammatically(file);
}
}
