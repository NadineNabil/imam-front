import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { atLeastOneCheckedValidator } from 'src/app/shared/services/create-exam-custom-validation';
import { NgbNav, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { from, Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ExamBusiness } from 'src/app/domain/business/exam.business';
import { ActivatedRoute } from '@angular/router';
import { ExamUiMapper } from 'src/app/presentation/ui-mappers/exam-ui.mapper';
import { QuestionVM } from 'src/app/presentation/models/questions-ui-model';
import { examtypes } from 'src/app/domain/enums/exam-types.enum';
import { ObjectiveUI } from 'src/app/presentation/models/objective-ui.model';
import { BaseOptionsSettings } from 'src/app/domain/entities/BaseSettingOptionsSettings.entity';
import { SETTINGS_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/settings-business.contract';
import { SettingsBusiness } from 'src/app/domain/business/settings.business';
import { ToastService } from 'src/app/shared/services/toast-service';
import { EXAM_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/exam-business.contract';
import { ScheduleBusiness } from 'src/app/domain/business/schedule-business';
import { SCHEDULE_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/schedule.business.contract';
import { isEqual } from 'lodash';
import { scheduleValidator } from 'src/app/shared/services/schedule-validator.service';
import { CanComponentDeactivate, UnsavedChangesService } from 'src/app/shared/services';


@Component({
  selector: 'app-exam-details',
  templateUrl: './exam-details.component.html',
  styleUrl: './exam-details.component.scss',
  standalone: false
})
export class ExamDetailsComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  @ViewChild('customNav') customNav!: NgbNav;
  examName: string = "";
  ExamId: number = 0;
  questions: QuestionVM[] = []
  objectives: ObjectiveUI[] = []
  initialQuestionsValue: any;
  initialAssessmentValue: any;
  initialPracticeValue: any;
  initialScheduleValue:any;
  loading:boolean=false;
saveButtonDisabled: boolean = false;
  activeTabId: number = 1;
  sub1: Subscription = new Subscription();
  sub2: Subscription = new Subscription();
  sub3: Subscription = new Subscription();
  sub4: Subscription = new Subscription();


  get currentTab(): 'questions' | 'assessment' | 'training' | 'schedule' {
    switch (this.activeTabId) {
      case 1: return 'questions';
      case 2: return this.trainingExam ? 'training' : 'assessment';
      case 3: return 'schedule';
      default: return 'questions';
    }
  }
  get isCurrentFormInvalid(): boolean {
  switch (this.currentTab) {
    case 'questions':
      return this.questionsForm.invalid;
    case 'assessment':
      return this.assessmentForm.invalid;
    case 'training':
      return this.practiceForm.invalid;
    case 'schedule':
      return this.scheduleForm.invalid;
    default:
      return true;
  }
}
  // Separate forms
  examActivation = new FormControl<boolean>(false, { nonNullable: true });
  questionsForm!: FormGroup;
  assessmentForm!: FormGroup;
  practiceForm!: FormGroup;
  trainingExam: boolean = false; // Set this based on the exam type
  scheduleForm!: FormGroup;
  settingsData?: BaseOptionsSettings;
  examSetting: string = 'EXAMS.ASSESSMENT_SETTINGS'; //it depends on the exam type
  constructor(@Inject(SETTINGS_BUSINESS_TOKEN) private readonly settingsBusiness: SettingsBusiness,
    @Inject(EXAM_BUSINESS_TOKEN) private readonly examBusiness: ExamBusiness,
    @Inject(SCHEDULE_BUSINESS_TOKEN) private readonly scheduleBusiness: ScheduleBusiness,
    private toastr: ToastService,
    private unsavedChangesService: UnsavedChangesService,
    private route: ActivatedRoute, private fb: FormBuilder, private translate: TranslateService) {
    // 1 Questions Form
    this.questionsForm = this.fb.group({
      objectives: this.fb.array([], [
        atLeastOneCheckedValidator('selected')
      ]),
      questions: this.fb.array([]),
    });

    // 2 Assessment Settings Form
    this.assessmentForm = this.fb.group({
      examId: [this.ExamId],
      totalHours: [2],
      totalMinutes: [30],
      perQuestionMinutes: [1],
      perQuestionTimerActive: [false],
      totalQuestionTimerActive: [false],
      disableCopy: [false],
      randomizeQuestionOrder: [false],
      randomizeAnswerChoices: [false],
      enableSpellCheck: [false],
      allowBackwardNavigation: [false],
      missingAnswerReminder: [false]
    });

    // 3 Practice Settings Form
    this.practiceForm = this.fb.group({
      examId: [this.ExamId],
      limitedAttempts: [false],
      attemptsNumber: [0],
      totalHours: [2],
      totalMinutes: [30],
      perQuestionMinutes: [1],
      perQuestionTimerActive: [false],
      totalQuestionTimerActive: [false],
      disableCopy: [false],
      randomizeQuestionOrder: [false],
      randomizeAnswerChoices: [false],
      enableSpellCheck: [false],
      allowBackwardNavigation: [false],
      missingAnswerReminder: [false]
    });

    // 4 Schedule Exam Form
    this.scheduleForm = this.fb.group({
      examId: [this.ExamId],
      scheduleDate: [null,Validators.required],
      scheduleTime: [null,Validators.required],
      endDate: [null,Validators.required],
      endTime: [null,Validators.required]
    },{ validators: scheduleValidator });
  }
  ngOnInit(): void {
    this.unsavedChangesService.registerComponent(this);

    //take the id and call the get exam by id function to get the details of the exam and patch the forms with the data
    this.ExamId = +(this.route.snapshot.paramMap.get('id') || 0);

    if (this.ExamId) {
      this.getExamById(+this.ExamId);
    } else {
      // In create mode && edit mode, set initial values immediately to the default empty state
      this.updateInitialValues();
    }

    //subscribe to value changes of all forms to check for changes 
    this.sub1 = this.questionsForm.valueChanges.subscribe(() => this.checkForChanges());
    this.sub2 = this.assessmentForm.valueChanges.subscribe(() => this.checkForChanges());
    this.sub3 = this.practiceForm.valueChanges.subscribe(() => this.checkForChanges());
   this.listenToActivationChanges()

  }
  //check if user allowed to leave the page or not (check tabs)
  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (this.checkForChanges()) {
      changeEvent.preventDefault();
      this.confirmUnsavedChanges().subscribe(result => {
        if (result) {
          this.activeTabId = changeEvent.nextId; //update active tab only if user confirms navigation either saved or not saved
        }
      });
    } else {
      this.activeTabId = changeEvent.nextId;
    }
  }
  //check if user allowed to leave the page or not (check routes)
  canDeactivate(): Observable<boolean> {
    if (this.checkForChanges()) {
      return this.confirmUnsavedChanges();
    }
    return of(true);
  }

  private confirmUnsavedChanges(): Observable<boolean> {
    return from(Swal.fire({
      title: this.translate.instant('EXAMS.UNSAVED_CHANGES'),
      showDenyButton: true,
      confirmButtonText: this.translate.instant('EXAMS.SAVE'),
      denyButtonText: this.translate.instant('EXAMS.DONT_SAVE'),
      showCancelButton: false,
      showCloseButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      preConfirm: () => {
        if (this.isCurrentFormInvalid) {
          // Stop SweetAlert from closing and show an error
          Swal.showValidationMessage(
            this.translate.instant('EXAMS.FORM_INVALID_WARNING')
          );
          return false; // prevents modal from closing
        }

        return true;
      }
    }))
    .pipe(
      switchMap((result) => {
        if (result.isConfirmed) {
          this.saveCurrentTabForm();
          return of(true);
        } else if (result.isDenied) {
          this.resetForms();
          return of(true);
        } else {
          return of(false);
        }
      })
    );
  }
  //if saved i have to update initial values to the new values to compare with later if there are changes or not
  private updateInitialValues() {
  this.initialQuestionsValue = this.questionsForm.getRawValue();
  this.initialAssessmentValue = this.assessmentForm.getRawValue();
  this.initialPracticeValue = this.practiceForm.getRawValue();
  this.initialScheduleValue = this.scheduleForm.getRawValue();
  }

  private resetForms() {
   // reset simple forms
  this.assessmentForm.reset(this.initialAssessmentValue, { emitEvent: false });
  this.practiceForm.reset(this.initialPracticeValue, { emitEvent: false });
  this.scheduleForm.reset(this.initialScheduleValue, { emitEvent: false });

  // reset questions form
  const questionsArray = this.questionsForm.get('questions') as FormArray;
  // remove extra questions
  if (questionsArray && this.initialQuestionsValue?.questions) {
    while (questionsArray.length > this.initialQuestionsValue.questions.length) {
      questionsArray.removeAt(questionsArray.length - 1);
    }
  }
  // now reset values
  if (this.initialQuestionsValue) {
    this.questionsForm.patchValue(this.initialQuestionsValue, { emitEvent: false });
  }
  }
  saveQuestionsForm() {
    if(this.questionsForm.invalid) return 
    this.examBusiness.updateQuestions(this.ExamId, ExamUiMapper.toObjectivesDomain(this.questionsForm.value)).subscribe({
      next: (response) => {
        this.toastr.showSuccess(response.message);
        this.getExamById(this.ExamId);
      },
      error: (error) => {
        this.toastr.showError(error.message);
      }
    });
  }
  saveAssessmentForm() {
    if(this.assessmentForm.invalid) return 
    const cleanedValue = this.validateAndCleanForm(this.assessmentForm.value);
    if (!cleanedValue) {
      return; // stop save if form is invalid
    }
    this.settingsBusiness.setSettings(this.ExamId, cleanedValue).subscribe({
      next: (response) => {
        this.toastr.showSuccess(response.message);
        this.updateInitialValues();
      },
      error: (error) => {
        this.toastr.showError(error.message);
      }
    });

  }
  savePracticeForm() {
      if(this.practiceForm.invalid) return 
    const cleanedFormValue = this.validateAndCleanForm(this.practiceForm.value);
    if (!cleanedFormValue) {
      return; // stop save if form is invalid
    }
    this.settingsBusiness.setSettings(this.ExamId, cleanedFormValue).subscribe({
      next: (response) => {
        this.toastr.showSuccess(response.message);
        this.updateInitialValues();
      },
      error: (error) => {
        this.toastr.showError(error.message);
      }
    });
  }
  saveScheduleForm() {
      if(this.scheduleForm.invalid) return 
        const scheduleDate = this.scheduleForm.get('scheduleDate')?.value;
  const scheduleTime = this.scheduleForm.get('scheduleTime')?.value;

  const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
  const now = new Date();

  // activation = false
  const isNow =
    Math.abs(scheduledDateTime.getTime() - now.getTime()) < 60000; 

  if (!isNow) {
    this.examActivation.setValue(false, { emitEvent: false });
  }
    this.scheduleBusiness.updateDate(this.ExamId, this.scheduleForm.get('scheduleDate')?.value,
      this.scheduleForm.get('scheduleTime')?.value,this.scheduleForm.get('endDate')?.value,
    this.scheduleForm.get('endTime')?.value).subscribe({
        next: (response) => {
          this.toastr.showSuccess(response.message);
          this.updateInitialValues();
        },
        error: (error) => {
          this.toastr.showError(error.message);
        }
      });
  }

  checkForChanges(): boolean {
  return !isEqual(this.questionsForm.value, this.initialQuestionsValue)
      || !isEqual(this.assessmentForm.value, this.initialAssessmentValue)
      || !isEqual(this.practiceForm.value, this.initialPracticeValue)
      || !isEqual(this.scheduleForm.value, this.initialScheduleValue);
  }
  saveCurrentTabForm() {
    switch (this.currentTab) {
      case 'questions':
        this.saveQuestionsForm();
        break;
      case 'assessment':
        this.saveAssessmentForm();
        break;
      case 'training':
        this.savePracticeForm();
        break;
      case 'schedule':
        this.saveScheduleForm();
        break;
    }
    this.updateInitialValues();
  }
  getExamById(id: number) {
    //call the business layer to get the exam details by id and patch the forms with the data
    this.examBusiness.getExamById(id).subscribe({
      next: (exam: any) => {
        const formModel = ExamUiMapper.toFormModel(exam);
        this.examName = formModel.examName ?? '';
        this.trainingExam = formModel.examType === (examtypes.Training).toString() as examtypes;
        this.examActivation.setValue(!!formModel.active, { emitEvent: false });
        this.questions = formModel.questions || [];
        this.objectives = formModel.objectives || [];
        this.scheduleForm.patchValue({
          scheduleDate: formModel.scheduleDate || '',
          scheduleTime: formModel.scheduleTime || '',
          endDate:formModel.endDate|| '',
          endTime:formModel.endTime|| '',
        });
        this.examSetting = this.trainingExam ? 'EXAMS.TRAINING_SETTINGS' : 'EXAMS.ASSESSMENT_SETTINGS';
        if (this.trainingExam && formModel.settings) {
          this.practiceForm.patchValue(formModel.settings);
        } else if (!this.trainingExam && formModel.settings) {
          this.assessmentForm.patchValue(formModel.settings);
        }
        if(!this.trainingExam && ( this.assessmentForm.get('totalHours')?.value > 0 || this.assessmentForm.get('totalMinutes')?.value > 0)) {
         this.toggleTimer('total');
        } else if(!this.trainingExam && this.assessmentForm.get('perQuestionMinutes')?.value > 0) {
        this.toggleTimer('perQuestion');
        }
        if(this.trainingExam && (this.practiceForm.get('totalHours')?.value > 0 || this.practiceForm.get('totalMinutes')?.value > 0)) {
         this.toggleTimer('total');

        } else if(this.trainingExam && this.practiceForm.get('perQuestionMinutes')?.value > 0) {
        this.toggleTimer('perQuestion');

        }

        // Set initial values after loading data from backend to avoid "unsaved changes" alert.
        // We use a longer timeout (1000ms) to ensure child components (Questions, Assessment) 
        // have fully finished patching their forms and any change detection cycles are complete.
        setTimeout(() => {
          this.updateInitialValues();
        }, 100);
      },
      error: (error) => {
        this.toastr.showError(error.message)
      }
    });

  }
  private validateAndCleanForm(formValue: any): any {
    const value = { ...formValue };

    // Per-question timer check
    if (value.perQuestionTimerActive && value.perQuestionMinutes <= 0) {
      this.toastr.showError(this.translate.instant('EXAMS.PER_QUESTION_TIMER_MINIMUM_ERROR'));
      return null; // stop save
    }

    // Reset if timer is off
    if (!value.perQuestionTimerActive) {
      value.perQuestionMinutes = 0;
    }

    // Attempts check
    if (value.limitedAttempts && value.attemptsNumber <= 0) {
      this.toastr.showError(this.translate.instant('EXAMS.ATTEMPTS_NUMBER_ERROR'));
      return null; // stop save
    }
 
    // If unlimited, set attempts to 0
    if (!value.limitedAttempts) {
      value.attemptsNumber = 0;
    }

    return value;
  }
listenToActivationChanges() {
  this.examActivation.valueChanges
    .subscribe((value: boolean) => {
      this.loading=true
      this.scheduleForm.get('scheduleDate')?.setValue(null);
        this.scheduleForm.get('scheduleTime')?.setValue(null);
        this.scheduleForm.get('endDate')?.setValue(null);
        this.scheduleForm.get('endTime')?.setValue(null);
      this.sub4=this.examBusiness.activateExam(this.ExamId, value ?? false).subscribe({
    next: (response) => {
        this.loading=false
      this.toastr.showSuccess(response.message)
    },
    error: (err) => {
      this.loading=true
       this.toastr.showError(err.message)
      this.examActivation.setValue(!value, { emitEvent: false });
}})
})
}
onSaveDisabled(disabled: boolean){
this.saveButtonDisabled = disabled;
}
toggleTimer(selected: 'total' | 'perQuestion') {
  if(this.trainingExam){
  this.applyTimer(this.practiceForm, selected);
  }
  else this.applyTimer(this.assessmentForm, selected);
}
applyTimer(form: FormGroup, selected: 'total' | 'perQuestion') {
  if (selected === 'total') {
    form.patchValue({
      totalQuestionTimerActive: true,
      perQuestionTimerActive: false,
      perQuestionMinutes: 0
    });
  } else {
    form.patchValue({
      totalQuestionTimerActive: false,
      perQuestionTimerActive: true,
      totalHours: 0,
      totalMinutes: 0
    });
  }
}
  ngOnDestroy(): void {
    this.unsavedChangesService.unregisterComponent(this);
    // Unsubscribe from all form value changes to prevent memory leaks
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    this.sub4.unsubscribe();
  }
}
