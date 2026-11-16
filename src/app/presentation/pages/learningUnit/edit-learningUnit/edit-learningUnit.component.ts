import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IKnowledgeSourceBusiness, KnowledgeSource_business_TOKEN } from 'src/app/domain/business-contracts/KnowledgeSource.business.contract';
import { ToastService } from 'src/app/shared/services/toast-service';
import { FileStatus, KnowledgeSourceType, KnowledgeType } from 'src/app/domain/enums/knowledge.enum';
import { QuestionTypeEnum } from 'src/app/domain/enums/question-type.enum';
import Swal from 'sweetalert2';
import { ILearningUnitBusiness, LEARNING_UNIT_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/learning-unit-business.contract';

interface ManualQuestion {
  type: string;
  question: string;
  requirementType: string;
  measure?: string | null;
  option1?: string | null;
  option2?: string | null;
  option3?: string | null;
  option4?: string | null;
}

interface DropzoneVM {
  id: number;
  lang: any;
  config: any;
  hasFile: boolean;
  statusText: string | null;
  fileName?: string | null;
}

@Component({
  selector: 'app-edit-learningUnit',
  templateUrl: './edit-learningUnit.component.html',
  styleUrls: ['./edit-learningUnit.component.scss'],
  standalone: false
})
export class EditlearningUnitComponent {
  public QuestionTypeEnum = QuestionTypeEnum;
  // per-dropzone language selection
  contentLang: string = '';
  questionLang: string = '';
  loading=false;
originalManualQuestions: ManualQuestion[] = [];
  // available languages for chooser
  languages = [
    { code: 'en', label: 'WIZARD.STEP2.LANG_EN' },
    { code: 'ar', label: 'WIZARD.STEP2.LANG_AR' }
  ];
  // Basic info (read-only fields)
  learningUnitName ='';
  subjectName ='';

  // Lesson content file (document or video)
  contentFile: File | null = null;
  contentPreview: string | null = null;

  // Question source upload
  questionSourceFile: File | null = null;
  // dropzone configs (optional)
  contentDropzoneConfig=this.KnowledgeSourceBusiness.CreateContentDropzoneConfigUseCase();
  dropzones: DropzoneVM[] = [];
  counter = 0;
  questionDropzoneConfig: any = null;

  // Manual question form model
  newQuestion: ManualQuestion = { type: '', question: '', requirementType: '' };
  isQuestionsFileChanged:boolean=false;
  // Stored manual questions
  manualQuestions: ManualQuestion[] = [];
  knowledgeSources: any[] = [];
  FileStatus = FileStatus;
  questionSource: any=null;
  get fileSources() {
    return (this.knowledgeSources || []).filter((s: any) => s?.knowledge_type === KnowledgeType.CourseContent);
  }
  learningUnitId: string | null;
  questionJson: any[]=[];
  questionFile!: File | null;
  learningUnit:any;
  // flag/message when question source file failed processing
  questionSourceFailed: boolean = false;
  questionSourceFailedMsg: string | null = null;

  constructor(private toastService: ToastService, 
       @Inject(LEARNING_UNIT_BUSINESS_TOKEN) private learningunitBusiness: ILearningUnitBusiness,
   @Inject(KnowledgeSource_business_TOKEN) private KnowledgeSourceBusiness: IKnowledgeSourceBusiness,
    private translate: TranslateService,

    private router: Router,
    private route: ActivatedRoute) {

    //get lessonId from url and fetch lesson details to populate fields
     this.learningUnitId = this.route.snapshot.paramMap.get('id');
     this.fetchlearningUnitDetails( this.learningUnitId );
     
    this.addDropzone();
    
     this.questionDropzoneConfig = this.KnowledgeSourceBusiness.CreateQuestionSourceDropzoneConfig((data) => {
        // store and apply parsed JSON to the manual questions form/list
      
/*         this.applyParsedQuestions(data);
 */      });
  }

  fetchlearningUnitDetails(learningUnitId :any) {

    this.loading=true;

    this.learningunitBusiness.getById(learningUnitId).subscribe((learningUnit:any) => {
      if (learningUnit) {
        this.loading=false;
        this.learningUnit=learningUnit; 
        this.learningUnitName = learningUnit.name || '';
        this.subjectName = learningUnit.course_name
        this.knowledgeSources = learningUnit.knowledge_sources || [];

        this.questionSource = (learningUnit.knowledge_sources || []).find(
          (s: any) => s?.knowledge_type === KnowledgeType.SourcesOfQuestions
        );

        // If the question source exists but its file processing failed, show an alert and skip loading content
        if (this.questionSource && this.questionSource.file_status === FileStatus.FAILED) {
          this.questionSourceFailed = true;
          this.questionSourceFailedMsg = this.translate.instant('LearningUnit.EDIT.MESSAGES.QUESTION_SOURCE_FAILED');
          // do not attempt to fetch content for a failed source
          //return;
        } else {
          this.questionSourceFailed = false;
          this.questionSourceFailedMsg = null;
        }
/*
        if (questionSource?.file_status === FileStatus.FAILED) {
          this.toastService.showError(this.translate.instant('LearningUnit.EDIT.MESSAGES.QUESTION_SOURCE_FAILED'), 4000);
          return;
        }
*/     

        this.KnowledgeSourceBusiness
          .getKnowledgeSourceContent(this.questionSource.url)
          .subscribe({
            next: (json: any[]) => this.applyParsedQuestions(json),
            error: (err:any) => {
              console.log(err);
              this.toastService.showError(this.translate.instant('LearningUnit.EDIT.MESSAGES.FAILED_TO_LOAD_QUESTIONS'), 4000);
            }
          });
      
        // Populate other fields as necessary
        } else {
        this.loading=false;

        this.toastService.showError(this.translate.instant('LearningUnit.EDIT.MESSAGES.learningUnit_NOT_FOUND'), 4000);
      }
    })
  }

  Delete(id: number) {
    
      Swal.fire({
        title: this.translate.instant('LearningUnit.EDIT.MESSAGES.DelTitle'),
        text: this.translate.instant('LearningUnit.EDIT.MESSAGES.DelNote'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: this.translate.instant('LearningUnit.EDIT.MESSAGES.YesDel'),
        cancelButtonText: this.translate.instant('LearningUnit.EDIT.MESSAGES.Cancel')
    
      }).then(result => {
        
        if (result.value) {

          this.loading=true;

          this.KnowledgeSourceBusiness.deleteKnowledgeSource(id).subscribe({
            next: () => {
              this.loading=false;

              this.knowledgeSources = (this.knowledgeSources || []).filter((s: any) => s?.id !== id);
              Swal.fire(this.translate.instant('LearningUnit.EDIT.MESSAGES.DELETE_SUCCESS'));
              //this.toastService.showSuccess(, 3000);
            },
            error: () => {
              this.loading=false;

              this.toastService.showError(this.translate.instant('LearningUnit.EDIT.MESSAGES.DELETE_FAILED'), 4000);
            }
          });
        
        }
      });
    
  
  }



  // Template download
  downloadTemplate() {
    const templateUrl = 'assets/templates/Question_Source_template.xlsx';
    fetch(templateUrl)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Question_Source_template.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        this.toastService.showSuccess(this.translate.instant('WIZARD.MESSAGES.TEMPLATE_DOWNLOADED'), 3000);
      })
      .catch(() => {
        this.toastService.showError(this.translate.instant('WIZARD.MESSAGES.TEMPLATE_DOWNLOAD_FAILED'), 4000);
      });
  }

  // Content file selection / drag & drop
  onContentSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!this.contentLang) {
      this.toastService.showError(this.translate.instant('LearningUnit.EDIT.MESSAGES.SELECT_FILE_LANGUAGE_FIRST'), 3000);
      return;
    }
    if (input.files && input.files.length) {
      this.setContentFile(input.files[0]);
    }
  }

  onContentAdded(file: any, dz?: DropzoneVM) {
    const f = (file && file._file) ? file._file : file;
    const lang = dz ? dz.lang : this.contentLang;
    if (!lang || lang === 'null') {
      this.toastService.showError(this.translate.instant('LearningUnit.EDIT.MESSAGES.SELECT_FILE_LANGUAGE_FIRST'), 3000);
      return;
    }
    this.contentFile = f;
    this.contentPreview = f.name || null;
    this.toastService.showSuccess(this.translate.instant('LearningUnit.EDIT.MESSAGES.CONTENT_FILE_SELECTED'), 2000);
    if (dz) {
      dz.hasFile = true;
      dz.fileName = f.name || null;
    }
  }

  onContentDropped(ev: DragEvent) {
    // only allow drop when language selected
    if (!this.contentLang) {
      this.toastService.showError(this.translate.instant('LearningUnit.EDIT.MESSAGES.SELECT_FILE_LANGUAGE_FIRST'), 3000);
      return;
    }
    ev.preventDefault();
    if (ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files.length) {
      this.setContentFile(ev.dataTransfer.files[0]);
    }
  }

  setContentFile(f: File) {
    this.contentFile = f;
    this.contentPreview = f.name;
    this.toastService.showSuccess(this.translate.instant('LearningUnit.EDIT.MESSAGES.CONTENT_FILE_SELECTED'), 2000);
  }

  allowDrop(ev: DragEvent) {
    // generic allowDrop: only preventDefault if the corresponding dropzone has a language selected
    // If this is called without zone info, allow drop (legacy)
    ev.preventDefault();
  }





 

  onContentZoneClick(inputEl: HTMLInputElement) {
    if (!this.contentLang) {
      this.toastService.showError(this.translate.instant('LearningUnit.EDIT.MESSAGES.SELECT_FILE_LANGUAGE_FIRST'), 3000);
      return;
    }
    inputEl.click();
  }



  onQuestionFileAdded(file: File) {
  const allowedExtensions = ['xlsx', 'xls'];
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!extension || !allowedExtensions.includes(extension)) {
    this.toastService.showError(
      this.translate.instant('LearningUnit.EDIT.MESSAGES.ONLY_EXCEL_ALLOWED')
    );
    return;
  }    this.isQuestionsFileChanged=true;
    this.questionFile = file;
    this.toastService.showSuccess(this.translate.instant('WIZARD.MESSAGES.QUESTION_FILE_SELECTED'), 3000);
  }

