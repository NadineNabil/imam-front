import { Component, Input } from '@angular/core';
import { StepItem } from 'src/app/presentation/models/StepItem.ui.model';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  standalone:false
})
export class StepperComponent {
 @Input() steps: StepItem[] = [];
}
