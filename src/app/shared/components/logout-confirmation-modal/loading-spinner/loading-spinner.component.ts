import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
  standalone: false
})
export class LoadingSpinnerComponent {
@Input() loadingText: string = 'LOADING';
}
