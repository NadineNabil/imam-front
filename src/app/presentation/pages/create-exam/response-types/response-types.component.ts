import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-response-types',
  templateUrl: './response-types.component.html',
  styleUrl: './response-types.component.scss',
  standalone: false
})
export class ResponseTypesComponent {
@Input() parentForm!: FormGroup;
@Input() responseTypesFormArray!: FormArray;
}
