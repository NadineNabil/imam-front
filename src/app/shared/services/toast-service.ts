import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  private show(
    textOrTpl: string | TemplateRef<any>,
    options: any = {}
  ) {
    this.toasts.shift();
    this.toasts.push({ textOrTpl, ...options });
  }

  showSuccess(message: string, delay = 5000) {
    this.show(message, {
      classname: 'toast bg-success text-white',
      delay
    });
  }

  showError(message: string, delay = 5000) {
    this.show(message, {
      classname: 'toast bg-danger text-white',
      delay
    });
  }

  showWarning(message: string, delay = 5000) {
    this.show(message, {
      classname: 'toast bg-warning text-dark',
      delay
    });
  }

  showInfo(message: string, delay = 5000) {
    this.show(message, {
      classname: 'toast bg-info text-white',
      delay
    });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
