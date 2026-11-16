import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseOptionsSettings } from 'src/app/domain/entities/BaseSettingOptionsSettings.entity';
import { QuestionVM } from 'src/app/presentation/models/questions-ui-model';

@Component({
  selector: 'app-practice-setttings',
  templateUrl: './practice-setttings.component.html',
  styleUrl: './practice-setttings.component.scss',
  standalone: false
})
export class PracticeSetttingsComponent {
@Input() practiceForm!: FormGroup;
@Input() questions: QuestionVM[] = [];
@Output() saveDisabled = new EventEmitter<boolean>();
@Output() timerToggle = new EventEmitter<'total' | 'perQuestion'>();
incrementAttemptsNumber(){
  const currentValue = this.practiceForm.get('attemptsNumber')?.value || 0;
  this.practiceForm.get('attemptsNumber')?.setValue(currentValue + 1);
}
decrementAttemptsNumber(){
  const currentValue = this.practiceForm.get('attemptsNumber')?.value || 0;
  if(currentValue > 0){
    this.practiceForm.get('attemptsNumber')?.setValue(currentValue - 1);
  }
}
get formattedAttemptsNumber(): string {
  return this.practiceForm.get('attemptsNumber')?.value.toString().padStart(2, '0') || '00';
}
checkTimevalidation(event:boolean){
this.saveDisabled.emit(event)
}
toggleTimer(selected: 'total' | 'perQuestion') {
  this.timerToggle.emit(selected);
}
}
