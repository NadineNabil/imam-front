import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-question-types',
  templateUrl: './question-types.component.html',
  styleUrl: './question-types.component.scss',
  standalone: false
})
export class QuestionTypesComponent implements OnChanges{
@Input() questionTypesFormArray!: FormArray;
@Input() parentForm!: FormGroup; // optional
Objectives: {objective:string, questions:number ,weight:number, hasError:boolean}[] = [];
questionsNumber:number=0
totalWeight:number=0;
constructor(){
}
  ngOnChanges(changes: SimpleChanges): void {
     if (changes['parentForm'] && this.parentForm) {
    this.initSubscriptions();
  }

  }

initSubscriptions() {
  const questionTypesArray = this.parentForm.get('questionTypesArray') as FormArray;
  const objectivesArray = this.parentForm.get('objectives') as FormArray;

  // Subscribe to questionTypes numberOfQuestions changes
 // Subscribe to both numberOfQuestions and selected changes
questionTypesArray.controls.forEach(ctrl => {
  // numberOfQuestions changes
  ctrl.get('numberOfQuestions')?.valueChanges.subscribe(() => {
    this.calculateQuestionsForObjectives();
  });

  // selected changes
  ctrl.get('selected')?.valueChanges.subscribe(() => {
    this.calculateQuestionsForObjectives();
  });
  });

  // Subscribe to objectives weight changes (not numberOfQuestions!)
  objectivesArray.controls.forEach(ctrl => {
    ctrl.get('weight')?.valueChanges.subscribe(() => {
      this.calculateQuestionsForObjectives();
    });
  });
}

calculateQuestionsForObjectives() {
  const questionTypesArray = this.parentForm.get('questionTypesArray') as FormArray;
  const objectivesArray = this.parentForm.get('objectives') as FormArray;

  // get the total number of questions from selected question types
  const totalQuestions = questionTypesArray.controls
    .filter(ctrl => ctrl.get('selected')?.value)
    .reduce((sum, ctrl) => sum + Number(ctrl.get('numberOfQuestions')?.value || 0), 0);

  this.Objectives = [];

  // get selected objectives with their weights and texts
  const selectedObjectives = objectivesArray.controls
    .map((ctrl, index) => ({
      ctrl,
      index,
      weight: Number(ctrl.get('weight')?.value),
      text: ctrl.get('objectiveText')?.value,
      selected: ctrl.get('selected')?.value
    }))
    .filter(obj => obj.selected && obj.weight);

  if (selectedObjectives.length === 0) return;

  //calculate questions for each objective using Largest Remainder 
  let fractionalQuestions = selectedObjectives.map(obj => ({
    ...obj,
    exact: (totalQuestions * obj.weight) / 100,
    assigned: 0,
    fraction: 0
  }));

  // ha7sib l assgined b eni a get floor of number to get the integer number and  subtract to get the fraction part
  fractionalQuestions.forEach(obj => {
    obj.assigned = Math.floor(obj.exact);
    obj.fraction = obj.exact - obj.assigned;
  });

  //bageb total l integers numbers (assigned eli 3mltlha floor) w b3dha3mlha subtract mn totalQuestions 3shan a3rf kam question ba2y a3mlha distribute 3la l objectives eli 3ndhom akbar fraction
  let assignedSum = fractionalQuestions.reduce((sum, obj) => sum + obj.assigned, 0);
  let remaining = totalQuestions - assignedSum;

  // handle l so2al el ba2y 3la l objectives eli 3ndhom akbar fraction aw akbr weight law fehom nafs el fraction
  while (remaining > 0) {
    fractionalQuestions.sort((a, b) => {
      if (b.fraction === a.fraction) return b.weight - a.weight;
      return b.fraction - a.fraction;
    });
    fractionalQuestions[0].assigned += 1;
    fractionalQuestions[0].fraction = 0; // remove the fraction after assigning the remaining question
    remaining--;
  }
  fractionalQuestions.sort((a, b) => a.index - b.index); // 3shan l trteb yfdal zay mahowa fl UI

  fractionalQuestions.forEach(obj => {
    const questions = obj.assigned;
    this.Objectives.push({
      objective: obj.text || '',
      weight: obj.weight,
      questions: questions,
      hasError: questions < 1
    });
  });
}
get ObjectiveshasQuestions(){
  const totalQuestions = this.Objectives.reduce(
    (sum, obj) => sum + obj.questions,
    0
  );
  return totalQuestions > 0;
}
get ObjectivestTotalWeight(){
  return this.Objectives.reduce((sum, obj) => sum + obj.weight, 0);
}
}

