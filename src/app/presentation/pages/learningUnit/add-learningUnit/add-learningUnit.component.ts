import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/shared/services/toast-service';
import { KnowledgeSourceType, KnowledgeType } from 'src/app/domain/enums/knowledge.enum';
import { QuestionTypeEnum } from 'src/app/domain/enums/question-type.enum';
import { IKnowledgeSourceBusiness, KnowledgeSource_business_TOKEN } from 'src/app/domain/business-contracts/KnowledgeSource.business.contract';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { ILearningUnitBusiness, LEARNING_UNIT_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/learning-unit-business.contract';
import { LearningUnits } from 'src/app/domain/entities/learningUnits.entity';
import { Course } from 'src/app/domain/entities/course.entity';
import { noWhitespaceValidator } from 'src/app/shared/validators/no-whitespace.validator';


export interface DropzoneVM {
  id: number;
  lang: any;
  config: any;
  hasFile: boolean;
  statusText: string | null;
  fileName?: string | null;
}


@Component({
  selector: 'app-add-learningUnit',
  templateUrl: './add-learningUnit.component.html',
  styleUrl: './add-learningUnit.component.scss',
  standalone: false
})
export class AddlearningUnitComponent implements OnInit {
  public QuestionTypeEnum = QuestionTypeEnum;
  learningUnitForm!: FormGroup;
  courseId!: number;
  courseName: string = '';
  loading=false;
  existinglearningUnits: LearningUnits[] = [];
  isLoadinglearningUnits: boolean = false;
  newlearningUnit: any;
  contentDropzoneConfig=this.KnowledgeSourceBusiness.CreateContentDropzoneConfigUseCase();
  dropzones: DropzoneVM[] = [];
  counter = 0;
  questionJson:any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    public toastService: ToastService,
    private translate: TranslateService,
    @Inject(LEARNING_UNIT_BUSINESS_TOKEN) private learningunitBusiness: ILearningUnitBusiness,
    @Inject(KnowledgeSource_business_TOKEN) private KnowledgeSourceBusiness: IKnowledgeSourceBusiness

  ) {
    this.learningUnitForm = this.fb.group({
      learningUnitName: ['', [Validators.required,
                              Validators.minLength(3),
                              Validators.maxLength(100),
                              Validators.pattern(/^(?!\s)(?!.*\s$)[^#@!$%^&*]+$/),
                              // noWhitespaceValidator
                               ]],
      courseName: [{ value: '', disabled: true }],
      courseId: [{ value: '', disabled: true }]
    });

    this.questionForm = this.fb.group({
      type: ['', [Validators.required]],
      question: ['', [Validators.required]],
      requirementType: ['', [Validators.required]]
    });

    // keep option fields in the reactive form so they can be edited when a file is parsed
    this.questionForm.addControl('option1', this.fb.control(''));
    this.questionForm.addControl('option2', this.fb.control(''));
    this.questionForm.addControl('option3', this.fb.control(''));
    this.questionForm.addControl('option4', this.fb.control(''));
  // add measure field to manual question form
  this.questionForm.addControl('measure', this.fb.control(''));
  }

  ngOnInit(): void {
    // Get courseId and courseName from route params or query params
    this.courseId =  this.route.snapshot.paramMap.get('courseId') as unknown as number;
    this.courseName = this.route.snapshot.queryParamMap.get('courseName') || (this.route.snapshot.paramMap.get('courseName') as unknown as string) || '';
 


    // Set course name in form
    this.learningUnitForm.patchValue({
      courseName: this.courseName,
      courseId: this.courseId
    });

  
    this.addDropzone(); // initial one

      // prepare question dropzone config (Step 3)
   
    this.questionDropzoneConfig = this.KnowledgeSourceBusiness.CreateQuestionSourceDropzoneConfig((data) => {
        // store and apply parsed JSON to the manual questions form/list
        this.applyParsedQuestions(data);
        
      });

    // when question type changes, prefill option fields for true/false
    const qtControl = this.questionForm.get('type');
    if (qtControl) {
      qtControl.valueChanges.subscribe((val) => {
        if (val === QuestionTypeEnum.true_false) {
          this.questionForm.patchValue({ option1: 'True', option2: 'False', option3: '', option4: '' });
        } else if (val === QuestionTypeEnum.multiple_choice) {
          // keep existing option values or clear if undefined
          this.questionForm.patchValue({ option1: this.questionForm.get('option1')?.value || '', option2: this.questionForm.get('option2')?.value || '', option3: this.questionForm.get('option3')?.value || '', option4: this.questionForm.get('option4')?.value || '' });
        } else {
          // other types: clear options
          this.questionForm.patchValue({ option1: '', option2: '', option3: '', option4: '' });
        }
      });
    }
  
  
  }


 

 




  get learningUnitNameError(): string {
    const control = this.learningUnitForm.get('learningUnitName');
    if (control?.hasError('required') && control?.touched) {
      return this.translate.instant('WIZARD.VALIDATION.LearningUnit_NAME_REQUIRED');
    }
   
    return '';
  }

  canProceedToNextStep(): boolean {
    return this.learningUnitForm.valid && this.learningUnitForm.get('learningUnitName')?.value?.trim();
  }

  onNextStep(stepper: any): void {
    
    if(stepper.selectedIndex ===0){
    
      // Mark all fields as touched to show validation errors
      this.learningUnitForm.markAllAsTouched();
      
      if (this.canProceedToNextStep()) {
        this.addNewlearningUnit(stepper);
        //stepper.next();
    }
  }  else if(stepper.selectedIndex ===1){
      stepper.next();   
    }

  }


  addNewlearningUnit(stepper: any): void {
    //add New Learning Unit
      this.learningunitBusiness.create(this.learningUnitForm.value.learningUnitName,this.courseId)
      .subscribe({
        next: (response) => {
          this.newlearningUnit=response;
          this.toastService.showSuccess(this.translate.instant('WIZARD.MESSAGES.LearningUnit_ADDED'), 5000);

          stepper.next();
        },
        error: (err) => {
          this.toastService.showError( err,5000);
        }
      })
  }
  /************ Step 2********* */


  learningUnitContent!: File | null;

   onContentAdded(file: any, dz: DropzoneVM) {
 
    this.learningUnitContent = file;
    const isVideo = file.type.startsWith('video/');
   
    // mark dropzone as having a file so language select gets disabled
    dz.hasFile = true;
    dz.fileName = file.name || null;
  

    file.meta={
      name : dz.fileName,
      description: "description description",
      knowledge_source_type: isVideo ? KnowledgeSourceType.Video : KnowledgeSourceType.File,
      knowledge_type: KnowledgeType.CourseContent,
      learning_unit_id: this.newlearningUnit.id,
      lang: dz.lang,
      time_stamp: new Date().toISOString()
    }
   
  
  }
  
 

 

  addDropzone() {
    const lang = null; // default - require user to pick

    const cfg = this.KnowledgeSourceBusiness.CreateContentDropzoneConfigUseCase();

    const dz: DropzoneVM = {
      id: ++this.counter,
      lang,
      config: cfg,
      hasFile: false,
      statusText: null
    };

    
  const baseCfg = { ...cfg };
  const self = this; // capture component context for use inside Dropzone callbacks
  baseCfg.init = function (this: any) {
      // call original init if present
      if (cfg && typeof cfg.init === 'function') {
        try {
          cfg.init.apply(this, arguments as any);
        } catch (e) {
          console.warn('base cfg.init error', e);
        }
      }

      // 'this' is Dropzone instance
      this.on('addedfile', (file: any) => {
        // store filename in vm so template can show it
        try {
          dz.fileName = file.name || null;
        } catch (e) {}
      });

      this.on('success', (file: any, response: any) => {
        // upload succeeded
        try {
          const msg = self.translate.instant('WIZARD.STEP2.upload.processingMessage');
          Swal.fire(msg);
        } catch (e) {
          console.warn('Swal success failed', e);
        }
      });

      this.on('error', (file: any, errorMessage: any) => {
        // upload failed
        try {
          const err = self.translate.instant('WIZARD.STEP2.upload.errorMessage');
          Swal.fire(err, '', 'error');
          // clear filename/state if desired
           this.removeFile(file); 
          dz.hasFile = false;
          dz.fileName = null;
        } catch (e) {
          console.warn('Swal error failed', e);
        }
      });
    };

    dz.config = baseCfg;

    this.dropzones.push(dz);
  }

  onLangChange(dz: DropzoneVM, lang: string) {
    dz.lang = lang;
    
  }

focusLangSelect(id: number) {
  const el = document.querySelector(
    `[data-dz-id="${id}"]`
  ) as HTMLSelectElement | null;

  if (el) {
    el.focus();
    if (typeof el.showPicker === 'function') {
      el.showPicker(); //  actually opens the dropdown
    }
  }
}


  /************ Step 3********* */
  questionForm!: FormGroup;
  questionFile!: File | null;
  // parsed JSON result from uploaded XLSX
  questionFileJson: any = null;
  questionDropzoneConfig: any;
  manualQuestions: Array<{
    type: string;
    question: string;
    requirementType: string;
    measure?: string | null;
    option1?: string | null;
    option2?: string | null;
    option3?: string | null;
    option4?: string | null;
  }> = [];



  downloadQuestionTemplate() {
    const templateUrl = 'assets/templates/Question_Source_template.xlsx';
    
    this.http.get(templateUrl, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Question_Source_template.xlsx';
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

  this.toastService.showSuccess(this.translate.instant('WIZARD.MESSAGES.TEMPLATE_DOWNLOADED'), 3000);
      },
      error: (error) => {
        console.error('Error downloading template:', error);
  this.toastService.showError(this.translate.instant('WIZARD.MESSAGES.TEMPLATE_DOWNLOAD_FAILED') || 'Failed to download template. Please try again.', 4000);
      }
    });
  }

  onQuestionFileAdded(file: File) {
    this.questionFile = file;
    this.toastService.showSuccess(this.translate.instant('WIZARD.MESSAGES.QUESTION_FILE_SELECTED'), 3000);
  }


  onQuestionFileRemoved() {
    this.questionFile = null;
    this.questionJson = null;
    this.questionFileJson = null;
    this.manualQuestions = [];
    this.toastService.showSuccess(this.translate.instant('WIZARD.QUESTION_FILE_REMOVED'), 3000);
  }

  /**
   * Apply parsed questions JSON into the manual questions list and prefill the manual entry form.
   * Expected JSON shape per row: { type: string, question: string, "option 1": string|null, ... }
   */
  /*
  applyParsedQuestions(data: any) {
    
    if (!data || !Array.isArray(data)) return;

    this.questionJson = data;
  

    
    // Map rows into the manualQuestions structure used by the manual form
    const parsed = data.map((row: any) => ({
      type: row.type ,
      question: row.question ,
      requirementType: row['requirement type'],
      measure: row['measure'] || row['question measure'] || row['question_measure'] || null,
      option1: row['option 1'] ,
      option2: row['option 2'] ,
      option3: row['option 3'] ,
      option4: row['option 4'] 
    }));

 
   this.manualQuestions = parsed;
   
   if(this.manualQuestions.length===0){
      this.toastService.showError(this.translate.instant('WIZARD.MESSAGES.NO_QUESTIONS_TO_ADD'), 5000);
    
    }
  }
  */

  applyParsedQuestions(data: any) {

  if (!data) return;

  let rows: any[] = [];
    let questionLang;
  // ✅ handle multiple input formats
  if (Array.isArray(data)) {
    rows = data;
  } else if (data && Array.isArray(data.questions)) {
    rows = data.questions;
    if (data.lang) {
      questionLang = data.lang;
    }
  } else if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) rows = parsed;
      else if (parsed && Array.isArray(parsed.questions)) {
        rows = parsed.questions;
        if (parsed.lang) questionLang = parsed.lang;
      }
    } catch (e) {
      return;
    }
  } else {
    return;
  }

  this.questionJson = rows;

  const validTypes = Object.values(QuestionTypeEnum);
  let hasError = false;

  const parsed = rows.map((row: any, index: number) => {

    // ✅ normalize type
    const type = row.type?.toLowerCase().replace(/[\s-]/g, '_');


    if (!validTypes.includes(type)) {
      this.toastService.showError(
        this.translate.instant('QUESTION.INVALID_TYPE', {
          type: row.type,
          row: index + 1
        })
      );
      hasError = true;
      return null;
    }

    // ✅ flexible option handling
    let option1 = row.option1 ?? row['option 1'] ?? null;
    let option2 = row.option2 ?? row['option 2'] ?? null;
    let option3 = row.option3 ?? row['option 3'] ?? null;
    let option4 = row.option4 ?? row['option 4'] ?? null;

    if (Array.isArray(row.options)) {
      option1 = row.options[0] ?? null;
      option2 = row.options[1] ?? null;
      option3 = row.options[2] ?? null;
      option4 = row.options[3] ?? null;
    }

    return {
      type,
      question: row.question,
      requirementType:
        row.questionrequirement ??
        row['requirement type'] ??
        row['requirementType'],
      measure:
        row.measure ??
        row['question measure'] ??
        row['question_measure'] ??
        null,
      option1,
      option2,
      option3,
      option4
    } ;
  });

  // ⛔ stop if any error happened
  if (hasError) return;

  this.manualQuestions = parsed.filter(q => q !== null);

  // ❌ empty result
  if (this.manualQuestions.length === 0) {
    this.toastService.showError(
      this.translate.instant('WIZARD.MESSAGES.NO_QUESTIONS_TO_ADD'),
      5000
    );
  }
}

  addManualQuestion() {
    if (this.questionForm.valid) {
      const questionData = {
        type: this.questionForm.get('type')?.value,
        question: this.questionForm.get('question')?.value,
        requirementType: this.questionForm.get('requirementType')?.value
      };
      // include options when present
     
      const opt1 = this.questionForm.get('option1')?.value || null;
      const opt2 = this.questionForm.get('option2')?.value || null;
      const opt3 = this.questionForm.get('option3')?.value || null;
      const opt4 = this.questionForm.get('option4')?.value || null;
      const fullQuestion = { ...questionData, option1: opt1, option2: opt2, option3: opt3, option4: opt4 };

      this.manualQuestions.push(fullQuestion);
  // measure from form
  const measureVal = this.questionForm.get('measure')?.value || null;
  this.manualQuestions[this.manualQuestions.length - 1].measure = measureVal;
      this.questionForm.reset();
  this.toastService.showSuccess(this.translate.instant('WIZARD.MESSAGES.QUESTION_ADDED'), 3000);
    } else {
      this.questionForm.markAllAsTouched();
    }
  }

  /**
   * Return a comma-separated options string for display in the table.
   */
  getOptionsText(question: any): string {
    if (!question) return '';
    const opts = [question.option1, question.option2, question.option3, question.option4];
  
    return opts.filter(o => o !== null && o !== undefined && o !== '').join(', ');
  }

  removeManualQuestion(index: number) {
    this.manualQuestions.splice(index, 1);
  this.toastService.showError(this.translate.instant('WIZARD.MESSAGES.QUESTION_REMOVED'),  2000 );
  }

  onFinish(): void {
    // Finalize lesson creation process
    // Here you would typically send all collected data to the backend to create the lesson fully
      
    if(this.manualQuestions.length > 0)
    {
      
   
          const jsonFile = this.createJsonFile(this.manualQuestions);

          const formData = new FormData();
          formData.append('file', jsonFile);
          // append extra fields as form fields
          formData.append('name', jsonFile.name);
          formData.append('description', 'description description');
          formData.append('knowledge_source_type', KnowledgeSourceType.File);
          formData.append('knowledge_type', KnowledgeType.SourcesOfQuestions);
          formData.append('learning_unit_id', this.newlearningUnit['id']);
          formData.append('time_stamp', new Date().toISOString());
          formData.append('lang', 'ar');
        

          this.KnowledgeSourceBusiness.addQuestionSource(formData).subscribe({
            next: (response: any) => {
              
              this.toastService.showSuccess(this.translate.instant('WIZARD.MESSAGES.QUESTIONS_ADDED_SUCCESS'), 5000);
              this.router.navigate(['/learningUnits/AlllearningUnits', this.courseId], { queryParams: { courseName: this.courseName } });
              
            },
            error: (err: any) => {
              this.toastService.showError(err, 5000);
            }
          });
  }          
  else
  this.router.navigate(['/learningUnits/AlllearningUnits', this.courseId], { queryParams: { courseName: this.courseName } });
  
}
  

  createJsonFile(data: any): File {
  // transform incoming question rows into the requested schema
  const toSchema = (q: any) => {
    const opts = [q.option1?.toString() ?? null, q.option2?.toString() ?? null, q.option3?.toString() ?? null, q.option4?.toString() ?? null].filter((o: any) => o !== null && o !== undefined && o !== '');

    return {
      // keep original type value (if you need mapping to machine types we can add it)
      type: q.type ?? null,
      // rename requirementType -> questionrequirement per requested schema
      questionrequirement: q.requirementType ?? q.questionrequirement ?? null,
      question_measure: q.measure ?? null,
      question: q.question ?? '',
      options: opts
    };
  };

  const questionsArray = Array.isArray(data) ? data : [data];
  const transformed = questionsArray.map((q: any) => toSchema(q));

  const payload = {
    learning_unit_id: this.newlearningUnit?.id ?? null,
    lang: 'ar',
    time_stamp: new Date().toISOString(),
    questions: transformed
  };

  const json = JSON.stringify(payload, null, 2);

  
  return new File([json], 'learningUnit.json', { type: 'application/json' });
}


}