applyParsedQuestions(data: any) {

    
  if (!data) return;

  let rows: any[] = [];

  if (Array.isArray(data)) {
    rows = data;
  } else if (data && Array.isArray(data.questions)) {
    rows = data.questions;
    if (data.lang) {
      this.questionLang = data.lang;
    }
  } else if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) rows = parsed;
      else if (parsed && Array.isArray(parsed.questions)) {
        rows = parsed.questions;
        if (parsed.lang) this.questionLang = parsed.lang;
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

    // ✅ normalize type (optional but recommended)
    const type = row.type?.toLowerCase().replace(/[\s-]/g, '_');

    // ❌ invalid type → stop everything
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
      requirementType: row.questionrequirement ?? row['requirement type'] ?? row['requirementType'],
      measure: row['question_measure'] || null,
      option1,
      option2,
      option3,
      option4
    } as ManualQuestion;
  });

  // ⛔ stop if any error happened
  if (hasError) return;

  this.manualQuestions = parsed.filter(q => q !== null);

  //  deep copy original state
this.originalManualQuestions = JSON.parse(JSON.stringify(this.manualQuestions));

  if (this.manualQuestions.length === 0) {
    this.toastService.showError(
      this.translate.instant('WIZARD.MESSAGES.NO_QUESTIONS_TO_ADD'),
      5000
    );
  }
}
  onAddContentClick() {
    this.addDropzone();
  }

  addDropzone() {
    const lang = null; // default - require user to pick

    const cfg = this.KnowledgeSourceBusiness.CreateContentDropzoneConfigUseCase();
    cfg.addRemoveLinks = true;
    cfg.dictRemoveFile = '✖'; 
cfg.dictCancelUpload = '';
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

        // ensure language selected
        if (!dz.lang || dz.lang === 'null') {
          self.toastService.showError(self.translate.instant('LearningUnit.EDIT.MESSAGES.SELECT_FILE_LANGUAGE_FIRST'), 3000);
          try { this.removeFile(file); } catch {}
          return;
        }

        try {
          const isVideo = file.type?.startsWith('video/');
          file.meta = {
            name: file.name,
            description: 'description description',
            knowledge_source_type: isVideo ? KnowledgeSourceType.Video : KnowledgeSourceType.File,
            knowledge_type: KnowledgeType.CourseContent,
            learning_unit_id: self.learningUnitId,
            lang: dz.lang,
            time_stamp: new Date().toISOString()
          };
          dz.hasFile = true;
        } catch (e) {
          console.warn('addedfile meta error', e);
        }
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
        this.removeFile(file);
        try {
          const err = self.translate.instant('WIZARD.STEP2.upload.errorMessage');
          Swal.fire(err, '', 'error');
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
      el.showPicker(); // 👈 actually opens the dropdown
    }
  }
}

  // Manual questions
  addManualQuestion() {
    // simple validation
    if (!this.newQuestion.type || !this.newQuestion.question || !this.newQuestion.requirementType) {
      this.toastService.showError(this.translate.instant('LearningUnit.EDIT.MESSAGES.FILL_REQUIRED_FIELDS'), 3000);
      return;
    }

    // For multiple choice, options 1 and 2 are required
    if (this.newQuestion.type === QuestionTypeEnum.multiple_choice) {
      if (!this.newQuestion.option1?.trim() || !this.newQuestion.option2?.trim()) {
        this.toastService.showError(this.translate.instant('WIZARD.VALIDATION.OPTIONS_REQUIRED'), 3000);
        return;
      }
    }

    this.manualQuestions.push({ ...this.newQuestion });
    this.newQuestion = { type: '', question: '', requirementType: '' };
    this.toastService.showSuccess(this.translate.instant('WIZARD.MESSAGES.QUESTION_ADDED'), 2000);
  }

  removeManualQuestion(index: number) {
    this.manualQuestions.splice(index, 1);
    this.toastService.showError(this.translate.instant('WIZARD.MESSAGES.QUESTION_REMOVED'), 2000);
  }

  // Save changes (validate and show success)
  saveChanges() {
    // Validate basic info not empty (they are read-only but validate anyway)
    if (!this.learningUnitName ) {
      this.toastService.showError(this.translate.instant('LearningUnit.EDIT.MESSAGES.FILL_REQUIRED_FIELDS'), 3000);
      return;
    }

    // edit learningUnit and knowledge source
    var learningUnitReq={
      "id": this.learningUnitId,
      "name": this.learningUnitName.trim(),
      "subject_id": this.learningUnit.subject_id
    }

    this.loading=true;

    this.learningunitBusiness.update(learningUnitReq).subscribe({
      next: () => {
        this.loading=false;

      
        this.saveUpdatedQuestions();
//        this.router.navigate([`/learningUnits/AlllearningUnits/${this.learningUnit.course_id}/${this.subjectName}`])
        
      },
      error: (err) => {
        this.loading=false;

        this.toastService.showError(err, 5000);
      }
    });
    
  
  }

 saveUpdatedQuestions() {

  // 🧠 CASE 1: No source → ADD flow
  if (!this.questionSource) {
    this.handleAddFlow();
    return;
  }

  // 🧠 CASE 2: No changes → skip

  if (!this.isQuestionsChangedManually() && !this.isQuestionsFileChanged) {
    this.navigateToList();
    return;
  }

  // 🧠 CASE 3: Update existing
  this.handleUpdateFlow();
}


