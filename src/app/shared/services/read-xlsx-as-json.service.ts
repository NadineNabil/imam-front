import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as XLSX from 'xlsx';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root'
})
export class ReadXlsxAsJsonService {
  constructor(private translate: TranslateService, private toastr: ToastService) { }
  readXlsxAsJson(file: File | null): Promise<any[]> {
    if (!file) {
      return Promise.reject('No file provided');
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const json:any[] = XLSX.utils.sheet_to_json(worksheet, {
            defval: null
          });
          for (const item of json) {
            if (!item['question'] || !item['type']) {
              const errorMsg = this.translate.instant('EXAMS.QUESTION_AND_TYPE_REQUIRED');
              reject(errorMsg);                 // stops promise
              return;                           // exits the loop
            }
          }



          resolve(json);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject('Failed to read file');
      reader.readAsArrayBuffer(file);
    });
  }
}
