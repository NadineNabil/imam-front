import { IObjectiveBusiness, OBJECTIVE_BUSINESS_TOKEN } from './../../../../domain/business-contracts/objective-business.contract';
import { Component, computed, effect, Inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { atLeastOneCheckedValidator, totalQuestionsNumber, totalWeightValidator } from 'src/app/shared/services/create-exam-custom-validation';
import { QuestionTypeEnum } from 'src/app/domain/enums/question-type.enum';
import { QUESTION_TYPE_IMAGES } from 'src/app/presentation/constants/question-type-images';
import { ResponseTypeEnum } from 'src/app/domain/enums/response-type.enum';
import { COURSE_BUSINESS_TOKEN, ICourseBusiness } from 'src/app/domain/business-contracts/course-business.contract';
import { catchError, combineLatest, distinctUntilChanged, filter, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CATEGORY_BUSINESS_TOKEN, ICategoryBusiness } from 'src/app/domain/business-contracts/category-business.contract';
import { ISubCategoryBusiness, SUBCATEGORY_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/subCategory-business.contract';
import { ILearningUnitBusiness, LEARNING_UNIT_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/learning-unit-business.contract';
import { ExamUiMapper } from 'src/app/presentation/ui-mappers/exam-ui.mapper';
import { QuestiontTypeUiMapper } from 'src/app/presentation/ui-mappers/questiontype-ui.mapper';
import { QuestionVM } from 'src/app/presentation/models/questions-ui-model';
import { ExamSourceEnum  } from 'src/app/domain/enums/exam-source.enum';
import { EXAM_BUSINESS_TOKEN, IExamBusiness } from 'src/app/domain/business-contracts/exam-business.contract';
import { ToastService } from 'src/app/shared/services/toast-service';
import { Router } from '@angular/router';
import { ObjectivesState, ObjectiveUI } from 'src/app/presentation/models/objective-ui.model';

@Component({
  selector: 'app-create-exam',
  templateUrl: './create-exam.component.html',
  styleUrl: './create-exam.component.scss',
  standalone: false
})
export class CreateExamComponent implements OnInit {
  //will take the field types from entity
  //replace any with exam entity
  examForm: FormGroup;
  examSource=ExamSourceEnum
  isAddingNewObjective: boolean = false;
public ExamSourceEnum = ExamSourceEnum;
  selectedCategoryId = signal<number | null>(null);
  selectedSubCategoryId = signal<number | null>(null);
  selectedCourseId = signal<number | null>(null);
  selectedLearningUnits = signal<number[]>([]);
  loading: boolean=false;

  jsonFileData:QuestionVM[]=[]
  courses = toSignal(
    toObservable(
      computed(() => ({
        categoryId: this.selectedCategoryId(),
        subCategoryId: this.selectedSubCategoryId()
      }))
    ).pipe(
      switchMap(({ categoryId, subCategoryId }) => {
        if (subCategoryId) {
          return this.CourseBusiness.getCoursesBySubCategoryId(subCategoryId);
        }
        if (categoryId) {
          return this.CourseBusiness.getCoursesByCategoryId(categoryId);
        }
        return of([]);
      })
    ),
    { initialValue: [] });

  categories = toSignal(this.CategoryBusiness.getAllCategories(), { initialValue: [] });

  subCategories = toSignal(toObservable(this.selectedCategoryId).pipe(

    switchMap(categoryId => {
      if (categoryId === null || categoryId==undefined) return of([]);
      return this.SubCategoryBusiness.getSubCategoriesByCategoryId(categoryId);
    })
  ), { initialValue: [] })
  // Signal with Category objects
objectives = toSignal(
  combineLatest([
    toObservable(this.selectedCourseId),
    toObservable(this.selectedLearningUnits)
  ]).pipe(
    switchMap(([courseId, learningUnits]) => {
      // Start with loading
      const loadingState: ObjectivesState = { data: [], loading: true, error: false };
      (this.examForm.get('objectives') as FormArray).clear();
      const questions = this.examForm.get('questions') as FormArray;

      questions.controls.forEach(control => control.reset());
      


      if (courseId == null) {
        return of({ data: [], loading: false, error: false });
      }

      let request$: Observable<any[]>;

      if (!learningUnits || learningUnits.length === 0) {
        request$ = this.ObjectivetBusiness.getObjectivesByCourseId(courseId);
      } else {
        request$ = this.ObjectivetBusiness.getObjectivesByCourseIdAndUnits(courseId, learningUnits);
      }

      return request$.pipe(
    tap((objectives: ObjectiveUI[]) => {
     if(this.examForm.get('examSource')?.value===ExamSourceEnum.GENERATED){
  if (objectives.length > 0 && !objectives[0].filename ) {
    this.examForm.patchValue({
      aiQuestionRatio: 100,
      sourceMaterialRatio: 0,
      hasKnoledgeSource: false
    });
    this.examForm.get('aiQuestionRatio')?.disable()
    this.examForm.get('sourceMaterialRatio')?.disable()
  } else {

    this.examForm.patchValue({
      aiQuestionRatio: 0,
      sourceMaterialRatio: 100,
      hasKnoledgeSource: true
    });
    this.examForm.get('aiQuestionRatio')?.enable()
    this.examForm.get('sourceMaterialRatio')?.enable()
  }
}
}),
        map(data => ({ data, loading: false, error: false })),
        catchError(() => of({ data: [], loading: false, error: true })),
        startWith(loadingState) // emit loading first
      );
    })
  ),
  { initialValue: { data: [], loading: false, error: false } }
);



  learningUnits = toSignal(toObservable(this.selectedCourseId).pipe(
    switchMap((courseId) => {
      if (courseId === null || courseId==undefined) return of([])
      return this.learningUnitBusiness.getLearningUnitsByCourseId(courseId)
    })
  ), { initialValue: [] })



  mainFields = [
    'category',
    'examName',
    'course',
    'complexityLevel',
    'examSource',
    'examType'
  ];

  constructor(private fb: FormBuilder,private toastr:ToastService,private router:Router,
    @Inject(COURSE_BUSINESS_TOKEN) private readonly CourseBusiness: ICourseBusiness,
    @Inject(CATEGORY_BUSINESS_TOKEN) private readonly CategoryBusiness: ICategoryBusiness,
    @Inject(SUBCATEGORY_BUSINESS_TOKEN) private readonly SubCategoryBusiness: ISubCategoryBusiness,
    @Inject(LEARNING_UNIT_BUSINESS_TOKEN) private readonly learningUnitBusiness: ILearningUnitBusiness,
    @Inject(OBJECTIVE_BUSINESS_TOKEN) private readonly ObjectivetBusiness: IObjectiveBusiness,
        @Inject(EXAM_BUSINESS_TOKEN) private readonly ExamtBusiness: IExamBusiness,




  ) {
    this.examForm = this.fb.group({
      id: [0],
      category: [null, [Validators.required]],
      subCategory: [{
        value: null,
        disabled: this.subCategories().length === 0
      }],
      examName: ['', [Validators.required, Validators.pattern(/.*\S.*/), Validators.minLength(1),
    Validators.maxLength(100)]],
      course: [{ value: null, disabled: this.courses().length === 0 }, [Validators.required]],
      learningUnit: [{ value: null, disabled: this.learningUnits().length === 0 }],
      complexityLevel: [null, [Validators.required]],
      objectives: this.fb.array([], [
        atLeastOneCheckedValidator('selected') // at least one selected
      ]),
      newObjectiveText: new FormControl(''),
      questionTypesArray: this.fb.array([], [
        atLeastOneCheckedValidator('selected'),
        totalQuestionsNumber()
      ]),
      responseTypesArray: this.fb.array([], [
        atLeastOneCheckedValidator('selected')
      ]),
      examType:[null,[Validators.required]],
      examSource:[null,[Validators.required]],
      questions: this.fb.array([]),
      aiQuestionRatio: [0, [Validators.min(0), Validators.max(100)]],
      sourceMaterialRatio: [100, [Validators.min(0), Validators.max(100)]],
      hasKnoledgeSource:[false]
    })
    // Sync form controls with signals
    effect(() => {
      this.subCategories().length > 0
        ? this.examForm.get('subCategory')?.enable({ emitEvent: false })
        : this.examForm.get('subCategory')?.disable({ emitEvent: false });

      this.courses().length > 0
        ? this.examForm.get('course')?.enable({ emitEvent: false })
        : this.examForm.get('course')?.disable({ emitEvent: false });

      this.learningUnits().length > 0
        ? this.examForm.get('learningUnit')?.enable({ emitEvent: false })
        : this.examForm.get('learningUnit')?.disable({ emitEvent: false });
    });
  }
  ngOnInit(): void {
    this.initQuestionTypes();
    this.initresponseTypes()
    // Now set totalWeightValidator dynamically
const objectivesArray = this.examForm.get('objectives') as FormArray;
if (this.examForm.get('examSource')?.value===ExamSourceEnum.GENERATED) {
  objectivesArray.setValidators([
    totalWeightValidator(true),
    atLeastOneCheckedValidator('selected')
  ]);
} else {
  objectivesArray.setValidators([
    atLeastOneCheckedValidator('selected')
  ]);
}
objectivesArray.updateValueAndValidity({ emitEvent: false });
  }

  submitExam() {
   if(this.examForm.valid){
   const examEntity= ExamUiMapper.toDomain(this.examForm.value)
   console.log(examEntity)
   }
  }
  //getters
  get objectivesFormArray() {
    return this.examForm.get('objectives') as FormArray;
  }
  get questionTypesArray() {
    return this.examForm.get('questionTypesArray') as FormArray;
  }
  get responseTypesArray() {
    return this.examForm.get('responseTypesArray') as FormArray;
  }
  get totalweight(): number {
    const objectives = this.objectivesFormArray.controls;
    return objectives.filter(group => group.get('selected')?.value).reduce((sum, group) => {
      return sum += Number(group.get('weight')?.value);
    }, 0);
  }
  //initiation
  initQuestionTypes() {
    Object.values(QuestionTypeEnum).filter(qt => typeof qt === 'string').forEach(qt => {
      this.questionTypesArray.push(this.fb.group({
        questionType: [qt],
        numberOfQuestions: [{ value: 0, disabled: true }, [Validators.min(1),Validators.pattern('^[1-9]\\d*$')]],
        selected: [false],
        image: [QUESTION_TYPE_IMAGES[qt as QuestionTypeEnum]]
      }));
    });
    // Enable/disable numberOfQuestions based on selected
    this.questionTypesArray.controls.forEach(group => {
      group.get('selected')?.valueChanges.subscribe(selected => {
        const numberOfQuestionsControl = group.get('numberOfQuestions');
        if (selected) {
          numberOfQuestionsControl?.markAsTouched();
          numberOfQuestionsControl?.setValue(1, { emitEvent: false });
          numberOfQuestionsControl?.enable({ emitEvent: false });
        } else {
          numberOfQuestionsControl?.setValue(0, { emitEvent: false });
          numberOfQuestionsControl?.disable({ emitEvent: false });
        }
      });
    });
  }
  initresponseTypes() {
    Object.values(ResponseTypeEnum).filter(rt => typeof rt === 'string').forEach(rt => {
      this.responseTypesArray.push(this.fb.group({
        responseType: [rt],
        selected: [false]
      }))
    })
  }
  //check main fields valid or not
  IsMainSectionValid(): boolean {
    return this.mainFields.every(field => this.examForm.get(field)?.valid);
  }
  onCategorySelected(categoryId: number) {
    this.selectedSubCategoryId.set(null);
    this.selectedCategoryId.set(categoryId);
    this.examForm.get('subCategory')?.reset();
    this.examForm.get('course')?.reset();
  }
  onSubCategorySelected(subCategoryId: number) {
    this.selectedSubCategoryId.set(subCategoryId)
    this.examForm.get('course')?.reset();
    this.examForm.get('learningUnit')?.reset();

  }
  onCourseSelected(courseId: number) {
    this.selectedCourseId.set(courseId)
    this.examForm.get('learningUnit')?.reset();
  }
    onUnitsSelected(learningUnits: number[]) {
      console.log(learningUnits,'units from parent')
    this.selectedLearningUnits.set(learningUnits)
  }
createExam() {
  this.loading=true
  const obj = ExamUiMapper.toDomain(this.examForm.value);
 console.log(obj,'obj from create exam')
  this.ExamtBusiness.createExam(obj).subscribe({
    next: (response) => {
        this.loading=false

      this.toastr.showSuccess(response.message)
    // Go back in history
      this.router.navigate(['/view-exams']);
      
    },
    error: (err) => {
              this.loading=false

      this.toastr.showError(err)
    }
  });
}


  onObjectivesNext(){
/*     if(this.examForm.get('examSource')?.value==='Manual'){
      // show questions and response types and in response next to generate the exam and save it
      this.showAIRelated=true
      this.showManualRelated=false
    }
    else if(this.examForm.get('examSource')?.value==='AI'){
     //show  upload file and extracted questions and in extracted question next will save the exam
      this.showAIRelated=false
      this.showManualRelated=true
    } */
  }
  onFileChange(jsonData:any){
   this.jsonFileData=QuestiontTypeUiMapper.mapRowsToQuestions(jsonData)
   console.log(this.jsonFileData,'djsonFileData')
 
  }
  get disableCreate(): boolean {
  const source = this.examForm.get('examSource')?.value;

  if (source === ExamSourceEnum.GENERATED) {
    return this.responseTypesArray.invalid || this.loading;
  }

  if (source === ExamSourceEnum.MANUAL) {
    return this.examForm.get('questions')?.invalid || this.loading;
  }

  return this.loading;
}
}