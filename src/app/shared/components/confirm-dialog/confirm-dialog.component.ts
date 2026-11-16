import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  animations: [
    trigger('dialogAnim', [
      transition(':enter', [
        style({ transform: 'scale(0.7)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ transform: 'scale(0.7)', opacity: 0 }))
      ])
    ])
  ]
})
export class ConfirmDialogComponent {
  @Input() message = 'Are you sure?';
  @Input() note="note"
  @Input() confimMsg="yes"
  @Input() cancelMsg="cancel"
  @Output() action = new EventEmitter<boolean>();

  constructor()
  {}

  close() {
    this.action.emit(false); 
  }

  confirm()
  {
    this.action.emit(true); 
    //this.authService.logout();
  }
}
