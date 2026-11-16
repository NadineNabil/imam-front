import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { QuestionTypeEnum } from 'src/app/domain/enums/question-type.enum';
import { QuestionVM } from 'src/app/presentation/models/questions-ui-model';
import { ToastService } from '../services/toast-service';
import { ObjectiveUI } from 'src/app/presentation/models/objective-ui.model';
import { QUESTION_TYPE_CONFIG } from 'src/app/presentation/constants/question-type-images';
import { QuestionValidatorService } from '../services/question-validator.service';

@Component({
  selector: 'app-questions-form',
  templateUrl: './questions-form.component.html',
  styleUrl: './questions-form.component.scss',
  standalone: false
})
export class QuestionsFormComponent implements OnChanges, OnInit {
  @Input() isEditMode = false;
  @Input() jsonFileData: QuestionVM[] = []
  @Input() examForm!: FormGroup;
  constructor(private fb: FormBuilder, private translate: TranslateService, private toastr: ToastService, private questionValidatorService: QuestionValidatorService) { }
  ngOnInit(): void {
    const objectivesArray = this.examForm.get('objectives') as FormArray;
    if (!objectivesArray) return;

    if (this.isEditMode) {
      // In edit mode, we use the learningObjectives Input passed from the parent.
      // We don't overwrite it from the form value here.
      if (this.learningObjectives && this.learningObjectives.length > 0) {
        this.fillObjectivesFormArray(this.learningObjectives);
      }
    } else {
      // CREATE MODE: subscribe to value changes to keep learningObjectives in sync with selection
      objectivesArray.valueChanges.subscribe(arr => {
        this.learningObjectives = arr
          ?.filter((obj: any) => obj.selected)
          .filter((v: any) => !!v) || [];
      });
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jsonFileData']) {
      this.questionsArray.clear();
      this.jsonFileData.forEach(q => this.addQuestion(q));
      // CASE 2: JSON empty → ensure ONE empty question
      if (this.questionsArray.length === 0) {
        this.addQuestion(null);
      }
    }

    const objectivesArray = this.examForm.get('objectives') as FormArray;

  if (objectivesArray?.length) {
    this.learningObjectives = objectivesArray.value
      ?.filter((obj: any) => obj.selected)
      .filter((v: any) => !!v) || [];
  }

    if (this.isEditMode && changes['learningObjectives'] && changes['learningObjectives'].currentValue) {
      this.fillObjectivesFormArray(changes['learningObjectives'].currentValue);
    }
  }
  addQuestion(question: QuestionVM | null = null) {
    const fg = this.fb.group({
      id: [question?.id ?? null],
      type: [question?.type ?? null, Validators.required],
      question: [question?.question ?? '', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/.*\S.*/)
      ]],
      correctAnswer: [question?.correctAnswer ?? null],
      objectiveId: [question?.objectiveId || null, Validators.required],
      //  ALWAYS EXIST
      options: this.fb.array([]),
      leftitems: this.fb.array([]),
      rightitems: this.fb.array([])
    }, {
      validators: this.questionValidatorService
        .questionValidator
        .bind(this.questionValidatorService)
    });
    //  fill options if needed

    if (question && this.hasOptions(question.type)) {
      const optionsArr = fg.get('options') as FormArray;
      (question.options ?? []).forEach(opt => {
        optionsArr.push(
          this.fb.group({
            id: [opt.id ?? null],
            option: [opt.option ?? '', [Validators.required, Validators.pattern(/.*\S.*/)]],
            isCorrect: [opt.isCorrect ?? false],
            questionId: [opt.questionId ?? question?.id ?? null]
          })
        );
      });
    }

    //  fill sides if needed
    if (question && this.hasSides(question.type)) {
      const left = fg.get('leftitems') as FormArray;
      const right = fg.get('rightitems') as FormArray;

      (question.leftSide ?? []).forEach(v =>
        left.push(this.fb.group({ leftitem: [v, Validators.required] }))
      );

      (question.rightSide ?? []).forEach(v =>
        right.push(this.fb.group({ rightitem: [v, Validators.required] }))
      );
    }
    this.questionsArray.push(fg);
    fg.updateValueAndValidity();
  }
  // expose enum to template
  public QuestionTypeEnum = QuestionTypeEnum;
  questionTypesList = Object.values(QuestionTypeEnum).map(value => ({ key: value }));
  @Input() learningObjectives: ObjectiveUI[] = []
  showobjectives = false;
  Url = '';
  @Input() fromdetailsflag = false;

  // helpers used by template
  getTerms(block: AbstractControl): FormArray {
    return (block.get('leftitems') as FormArray) || this.fb.array([]);
  }

  getMatches(block: AbstractControl): FormArray {
    return (block.get('rightitems') as FormArray) || this.fb.array([]);
  }

  getOptions(block: AbstractControl): FormArray {
    return (block.get('options') as FormArray) || this.fb.array([]);
  }

  matchingOrDragandDrop(block: AbstractControl): boolean {
    /*   const t = block.get('type')?.value as QuestionTypeEnum;
      return [QuestionTypeEnum.Matching, QuestionTypeEnum.DragAndDrop].includes(t as any); */
    return false //temp
  }

  showOptions(block: AbstractControl): boolean {
    const t = block.get('type')?.value as QuestionTypeEnum;
    return this.hasOptions(t as any);
  }
  removequestion(index: number) {
    if (!this.questionsArray) return;
    if (this.questionsArray?.length > 1) {
      this.questionsArray.removeAt(index);
    }
    else {
      this.toastr.showError(this.translate.instant('EXAMS.AT_LEAST_QUESTION_REQUIRED'))
    }
  }

  removeitem(block: AbstractControl, index: number, arrayName: string) {
    const arr = block.get(arrayName) as FormArray;
    if (!arr) return;
    arr.removeAt(index);
  }
  trackByFn(index: number, control: AbstractControl) {
    return control;
  }

  addTerm(blockIndex: number) {
    const block = this.questionsArray.at(blockIndex) as FormGroup;
    if (!block) return;
    const arr = (block.get('leftitems') as FormArray) || this.fb.array([]);
    if (!block.get('leftitems')) block.addControl('leftitems', arr);
    arr.push(this.fb.group({ leftitem: ['', Validators.required] }));
  }

  addMatch(blockIndex: number) {
    const block = this.questionsArray.at(blockIndex) as FormGroup;
    if (!block) return;
    const arr = (block.get('rightitems') as FormArray) || this.fb.array([]);
    if (!block.get('rightitems')) block.addControl('rightitems', arr);
    arr.push(this.fb.group({ rightitem: ['', Validators.required] }));
  }
  addChoice(blockIndex: number) {
    const block = this.questionsArray.at(blockIndex) as FormGroup;
    if (!block) return;

    const optionsArr = block.get('options') as FormArray;
    if (!optionsArr) {
      block.addControl('options', this.fb.array([]));
    }


    const newOption = this.fb.group({
      id: [null],
      option: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
      isCorrect: [false],
     questionId: [block.get('id')?.value ?? null]
    });

    optionsArr.push(newOption);

    const strategy = QUESTION_TYPE_CONFIG[block.get('type')?.value as QuestionTypeEnum]?.selectionStrategy;

  }

  // display helpers
  getDynamicTerms(type: any) { return 'left_items_label'; }
  getDynamicMatches(type: any) { return 'right_items_label'; }
  placeholderdynamiccontent(type: any) { return 'Enter item'; }
  placeholderdynamiccontent2(type: any) { return 'Enter match'; }
  optiondynamidtext(type: any) { return 'EXAMS.OPTION'; }
  fixPunctuation(s: string) { return s; }
  get questionsArray() {
    return this.examForm.get('questions') as FormArray;
  }
  hasOptions(type: QuestionTypeEnum): boolean {
    return !!type && !!QUESTION_TYPE_CONFIG[type]?.hasOptions
  }

  hasSides(type: QuestionTypeEnum): boolean {
    return !!type && !!QUESTION_TYPE_CONFIG[type]?.hasSides
  }
  removeItem(block: any, index: number, keyname: string) {
    const arr = block.get(keyname) as FormArray
    if (arr.length <= 2) {
      this.toastr.showError(this.translate.instant('EXAMS.AT_LEAST_TWO_ITEMS'))
      return;
    }
    const type = block.get('type')?.value;
    arr.removeAt(index)
  }
  onTypeChange(block: AbstractControl, index: number, type: QuestionTypeEnum) {
    const optionsArr = block.get('options') as FormArray;
    if (!optionsArr) return;
    //specific for true/false type
    optionsArr.clear();
    if (type === QuestionTypeEnum.true_false) {
      /*       optionsArr.clear(); 
       */
      optionsArr.push(this.fb.group({
        option: ["true"],
        isCorrect: [false]
      }));

      optionsArr.push(this.fb.group({
        option: ["false"],
        isCorrect: [false]
      }));

      return;
    }
    if (this.hasOptions(type)) {
      // Ensure at least 2 options
      if (optionsArr.length === 0) {
        for (let i = 0; i < 2; i++) {
          optionsArr.push(this.fb.group({
            option: ['', [Validators.required, Validators.pattern(/.*\S.*/)]],
            isCorrect: [false]
          }));
        }
      }

      // Enforce single/multi selection rules and enable/disable

      return;
    }

    // Clear options if type doesn’t allow them
    optionsArr.clear();
  }


  hasError(control: AbstractControl | null, error: string) {
    return control && control.touched && control.hasError(error);
  }
  onCorrectChange(block: AbstractControl, selectedIndex: number) {
    const optionsArr = block.get('options') as FormArray;
    if (!optionsArr) return;

    const strategy = QUESTION_TYPE_CONFIG[block.get('type')?.value as QuestionTypeEnum]?.selectionStrategy;

    if (strategy === 'single') {
      optionsArr.controls.forEach((ctrl, i) => {
        ctrl.get('isCorrect')?.setValue(i === selectedIndex, { emitEvent: false });
        ctrl.get('isCorrect')?.enable({ emitEvent: false }); // كلهم enabled
      });
    }
    block.updateValueAndValidity();
  }
  fillObjectivesFormArray(objectives: ObjectiveUI[]) {
    const objectivesFormArray = this.examForm.get('objectives') as FormArray;
    if (!objectivesFormArray) return;
    objectivesFormArray.clear();
    objectives.forEach(obj => {
      objectivesFormArray.push(this.fb.group({
        id: obj.id,
        objectiveText: obj.objectiveText,
        cognitiveStyle: obj.cognitiveStyle || null,
        filename: obj.filename || null,
        weight: obj.weight || null,
        selected: obj.selected || false
      }));
    });
  }
}
