import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ObjectiveUI } from 'src/app/presentation/models/objective-ui.model';
import { QuestionVM } from 'src/app/presentation/models/questions-ui-model';

@Component({
  selector: 'app-questions-wrapper',
  templateUrl: './questions-wrapper.component.html',
  styleUrl: './questions-wrapper.component.scss',
  standalone: false
})
export class QuestionsWrapperComponent {
@Input() examForm!: FormGroup;
@Input() questions:QuestionVM[]=[]
@Input() objectives:ObjectiveUI[]=[]
}
