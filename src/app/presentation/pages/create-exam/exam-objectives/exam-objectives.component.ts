import { Component, effect, EventEmitter, Input, OnInit, Output, signal, Signal, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Objective } from 'src/app/domain/entities/objective.entity';
import { CognitiveStyle } from 'src/app/domain/enums/cognitive-style.enum';
import { ExamSourceEnum } from 'src/app/domain/enums/exam-source.enum';
import { ObjectivesState, ObjectiveUI } from 'src/app/presentation/models/objective-ui.model';
import { ToastService } from 'src/app/shared/services/toast-service';

@Component({
  selector: 'app-exam-objectives',
  templateUrl: './exam-objectives.component.html',
  styleUrl: './exam-objectives.component.scss',
  standalone: false
})
export class ExamObjectivesComponent implements OnInit {
  @Input() ObjectivesFormArray!: FormArray;
  @Input() examForm!: FormGroup;
  @Input() totalWeight!: number;
 private _objectives!: Signal<ObjectivesState> ;
  showObjectiveInput: boolean = false;
  ConginiveStyles = Object.values(CognitiveStyle).filter(value => typeof value === 'string');
  @Output() objectiveAdded: EventEmitter<ObjectiveUI> = new EventEmitter<ObjectiveUI>();
  @Output() openedNewObjective: EventEmitter<boolean> = new EventEmitter<boolean>();
  public examSource=ExamSourceEnum


  constructor(private toastr: ToastService, private translate: TranslateService,private fb:FormBuilder) {
 effect(() => {
  const state = this._objectives();

  // optional: you can skip updating form while loading
  if (state.loading) return;

  this.ObjectivesFormArray.clear();

  state.data.forEach(obj =>
    this.addObjective({
      ...obj,
      selected: false
    })
  );
});

  }
  ngOnInit(): void {

  }

@Input() set objectives(value: Signal<ObjectivesState>) {
  this._objectives = value;
}
  get objectives(): Signal<ObjectivesState> {
  return this._objectives;
}
  cancelAddObjective() {
    this.showObjectiveInput = false;
    this.ToggleNewObjectiveValidation(false);
    this.openedNewObjective.emit(false)


  }
    openNewObjective() {
    this.showObjectiveInput = true;
    console.log('Opening new objective input',this.showObjectiveInput);
    this.openedNewObjective.emit(true)
    this.ToggleNewObjectiveValidation(true);
  }
  addObjectiveFromInput(objectiveText: string) {
    if (!objectiveText?.trim()) return;
    const objective: ObjectiveUI = {
      objectiveText,
      filename:null,
      selected: true,         // default to selected
      cognitiveStyle: null,
      weight: null,
      id: 0
    };
    this.addObjective(objective);
    this.showObjectiveInput = false;
    this.ToggleNewObjectiveValidation(false);
    this.openedNewObjective.emit(false);
  }
  removeObjective(index: number) {
    if (this.ObjectivesFormArray.length === 1) {
      this.toastr.showError(this.translate.instant('EXAMS.AT_LEAST_ONE_OBJECTIVE_REQUIRED'));
      return;
    }
    this.ObjectivesFormArray.removeAt(index);
  }

  get hasanyweight() {
    return this.ObjectivesFormArray.controls.filter(group => group.get('selected')?.value).some(group => group.get('weight')?.value)
  }
  
    addObjective(objective: ObjectiveUI) {
      this.showObjectiveInput = false;
      //to disable next button when adding new objective
     this.openedNewObjective.emit(false)
     //to enable validation for new objective input
    this.ToggleNewObjectiveValidation(false)  
    const objectiveGroup = this.fb.group({
      selected: [objective.selected || false],
      cognitiveStyle: [objective.cognitiveStyle || null],
      weight: [objective.weight || null],
      id: [objective.id ?? Math.floor(Math.random() * 1_000_000)],
      objectiveText: [objective.objectiveText || ''],
      filename:[objective.filename || null],
      knowledgeSourceId:[objective.knowledgeSourceId || null],
      allocatedQuestions: [0]
    });
  // Function to update validators based on 'selected'
    // Apply validators immediately if selected
    if (objective.selected) {
      const cognitive = objectiveGroup.get('cognitiveStyle');
      const weight = objectiveGroup.get('weight');
      const text = objectiveGroup.get('objectiveText');
  
      cognitive?.setValidators([Validators.required]);
      if(this.examForm.get('examSource')?.value===ExamSourceEnum.GENERATED){
      weight?.setValidators([Validators.required, Validators.min(1), Validators.max(100),Validators.pattern(/^\d+$/) ]);

      }
      text?.setValidators([Validators.required, Validators.pattern(/\S+/)]);
  
      cognitive?.updateValueAndValidity({ emitEvent: false });
      weight?.updateValueAndValidity({ emitEvent: false });
      text?.updateValueAndValidity({ emitEvent: false });
    }
    // Only apply validators when selected is true
    objectiveGroup.get('selected')?.valueChanges.subscribe(selected => {
      console.log('Objective selected changed to:', selected);
      const isSelected = !!selected;
      const cognitive = objectiveGroup.get('cognitiveStyle');
      const weight = objectiveGroup.get('weight');
      const text = objectiveGroup.get('objectiveText');
  
      if (isSelected) {
        cognitive?.setValidators([Validators.required]);
      if(this.examForm.get('examSource')?.value===ExamSourceEnum.GENERATED){
      weight?.setValidators([Validators.required, Validators.min(1), Validators.max(100),Validators.pattern(/^\d+$/) ]);

      }
       text?.setValidators([Validators.required,Validators.pattern(/\S+/)]);
      } else {
        cognitive?.clearValidators();
        weight?.clearValidators();
        text?.clearValidators();
      }
  
      cognitive?.updateValueAndValidity({ emitEvent: false });
      weight?.updateValueAndValidity({ emitEvent: false });
      text?.updateValueAndValidity({ emitEvent: false });
    });
  
    this.ObjectivesFormArray.push(objectiveGroup);
  }
  ToggleNewObjectiveValidation(isAdding: boolean) {
    if(isAdding) {
      console.trace('Adding validators to newObjectiveText',isAdding);
      this.examForm.get('newObjectiveText')?.setValidators([Validators.required, Validators.pattern(/\S+/)]);
    } else {
      this.examForm.get('newObjectiveText')?.clearValidators();
      this.examForm.get('newObjectiveText')?.reset()
    }
    this.examForm.get('newObjectiveText')?.updateValueAndValidity();
  }
/*     initObjectives() {
      this.ObjectivesFormArray.clear();
    this.objectives().data.forEach(obj => this.addObjective({
      ...obj,
      selected: false
    }));
  } */
  
}
