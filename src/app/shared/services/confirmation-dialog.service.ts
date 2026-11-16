// confirmation-dialog.service.ts

import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  constructor(private translate: TranslateService) {}

  showConfirmationDialog(
    titleKey: string,
    messageKey: string,
    confirmKey: string
  ): Promise<boolean> {
    return Swal.fire({
      title: this.translate.instant(titleKey),
      text: this.translate.instant(messageKey),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#fd625e',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant(confirmKey),
      cancelButtonText: this.translate.instant('COMMON.CANCEL')
    }).then((result) => result.isConfirmed);
  }
}