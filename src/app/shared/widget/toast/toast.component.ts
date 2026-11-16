import { Component, TemplateRef } from '@angular/core';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-toast',
  standalone:false,
  template: `
    <ngb-toast *ngFor="let toast of toastService.toasts" 
               [class]="toast.classname"
               [autohide]="true"
               [delay]="toast.delay || 5000"
               (hidden)="toastService.remove(toast)">
      <ng-container *ngIf="isTemplate(toast); else text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-container>
      <ng-template #text>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast>
  `,
  host: { '[class.ngb-toasts]': 'true' }
})
export class ToastsContainer {
  constructor(public toastService: ToastService) { }

  isTemplate(toast: { textOrTpl: any; }) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}

