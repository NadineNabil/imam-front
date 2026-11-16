import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ViolationType } from 'src/app/domain/enums/violation-type.enum';
@Component({
  selector: 'app-violation-popup',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './violation-popup.component.html',
  styleUrl: './violation-popup.component.scss'
})
export class ViolationPopupComponent {
  @Input() show: boolean = false;
  @Input() violations: { type: ViolationType; message: string; timestamp: Date }[] = [];
  @Input() isBlocked: boolean = false;
  @Input() counterViolation: number = 0;
  @Output() return = new EventEmitter<void>();
  @Output() end = new EventEmitter<void>();
  onReturn() {
     document.documentElement.requestFullscreen()
    this.return.emit();
  }
  onEnd() {
    this.end.emit();
  }
}