// ================= ADD FLOW =================
private handleAddFlow() {

  if (this.manualQuestions.length === 0) {
    this.navigateToList();
    return;
  }

  const formData = this.buildFormData();

  this.KnowledgeSourceBusiness.addQuestionSource(formData).subscribe({
    next: () => {
      this.toastService.showSuccess(
        this.translate.instant('WIZARD.MESSAGES.QUESTIONS_ADDED_SUCCESS'),
        5000
      );
      this.navigateToList();
    },
    error: (err:any) => this.toastService.showError(err, 5000)
  });
}


// ================= UPDATE FLOW =================
private handleUpdateFlow() {

  const formData = this.buildFormData();
  formData.append('old_file_id', this.questionSource.id);

  this.loading = true;

  this.KnowledgeSourceBusiness.updateQuestionSource(formData).subscribe({
    next: () => {
      this.loading = false;

      this.navigateToList();
    },
    error: (err:any) => {
      this.loading = false;
      this.toastService.showError(err, 5000);
    }
  });
}


// ================= FORM DATA =================
private buildFormData(): FormData {

  const jsonFile = this.createJsonFile(this.manualQuestions);

  const formData = new FormData();
  formData.append('file', jsonFile);
  formData.append('name', jsonFile.name);
  formData.append('description', 'description description');
  formData.append('knowledge_source_type', KnowledgeSourceType.File);
  formData.append('knowledge_type', KnowledgeType.SourcesOfQuestions);
  formData.append('learning_unit_id', this.learningUnitId!);
  formData.append('time_stamp', new Date().toISOString());
  formData.append('lang', 'ar');

  return formData;
}


// ================= NAVIGATION =================
private navigateToList() {
        this.toastService.showSuccess(this.translate.instant('LearningUnit.EDIT.MESSAGES.CHANGES_SAVED'), 3000);

       this.router.navigate(['/learningUnits/AlllearningUnits', this.learningUnit.course_id], { queryParams: { courseName: this.subjectName } });


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
    learning_unit_id: this.learningUnitId ?? null,
    lang: 'ar',
    time_stamp: new Date().toISOString(),
    questions: transformed
  };

  const json = JSON.stringify(payload, null, 2);

  
  return new File([json], 'learningUnit.json', { type: 'application/json' });
}

isQuestionsChangedManually(): boolean {
  return JSON.stringify(this.manualQuestions) !== JSON.stringify(this.originalManualQuestions);
}

}
    
