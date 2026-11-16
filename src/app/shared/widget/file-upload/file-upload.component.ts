import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-file-upload',
  standalone: false,
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent implements OnChanges {
  @Input() fileType: string = 'image/*';
  @Input() maxFiles: number = 1;
  @Input() maxFileSizeInMB: number = 2;
  @Output() fileAdded = new EventEmitter<File|null>();
@Input() defaultMessageKey: string = 'COURSE.CLICK_OR_DRAG_FILES';
  @Input() MaxFilesExceededMessageKey: string = '';
  @Input() imageUrl: string | null = null;

  breadCrumbItems!: Array<{}>;
  config: DropzoneConfigInterface | undefined;
  private dropzoneInstance: any;

  constructor(private translate: TranslateService,private toastr:ToastService) {}

  ngOnInit(): void {
    // Initialize Dropzone base config (static options only)
    this.setBaseDropzoneConfig();

    // Update Dropzone messages whenever language changes, without reinitializing Dropzone
    this.translate.onLangChange.subscribe(() => {
      this.updateDropzoneTexts();
    });

    this.breadCrumbItems = [
      { label: 'Forms' },
      { label: 'File Upload', active: true },
    ]; 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrl'] && this.dropzoneInstance) {
      this.showExistingImageInDropzone();
    }
  }

  onDropzoneInit(dz: any): void {
    this.dropzoneInstance = dz;
    this.updateDropzoneTexts();
    this.showExistingImageInDropzone();
  }
  onFileAdded(file: File): void {
    if(file instanceof File){
    const allowedTypes=this.fileType.split(',').map(type=>type.trim())
    if(!allowedTypes.includes(file.type)){
      this.dropzoneInstance.removeFile(file);
      this.toastr.showError(this.translate.instant('FILE.THIS_TYPE_IS_NOT_ALLOWED'))
      return;
    }
      this.fileAdded.emit(file);
  }
  }
  onFileRemoved(_file: File): void {
    // When a file is removed, if the remaining files are within the allowed max,
    // clear any "max files exceeded" error messages.
    if (!this.dropzoneInstance) {
      return;
    }
    const activeFiles = this.dropzoneInstance.files.filter(
      (f: any) => f.status !== 'removed'
    );

    if (activeFiles.length <= this.maxFiles) {
      this.clearMaxFilesError();
        // Emit the updated list
      this.fileAdded.emit(null); 
    }
  }

  // Base Dropzone config – does NOT include translated strings
  private setBaseDropzoneConfig(): void {
    this.config = {
      url: 'https://httpbin.org/post',
      maxFiles: this.maxFiles,
      autoProcessQueue: false,
      addRemoveLinks: true,
      acceptedFiles: this.fileType,
      maxFilesize: this.maxFileSizeInMB, // ✅ IMPORTANT
    };
  }

  // Update only the texts on the existing Dropzone instance
  private updateDropzoneTexts(): void {
    if (!this.dropzoneInstance) {
      return;
    }

    const dictDefaultMessage = this.translate.instant(
     this.defaultMessageKey
    );
    const dictMaxFilesExceeded = this.translate.instant(
      this.MaxFilesExceededMessageKey
    );

    this.dropzoneInstance.options.dictDefaultMessage = dictDefaultMessage;
    this.dropzoneInstance.options.dictMaxFilesExceeded = dictMaxFilesExceeded;

    // Manually update the visible default message text so we don't rely on Dropzone's
    // built-in (English) string.
    const messageElement: HTMLElement | null = this.dropzoneInstance.element?.querySelector(
      '.dz-message'
    );
    if (messageElement) {
      const span = messageElement.querySelector('span');
      if (span) {
        span.textContent = dictDefaultMessage;
      } else {
        messageElement.textContent = dictDefaultMessage;
      }
    }

    // Update any existing error message DOM to the current language
    const errorSpans: NodeListOf<HTMLElement> =
      this.dropzoneInstance.element?.querySelectorAll(
        '.dz-error-message span'
      );
    if (errorSpans) {
      errorSpans.forEach((el: HTMLElement) => {
        el.textContent = dictMaxFilesExceeded;
      });
    }
  }

  // to remove error msg 
  private clearMaxFilesError(): void {
    if (!this.dropzoneInstance) {
      return;
    }

    const errorPreviews: NodeListOf<HTMLElement> =
      this.dropzoneInstance.element?.querySelectorAll('.dz-preview.dz-error');

    if (!errorPreviews) {
      return;
    }

    errorPreviews.forEach((preview: HTMLElement) => {
      preview.classList.remove('dz-error');
      const msgSpan = preview.querySelector(
        '.dz-error-message span'
      ) as HTMLElement | null;
      if (msgSpan) {
        msgSpan.textContent = '';
      }
    });
  }
  onMaxFilesExceeded(file: File):void{
  this.toastr.showError(
    this.translate.instant('FILE.MAX_FILES_EXCEEDED', {
      max: this.maxFiles
    })
  );    
    if (this.dropzoneInstance) {
    this.dropzoneInstance.removeFile(file);
  }
  }

  private showExistingImageInDropzone(): void {
    if (!this.dropzoneInstance || !this.imageUrl) return;

    if (Array.isArray(this.dropzoneInstance.files) &&
        this.dropzoneInstance.files.length > 0) return;

    // Add has-image class to Dropzone container
    this.dropzoneInstance.element.classList.add('has-image');

    // Also apply to actual wrapper if present
    const wrapper = this.dropzoneInstance.element.querySelector('.dz-preview, .dz-wrapper');
    if (wrapper) wrapper.classList.add('has-image');

    const mockFile: any = {
      name: 'current-image',
      size: 0,
      accepted: true
    };

    this.dropzoneInstance.emit('addedfile', mockFile);
    this.dropzoneInstance.emit('thumbnail', mockFile, this.imageUrl);
    this.dropzoneInstance.emit('complete', mockFile);
    this.dropzoneInstance.files.push(mockFile);
  }

  openFileDialog(): void {
    if (this.dropzoneInstance?.hiddenFileInput) {
      this.dropzoneInstance.hiddenFileInput.click();
      return;
    }

    const input: HTMLInputElement | null =
      this.dropzoneInstance?.element?.querySelector('input[type="file"]');

    if (input) input.click();
  }
  // Inside FileUploadComponent
public removeFileProgrammatically(file: File): void {
  if (!this.dropzoneInstance) return;

  const dzFile = this.dropzoneInstance.files.find(
    (f: any) => f.name === file.name && f.size === file.size
  );

  if (dzFile) {
    this.dropzoneInstance.removeFile(dzFile);
  }
}
}
