
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { CameraService } from 'src/app/shared/services/camera.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import LeaderLine from 'leader-line-new';
import { TranslateService } from '@ngx-translate/core';
import { ExamService, Question1 } from 'src/app/shared/services/exam.service';
import { QuestionTypeEnum, ResponseTypeEnum } from 'src/app/domain/enums/exam-enums';
import { RecoderComponent } from 'src/app/shared/components/recoder/recoder.component';
import { ViolationType } from 'src/app/domain/enums/violation-type.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast-service';
import { ApiConfig } from 'src/app/data/config/api.config';




@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: false

})
export class TrainingComponent {
 @ViewChild('questionInput') questionInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('Chat_box') private scrollContainer!: ElementRef;
  @Input() verified = false;
    
  private currentAudio: HTMLAudioElement | null = null;
  isDisabled = true;
  isTyping = false;
  //exam 
  exam:any;
  objectiveText:string='';
  isObjectiveArabic:boolean=false
  userAnswer:any = null;
  examData: any[] = [];
  Question!: Question1;
  exam_Ans: any[] = [];
  examResult: any[]=[];
  pendingCorrections = 0;
  QuestionType=QuestionTypeEnum;
  numOfQuestion:any;
  loading=true;
  sub: any;
  private answerSub?: Subscription;
  thread_id:any;
  objective_groupedJson: any;
  callexam_times: any=1;
  IsExamFinish: any=false;
  isExamGenerate=true;
  assistantId: any;
  examId: any;
  examResponses: any[]=[];
  disabledinput: boolean=true;
  pre_Ques: string='';
 
    /********Audio recording ************* */
    mediaRecorder!: MediaRecorder;
    audioUrl: string | null = null;
    isPlaying = false;
    audioFile: File | undefined;
    thereIsRecord=false;
    @ViewChild(RecoderComponent) recorder!: RecoderComponent;
  subjectId: any;
  leftItems:any[]=[];
  rightItems:any[]=[];  
  /******************** */
violations: { type: ViolationType; message: string; timestamp: Date }[] = [];
  isBlocked = false;
  showViolationPopup = false;
  maxViolations = 10;
  counterViolation = 0;
  isExamActive = true;
  cameraOn = true;
  private cameraCheckHandle: any = null;
  private violationSubscription: any;
  private violationHandled = false;

/*    @HostListener('document:fullscreenchange')
    onFullScreenChange = () => {
      if (!this.isExamActive) return;
      if (!document.fullscreenElement) {

        this.addViolation('fullscreen_exit', ViolationType.Visibility);
        
        this.showViolationPopup = true;
        
      }
    }; */


  //Drag and Drop Question
    items :any[]=[];

    // Groups (empty at first)
    groupA: string[] = [];
    groupB: string[] = [];
  dragResults: any;
 
  constructor(private sanitizer: DomSanitizer,
    private http:HttpClient,
    private examService:ExamService,
     private route: ActivatedRoute,
     private router :Router,
    private translate: TranslateService,
    private CameraService: CameraService,private readonly apiConfig: ApiConfig,
  private toast:ToastService)
  {

    // listen if user record (avoid duplicate emissions triggering twice)
    this.answerSub = this.examService.answer$
      .pipe(
        distinctUntilChanged((a, b) => a?.[0] === b?.[0] && a?.[1] === b?.[1])
      )
      .subscribe(([answerTxt, isthereError]) => {
        this.createAudioResponseUI(answerTxt, isthereError);
      });


      
   
    
  }

 ngOnInit(): void {
  document.body.removeAttribute('data-sidebar-size');

    window.addEventListener('popstate', this.onBackButton.bind(this));

      this.route.params.subscribe(params => {
        this.subjectId = params['subjectId']; // "+" converts to number
        this.examId = params['id']; // "+" converts to number
       
      });
    const finished = localStorage.getItem('examFinished');

  if (finished === 'true') {
    // Force reload a clean exam
    localStorage.removeItem('examFinished');
    window.location.reload();
  }
  
}
  
  ngOnDestroy(): void {
    this.answerSub?.unsubscribe();
  }
      
  
    ngAfterViewInit()
    {
        //get exam and first Question
        

/*             this.violationSubscription = this.CameraService.violation$.subscribe((data) => {
              this.showViolationPopup = true;
              this.addViolation(data.err, ViolationType.verifyIdentity);
            });
        
           
            this.checkCameraStatus();
            this.cameraCheckHandle = setInterval(() => this.checkCameraStatus(), 30 * 1000); */
          
            
        //get AssistantId
/*         this.getAssistantId();
 */  
        this.loading=true;
        

  
        this.examService.getExam(this.examId).subscribe((data)=>{
          this.objectiveText=data.questions?.[0]?.objective ?? '';
            // One direction for the whole exam
   this.isObjectiveArabic = this.isArabicText(this.objectiveText);

          this.loading=false;
          this.examData =data.questions;
            this.assistantId=data.collection_id;
          this.examId=data.exam_id;
          this.examResponses=data.response_types;

          this.numOfQuestion=this.examData.length;
          document.getElementById("chatheader")!.innerHTML=data.exam_name;
        

          
          this.getReponseType();

        //get first Question
          this.Question=this.examService.getCurrentQuestion(0);
       
    
          if(this.Question)
            this.addQuestionToDom(this.Question);
      

    
        },(err)=>{
          console.log(err);
        });
  
  
  
       
    
    }


  
  scrollToBottom()
  {
    const el= this.scrollContainer.nativeElement;
    if(this.scrollContainer)
      
    el.scrollTo({
      top: el.scrollTop + 200, // scroll 100px down from current position
      behavior: 'smooth'
    });
  
  }

  getReponseType()
  {

    
    const hasWritingQuestion = this.examData.some(q => [QuestionTypeEnum.essay, QuestionTypeEnum.fill_blank,
      QuestionTypeEnum.short_answer].includes(q.type));


      if(this.examResponses.includes(ResponseTypeEnum.WRITING_ANSWER))
      {

      this.disabledinput=false;


      }
      else{

      if(hasWritingQuestion && !this.examResponses.includes(ResponseTypeEnum.VOICE_ANSWER))
      {
      this.disabledinput=false;

      }

}
  }

  displayAnswer(): void {

    
    if(this.thereIsRecord)
      {
        if(this.audioUrl)
        {
          this.thereIsRecord=false;
          this.isTyping=true;
          
          //disabled send button if there 
          this.disableMultipleChoiceQuestion(true)
   
          this.examService.displayAudioInExam(this.audioUrl,this.audioFile);
          this.recorder.deleteRecording();
         
        }
        else{
            this.recorder.stopRecording();
        }
      
      }
      else
      {
    //Answers to essay questions
    const inputElement1 = document.getElementById("question-input") as HTMLInputElement;
    const text = inputElement1?.value || '';
  
    if(text.trim() != "" && this.isTyping == false )
    {

    const userTimestamp = new Date().toISOString();

    //store answers
    const inputElement = document.getElementById("question-input") as HTMLInputElement;
  
    this.userAnswer=inputElement?.value ;
    
    //send answer to api and display it.
    this.examService.displayMessage(this.userAnswer,"user",userTimestamp);

      this.disableMultipleChoiceQuestion(true);

          //if there is audio response disable it 
         // const sendBtn_audio = document.querySelector<HTMLButtonElement>('.send-button');
            const sendBtn_audio = document.querySelectorAll<HTMLButtonElement>('.send-button');
           const lastBtn = sendBtn_audio[sendBtn_audio.length - 1];
        
          if(lastBtn)
              lastBtn.disabled = true;

    

    this.scrollToBottom();

    this.saveAnswer(this.Question);

    inputElement.value = '';
        }
    }   
  }
  
 

  
  TypingQuestionChange(): void {
    
    if(!this.IsExamFinish)
    {
    const inputElement = document.getElementById("question-input") as HTMLInputElement;
    const text = inputElement?.value || '';
  
    if(text.trim() === "" || this.isTyping == true ) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }

    inputElement.scrollTop = inputElement.scrollHeight;
    }
  }

 
 




  //start exam code
    chooseAns(answer:any,questionId:any)
    {
      
      this.userAnswer=answer;
      
      if(this.Question.id == questionId)
        {
          let submitButton = document.getElementById("btn"+questionId)as HTMLButtonElement;    
          if (submitButton) {
            if (Array.isArray(answer) && answer.length === 0) {
              submitButton.disabled = true;
            } else {
              submitButton.disabled = false;
            }
          }
        }
    }
  
    submitAns(button: HTMLButtonElement)
    {
     
      
      if(this.userAnswer != null)
      {
        
      const container = document.getElementById('chat-content');
      if (!container) return;


      button.disabled = true;


      const userTimestamp = new Date().toISOString();


     if(this.Question.question_type == this.QuestionType.Sequence
      || this.Question.question_type == this.QuestionType.Matching
      || this.Question.question_type == this.QuestionType.DragAndDrop
    )
      {
  //      const selectedTexts = this.userAnswer.map((key:any) => this.Question.options[key]);

        if(this.Question.question_type == this.QuestionType.Matching)
        {
        
          this.userAnswer = this.formatUserAnswer(); 
          // Remove each LeaderLine
            this.lines.forEach(match => match.line.remove());
          
            // Clear the array
            this.lines = [];
          
          
        }
        else if(this.Question.question_type == this.QuestionType.DragAndDrop)
        {
            // Format each key-value pair like `key: [val1, val2]`
            const formattedAnswer = Object.keys(this.userAnswer)
              .map(key => `<div><strong>${key}</strong>: ${this.userAnswer[key].join(', ')}</div>`)
              .join('\n'); // use '\n' for line breaks
              this.userAnswer=formattedAnswer;
        }
        const selectedTexts = this.userAnswer;
     //   this.userAnswer = selectedTexts.join(', ');  // Or use '\n' if you want line breaks

      //send answer to api and display it.
      this.examService.displayMessage(selectedTexts,"user",userTimestamp);

    
      }
      else{

      //send answer to api and display it.
      this.examService.displayMessage(this.userAnswer,"user",userTimestamp);

    
      }


      
            this.saveAnswer(this.Question);

      container.scrollTop = container.scrollHeight;
    

      
    }

    }


    nextQuestion()
    {
            if(this.IsExamFinish)return;

       //next ques
       const NextQuestion=this.examService.goToNextQuestion();


       if(NextQuestion != null)
         {
           this.Question=NextQuestion;
           this.addQuestionToDom(this.Question);
 
         }
         else{
           this.finishExam();
         }
 
    }

    async saveAnswer(Question:any) {
      const userAnswer = this.cleanText(this.userAnswer, Question.question_type);

      let answer = {
        "answer":userAnswer,
        "collection_id": this.assistantId,
        "question_details": {
  
          "question": Question.text,
          "question_type": this.examService.convertToQuestionTypeString(Question.question_type),
          "cognitive_style": this.examService.convertToCognitiveStyleString(Question.cognitive_style),
          "correct_answer": Question.correct_answer,
          "difficulty": this.examService.convertToComplexityLevelsString(Question.difficulty),
          "file_name": Question.learning_unit_file??null,
          "objective_name": Question.objective,
                  options: Question.options.map((option:any) => ({
         option: option.text,
         is_correct: option.is_correct
}))
        }
      };

      //save answers in array
      
      this.exam_Ans.push(answer);

      //correct answer and get feedback
      this.isTyping = true;
      const Timestamp = new Date().toISOString();


      let submitButton = document.getElementById("btn"+Question.id)as HTMLButtonElement;    
      if(submitButton)
        submitButton.disabled=true;


      if(Question.question_type == this.QuestionType.Sequence
        || Question.question_type == this.QuestionType.Matching
        || Question.question_type == this.QuestionType.DragAndDrop
      )
      {
        const wrongResult = {
          id:Question.id,
          answerText:userAnswer,
          correctAnswer: "study you will find the correct answer",
          feedback: "any feedback here",
          improvement: null,
          isAnswerCorrect: false,
          timestamp: null,
          videoRef: null
        };
        this.examResult.push(wrongResult);
        //bot review
       
        this.userAnswer = null;
        this.addAnswerReviewToDOM(wrongResult);
        this.isTyping = false;
        
      }
      else
      {
        this.pendingCorrections++;
      this.examService.correctExam(answer).subscribe({
        next: (data: any) => {
          data.id=Question.id;
          data.answerText = userAnswer
          this.examResult.push(data);
          //bot review
         
          this.userAnswer = null;
          this.addAnswerReviewToDOM(data);
           
        },
        error: (err:any) => {
          this.isTyping = false;
          this.examService.displayMessage(this.t('training.answer_save_error'),"bot",Timestamp);
          this.scrollToBottom();

          //enable answer again   
          const sendBtn = document.getElementById(`btn${Question.id}`) as HTMLButtonElement;
          sendBtn.disabled = false;

          const radios = document.getElementsByName(Question.id) as NodeListOf<HTMLInputElement>;
          radios.forEach(radio => radio.disabled = false);
          
          console.error('Error correcting exam', err);
        },
        complete: () => {
          this.isTyping = false;

  this.pendingCorrections--;
    if (this.IsExamFinish && this.pendingCorrections === 0) {
      this.finishExam();
    }
        
        }
    })
    }
  }


    getSafeUrl(url: string): SafeResourceUrl {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    addQuestionToDom(question: Question1) {

      
      const container = document.getElementById('chat-content');
      if (!container) return;
    
      const msgDiv = document.createElement('div');
      msgDiv.className = 'msgs msgQuesContianer';
    
      const index = this.findQuestionIndex(question.id);
      const time = this.formatTime(new Date());
      /* const isArabic = this.isArabicText(question.text); */
      const isArabic = this.isObjectiveArabic;
    
      let introHtml = this.getIntroHtml(index, question);
      let controlsHtml = this.getControlsHtml(question, isArabic);
    
      msgDiv.innerHTML = this.buildQuestionHtml(question, index, time, isArabic, introHtml, controlsHtml);
       this.applyLanguageDirection(msgDiv, isArabic);
      container.appendChild(msgDiv);
    
      this.appendQuestionTypeLabel(msgDiv, question);
      this.addTypeSpecificListeners(msgDiv, question, isArabic);
      this.addSpeakerListener(msgDiv, question);
    
      if (index !== 0) this.scrollToBottom();
    }
    
    
    
  /* ---------- Utility ---------- */
  findQuestionIndex(id: number): number {
    return this.examData.findIndex(q => q.id === id);
  }
  
  formatTime(date: Date): string {
    let time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return time.replace('AM', this.t('exam.am')).replace('PM', this.t('exam.pm'));
  }

  private t(key: string, params?: object): string {
    return this.translate.instant(key, params);
  }

  private getQuestionsWord(count: number): string {
    return count < 11 ? this.t('training.questions_plural') : this.t('training.question_singular');
  }

  isArabicText(text: string): boolean {
    return /[\u0600-\u06FF]/.test(text);
  }
  
  /* ---------- HTML Builders ---------- */
  getIntroHtml(index: number, question: Question1): string {
    if (index === 0) {
      const intro = this.t('training.start_intro', {
        count: this.numOfQuestion,
        questionsWord: this.getQuestionsWord(this.numOfQuestion)
      });
      return `<div class="start_exam_txt text-dark blackcolor">${intro}</div>`;
    }
    return ``;
  }
  
  getControlsHtml(question: Question1, isArabic: boolean): string {

    switch (question.question_type) {
      case this.QuestionType.multiple_choice:
      case this.QuestionType.Numeric:
      case this.QuestionType.Computational:
        return this.renderMultipleChoice(question);
      case this.QuestionType.multiple_response:
        return this.renderMultipleResponse(question);
      case this.QuestionType.true_false:
        return this.renderTrueFalse(isArabic,question);
      case this.QuestionType.Sequence:
        return this.renderSequence(question);
      case this.QuestionType.DragAndDrop:
        return this.renderGroups(question);
      case this.QuestionType.Matching:
        return this.renderMatching(question);

      default:
        return '';
    }
    
  }
  
  renderGroups(question: Question1): string {


    return `
      <div class="draggableContainer row" data-question-id="${question.id}">
        
        <!-- Groups -->
        <div class="groups col-8">
          <div cdkDropList
               id="groupA-${question.id}"
               class="group"
               [cdkDropListData]="[]"
               [cdkDropListConnectedTo]="['source-${question.id}','groupB-${question.id}']"
               (cdkDropListDropped)="dropItemsIngGroup($event)">
            <h3><span>${question.terms[0]}</span></h3>
          </div>
  
          <div cdkDropList
               id="groupB-${question.id}"
               class="group"
               [cdkDropListData]="[]"
               [cdkDropListConnectedTo]="['source-${question.id}','groupA-${question.id}']"
               (cdkDropListDropped)="dropItemsIngGroup($event)">
            <h3><span>${question.terms[1]}</span></h3>
          </div>
        </div>
  
        <!-- Source -->
        <div cdkDropList
             id="source-${question.id}"
             class="source col"
             [cdkDropListData]="${JSON.stringify(question.answers)}"
             [cdkDropListConnectedTo]="['groupA-${question.id}','groupB-${question.id}']"
             (cdkDropListDropped)="dropItemsIngGroup($event)">
             
          ${question.matches.map((ans:any) => `
            <div class="item" cdkDrag>
              <img src="assets/images/move.svg" width="19" height="19" />
              ${ans}
            </div>
          `).join('')}
        </div>
      </div>
    
    `;
  }

  
  renderMultipleChoice(question: Question1): string {
    return question.answers.map((answer, ind) => `
      <input type="radio" class="btn-check" name="${question.id}" id="ques${question.id}_${ind}" value="${ind}">
      <label class="btn btnRadio" for="ques${question.id}_${ind}">${this.examService.escapeHtml(answer)}</label>
        `).join('');
  }
  
  renderTrueFalse(isArabic: boolean,question: Question1): string {
    const answers = isArabic
      ? [this.t('exam.true_ar'), this.t('exam.false_ar')]
      : [this.t('exam.true_en'), this.t('exam.false_en')];
    return answers.map((answer, ind) => `
      <input type="radio" class="btn-check" name="${question.id}" id="ques${question.id}_${ind}" value="${ind}">
      <label class="btn btnRadio" for="ques${question.id}_${ind}">${answer}</label>
    `).join('');
  }
  
  renderMultipleResponse(question: Question1): string {
    return question.answers.map((answer, ind) => `
      <input type="checkbox" class="btn-check" name="${question.id}" id="ques${question.id}_${ind}" value="${ind}">
      <label class="btn btnRadio" for="ques${question.id}_${ind}">${this.examService.escapeHtml(answer)}</label>
    `).join('');
  }
  renderSequence(question: Question1): string {
    const submitLabel = this.t('exam.submit');
    return `
      <div class="example-list"  data-question-id="${question.id}">
        ${question.answers.map((answer, ind) => `
          <div class="example-box basedOnLang text-dark" data-index="${ind}">
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.75 1.75C0.75 0.921573 1.42157 0.25 2.25 0.25C3.07843 0.25 3.75 0.921573 3.75 1.75C3.75 2.57843 3.07843 3.25 2.25 3.25C1.42157 3.25 0.75 2.57843 0.75 1.75ZM8.25 1.75C8.25 0.921573 8.92157 0.25 9.75 0.25C10.5784 0.25 11.25 0.921573 11.25 1.75C11.25 2.57843 10.5784 3.25 9.75 3.25C8.92157 3.25 8.25 2.57843 8.25 1.75ZM0.75 7.25C0.75 6.42157 1.42157 5.75 2.25 5.75C3.07843 5.75 3.75 6.42157 3.75 7.25C3.75 8.07843 3.07843 8.75 2.25 8.75C1.42157 8.75 0.75 8.07843 0.75 7.25ZM8.25 7.25C8.25 6.42157 8.92157 5.75 9.75 5.75C10.5784 5.75 11.25 6.42157 11.25 7.25C11.25 8.07843 10.5784 8.75 9.75 8.75C8.92157 8.75 8.25 8.07843 8.25 7.25ZM0.75 12.75C0.75 11.9216 1.42157 11.25 2.25 11.25C3.07843 11.25 3.75 11.9216 3.75 12.75C3.75 13.5784 3.07843 14.25 2.25 14.25C1.42157 14.25 0.75 13.5784 0.75 12.75ZM8.25 12.75C8.25 11.9216 8.92157 11.25 9.75 11.25C10.5784 11.25 11.25 11.9216 11.25 12.75C11.25 13.5784 10.5784 14.25 9.75 14.25C8.92157 14.25 8.25 13.5784 8.25 12.75ZM0.75 18.25C0.75 17.4216 1.42157 16.75 2.25 16.75C3.07843 16.75 3.75 17.4216 3.75 18.25C3.75 19.0784 3.07843 19.75 2.25 19.75C1.42157 19.75 0.75 19.0784 0.75 18.25ZM8.25 18.25C8.25 17.4216 8.92157 16.75 9.75 16.75C10.5784 16.75 11.25 17.4216 11.25 18.25C11.25 19.0784 10.5784 19.75 9.75 19.75C8.92157 19.75 8.25 19.0784 8.25 18.25Z" fill="#595959"/>
            </svg>
               ${answer}
          </div>
        `).join('')}
      </div>
      <button class="btn sendQuesBtn btn-primary" id="btn${question.id}" type="button">${submitLabel}</button>
    `;
  }
  

  renderMatching(question: Question1): string {
    this.leftItems = question.terms;
    this.rightItems = question.matches;
  
    const leftHtml = this.leftItems.map((item, i) => `
      <div class="match-item left" id="left-${question.id}-${i}">
       <span class="match-indicator" id="left-ind-${question.id}-${i}">●</span>
        ${item}
      </div>
              `).join('');  

    const rightHtml = this.rightItems.map((item, j) => `
      <div class="match-item right" id="right-${question.id}-${j}">
       <span class="match-indicator" id="right-ind-${question.id}-${j}">●</span>
        ${item}
      </div>
        `).join('');
  
    const submitLabel = this.t('exam.submit');
    const columnA = this.t('exam.matching_column_a');
    const columnB = this.t('exam.matching_column_b');
    return `
      <div class="matching-container" id="matching-${question.id}">
        <div class="columns">
          <div class="column left">
            <div class="MatchingTitle">${columnA}</div>
            ${leftHtml}
          </div>
  
          <div class="column right">
            <div class="MatchingTitle">${columnB}</div>
            ${rightHtml}
          </div>
        </div>
      </div>
      <button class="btn sendQuesBtn btn-primary" id="btn${question.id}" type="button">${submitLabel}</button>
    `;
  }
  

  
  buildQuestionHtml(
    question: Question1,
    index: number,
    time: string,
    isArabic: boolean,
    introHtml: string,
    controlsHtml: string
  ): string {
/*  const questionIsArabic = this.isArabicText(question.text); */
/* const questionLanguageClass = questionIsArabic*/
const questionLanguageClass =
  this.isObjectiveArabic ? 'rtl-text' : 'ltr-text';


      const label = isArabic ? this.t('exam.label_ar') : this.t('exam.label_en');
    const submitLabel = this.t('exam.submit');
    const sendButtonHtml = (question.question_type !== this.QuestionType.essay &&
                            question.question_type !== this.QuestionType.fill_blank &&
                            question.question_type !== this.QuestionType.short_answer &&
                            question.question_type !== this.QuestionType.Sequence &&
                            question.question_type !== this.QuestionType.Comparative &&
                            question.question_type !== this.QuestionType.CaseStudy  &&
                            question.question_type !== this.QuestionType.Matching
                              )
      ? `<button class="btn sendQuesBtn btn-primary" disabled id="btn${question.id}" type="button">${submitLabel}</button>`
      : '';
  
    return `
      <div class="message bot-message">
        ${introHtml}
        <div class="exam_question" id="Quesbuild${question.id}">
          <div  class="basedOnLang text-dark ${questionLanguageClass}" id="questionDiv${question.id}">
            ${label}${index + 1}: ${this.examService.escapeHtml(question.text)}
             </div> 
          </div>
        <div class="choices">${controlsHtml}</div>
        ${sendButtonHtml}
        <div class="row">
          
          <div class="col pl-1 speaker text-start">
              <button style="border:none; background:none; color:inherit;" id="speaker">
                <svg width="26" height="27" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_1104_2311)">
                      <path d="M13.3344 8.5C13.3344 6.28125 11.9781 4.38125 10.0531 3.57812L9.54062 4.80937C10.9844 5.4125 12 6.8375 12 8.5C12 10.1656 10.9844 11.5875 9.5375 12.1906L10.05 13.4219C11.9781 12.6187 13.3344 10.7188 13.3344 8.5ZM10.6656 8.5C10.6656 7.39062 9.9875 6.44063 9.025 6.04063L8.5125 7.27187C8.99375 7.47187 9.33125 7.94688 9.33125 8.50313C9.33125 9.05625 8.99375 9.53125 8.5125 9.73438L9.025 10.9656C9.9875 10.5594 10.6656 9.60938 10.6656 8.5ZM11.0781 1.11563L10.5625 2.34687C12.9719 3.35 14.6656 5.725 14.6656 8.5C14.6656 11.2719 12.9719 13.65 10.5625 14.6531L11.075 15.8844C13.9688 14.6781 16 11.8281 16 8.5C16 5.17188 13.9688 2.32187 11.0781 1.11563ZM0 5.16563V11.8313H2.66563L7.33437 16.5V0.5L2.66563 5.16563H0Z" fill="currentColor"/>
                      </g>
                      <defs>
                      <clipPath id="clip0_1104_2311">
                      <rect width="16" height="16" fill="white" transform="translate(0 0.5)"/>
                      </clipPath>
                      </defs>
                      </svg>
              </button>
            </div>
          </div>
          <div class="timestamp">${time}</div>
        </div>
        <img src="../assets/images/Frame1.png">
      `;
  }
  
  /* ---------- Listeners ---------- */
  appendQuestionTypeLabel(msgDiv: HTMLElement, question: Question1) {
     const questionDiv = document.getElementById(`questionDiv${question.id}`);
    const span = document.createElement('span');

    if (questionDiv)
      span.textContent = ` ${this.alignQuestionbasedonLang(question, questionDiv)}`;
    span.style.display = 'contents';
    questionDiv?.appendChild(span);
  }
  
  addTypeSpecificListeners(msgDiv: HTMLElement, question: Question1, isArabic: boolean) {
    if (question.question_type === this.QuestionType.multiple_choice ||
       question.question_type === this.QuestionType.true_false ||
       question.question_type === this.QuestionType.Computational ||
       question.question_type === this.QuestionType.Numeric ) {
      this.addRadioListeners(msgDiv, question.id);
    }
    if (question.question_type === this.QuestionType.multiple_response) {
      this.addCheckboxListeners(msgDiv, question.id);
    }
     if (question.question_type === this.QuestionType.Sequence) {
      this.addSequenceListeners(msgDiv, question);
    }

    if (question.question_type === this.QuestionType.DragAndDrop) {
      this.addGroupListeners(msgDiv, question);
    }

    if (question.question_type === this.QuestionType.Matching) {
      this.addMatchingListeners(msgDiv, question);
    }
    
  }
  
  addRadioListeners(msgDiv: HTMLElement, questionId: number) {
    const radios = msgDiv.querySelectorAll(`input[name="${questionId}"]`);
    radios.forEach(input => {
      input.removeAttribute('disabled');
      input.addEventListener('click', () => {
        const label = msgDiv.querySelector(`label[for="${(input as HTMLInputElement).id}"]`);
        this.chooseAns(label?.textContent?.trim() || '', questionId);
      });
    });
  
    // Send button for radios
      const sendBtn = msgDiv.querySelector('.sendQuesBtn') as HTMLButtonElement;
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        sendBtn.disabled = true;
        radios.forEach(input => (input as HTMLInputElement).disabled = true);
        this.submitAns(sendBtn);
      });
    }
  }
  
  addCheckboxListeners(msgDiv: HTMLElement, questionId: number) {
    const checkboxes = msgDiv.querySelectorAll(`input[type="checkbox"]`);
    checkboxes.forEach(input => {
      input.addEventListener('change', () => {
        const checkedValues: string[] = [];
        checkboxes.forEach(box => {
          if ((box as HTMLInputElement).checked) {
            const label = msgDiv.querySelector(`label[for="${(box as HTMLInputElement).id}"]`);
            checkedValues.push(label?.textContent?.trim() || '');
          }
        });
        this.chooseAns(checkedValues, questionId);
      });
    });
  
    // Send button for checkboxes
    const sendBtn = msgDiv.querySelector('.sendQuesBtn') as HTMLButtonElement;
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        sendBtn.disabled = true;
        checkboxes.forEach(input => (input as HTMLInputElement).disabled = true);
        this.submitAns(sendBtn);  
      });
    }
  }
 
  /***************** */
  
  addSequenceListeners(msgDiv: HTMLElement, question: Question1) {
    const dropList = msgDiv.querySelector('.example-list') as HTMLElement;
    const answerBoxes = msgDiv.querySelectorAll('.example-box');
    
    if (dropList && answerBoxes.length > 0) {
      // Make items draggable
      answerBoxes.forEach((box, index) => {
        const dragBox = box as HTMLElement;
        dragBox.draggable = true;
        dragBox.dataset['index'] = index.toString();
        
        dragBox.addEventListener('dragstart', (e) => {
          e.dataTransfer?.setData('text/plain', index.toString());
          dragBox.style.opacity = '0.5';
        });
        
        dragBox.addEventListener('dragend', () => {
          dragBox.style.opacity = '1';
        });
      });

      // Handle drop zone
      dropList.addEventListener('dragover', (e) => {
        e.preventDefault();
      });
      
      dropList.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggedIndex = parseInt(e.dataTransfer?.getData('text/plain') || '0');
        const targetBox = (e.target as HTMLElement).closest('.example-box');
        
        if (targetBox && targetBox !== answerBoxes[draggedIndex]) {
          const targetIndex = parseInt((targetBox as HTMLElement).dataset['index'] || '0');
          this.reorderAnswers(question.answers, draggedIndex, targetIndex);
          this.updateSequenceDisplay(msgDiv, question.answers);
          
          // Enable send button
          const sendBtn = msgDiv.querySelector('.sendQuesBtn') as HTMLButtonElement;
          if (sendBtn) {
            sendBtn.disabled = false;
          }
        }
      });
    }
    
    // Handle send button
    const sendBtn = msgDiv.querySelector('.sendQuesBtn') as HTMLButtonElement;
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        const answerElements = msgDiv.querySelectorAll('.example-box');
        const orderedAnswers = Array.from(answerElements).map(el => el.textContent?.trim() || '');
        
        this.chooseAns(orderedAnswers, question.id);
        this.submitAns(sendBtn);
      });
    }
  }
  
  private reorderAnswers(answers: string[], fromIndex: number, toIndex: number) {
    const [removed] = answers.splice(fromIndex, 1);
    answers.splice(toIndex, 0, removed);
  }
  
  private updateSequenceDisplay(msgDiv: HTMLElement, answers: string[]) {
    const answerBoxes = msgDiv.querySelectorAll('.example-box');
    answerBoxes.forEach((box, index) => {
      // Preserve the SVG and answer text when updating the display
      box.innerHTML = `<svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.75 1.75C0.75 0.921573 1.42157 0.25 2.25 0.25C3.07843 0.25 3.75 0.921573 3.75 1.75C3.75 2.57843 3.07843 3.25 2.25 3.25C1.42157 3.25 0.75 2.57843 0.75 1.75ZM8.25 1.75C8.25 0.921573 8.92157 0.25 9.75 0.25C10.5784 0.25 11.25 0.921573 11.25 1.75C11.25 2.57843 10.5784 3.25 9.75 3.25C8.92157 3.25 8.25 2.57843 8.25 1.75ZM0.75 7.25C0.75 6.42157 1.42157 5.75 2.25 5.75C3.07843 5.75 3.75 6.42157 3.75 7.25C3.75 8.07843 3.07843 8.75 2.25 8.75C1.42157 8.75 0.75 8.07843 0.75 7.25ZM8.25 7.25C8.25 6.42157 8.92157 5.75 9.75 5.75C10.5784 5.75 11.25 6.42157 11.25 7.25C11.25 8.07843 10.5784 8.75 9.75 8.75C8.92157 8.75 8.25 8.07843 8.25 7.25ZM0.75 12.75C0.75 11.9216 1.42157 11.25 2.25 11.25C3.07843 11.25 3.75 11.9216 3.75 12.75C3.75 13.5784 3.07843 14.25 2.25 14.25C1.42157 14.25 0.75 13.5784 0.75 12.75ZM8.25 12.75C8.25 11.9216 8.92157 11.25 9.75 11.25C10.5784 11.25 11.25 11.9216 11.25 12.75C11.25 13.5784 10.5784 14.25 9.75 14.25C8.92157 14.25 8.25 13.5784 8.25 12.75ZM0.75 18.25C0.75 17.4216 1.42157 16.75 2.25 16.75C3.07843 16.75 3.75 17.4216 3.75 18.25C3.75 19.0784 3.07843 19.75 2.25 19.75C1.42157 19.75 0.75 19.0784 0.75 18.25ZM8.25 18.25C8.25 17.4216 8.92157 16.75 9.75 16.75C10.5784 16.75 11.25 17.4216 11.25 18.25C11.25 19.0784 10.5784 19.75 9.75 19.75C8.92157 19.75 8.25 19.0784 8.25 18.25Z" fill="#595959"/>
      </svg>
      ${answers[index]}`;
      (box as HTMLElement).dataset['index'] = index.toString();
    });
  }


  /****** drag and drop Question *********** */
  addGroupListeners(msgDiv: HTMLElement, question: Question1) {
    const sourceList = msgDiv.querySelector(`#source-${question.id}`) as HTMLElement;
    const groupAList = msgDiv.querySelector(`#groupA-${question.id}`) as HTMLElement;
    const groupBList = msgDiv.querySelector(`#groupB-${question.id}`) as HTMLElement;
  
    const lists = [sourceList, groupAList, groupBList];
  
    // Helper: Make an item draggable
    const makeDraggable = (item: HTMLElement, parentId: string) => {
      item.draggable = true;
  
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer?.setData('text/plain', JSON.stringify({
          text: item.innerText.trim(),
          fromId: parentId
        }));
        item.style.opacity = '0.5';
      });
  
      item.addEventListener('dragend', () => {
        item.style.opacity = '1';
      });
    };
  

    const sendBtn = msgDiv.querySelector('.sendQuesBtn') as HTMLButtonElement;
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        this.submitAns(sendBtn);
      });
    }

    // Bind existing items
    lists.forEach(list => {
      list.querySelectorAll('.item').forEach((item) => {
        makeDraggable(item as HTMLElement, list.id);
      });
    });
  
    // Handle dropping into lists
    lists.forEach(list => {
      list.addEventListener('dragover', (e) => e.preventDefault());
  
      list.addEventListener('drop', (e) => {
        e.preventDefault();
  
        const data = e.dataTransfer?.getData('text/plain');
        if (!data) return;
  
        const { text, fromId } = JSON.parse(data);
  
        // Remove item from old list
        const fromList = msgDiv.querySelector(`#${fromId}`) as HTMLElement;
        const itemEl = Array.from(fromList.querySelectorAll('.item'))
          .find(el => el.textContent?.trim() === text);
  
        if (itemEl) {
          fromList.removeChild(itemEl);
        }
  
        // Create and add new item
        const newItem = document.createElement('div');
        newItem.classList.add('item');
        newItem.draggable = true;
  
        const icon = document.createElement('img');
        icon.src = 'assets/images/move.svg';
        icon.width = 19;
        icon.height = 19;
        newItem.appendChild(icon);
        newItem.append(text);
  
        list.appendChild(newItem);
  
        // Make new item draggable
        makeDraggable(newItem, list.id);
  
        // ✅ Update result after drop
        this.updateDragResult(msgDiv, question);
      });
    });
  
    
    // Initial result (in case some items are pre-filled)
    this.updateDragResult(msgDiv, question);
  }
  
  // --- Helper to collect results ---
  private updateDragResult(msgDiv: HTMLElement, question: Question1) {
    const key1 = question.terms[0];
    const key2 = question.terms[1];
  
    // Get the items for each group
    const group1Items = Array.from(msgDiv.querySelectorAll(`#groupA-${question.id} .item`))
      .map(el => el.textContent?.trim() || '');
  
    const group2Items = Array.from(msgDiv.querySelectorAll(`#groupB-${question.id} .item`))
      .map(el => el.textContent?.trim() || '');
  
    // Save result with dynamic keys
    if (!this.dragResults) this.dragResults = {};
    this.dragResults[question.id] = {
      [key1]: group1Items,
      [key2]: group2Items
    };
  
  //  console.log('Updated result:', this.dragResults[question.id]);
  
    // --- Enable Submit button if source is empty ---
    const sourceList = msgDiv.querySelector(`#source-${question.id}`) as HTMLElement;
    
    if (sourceList?.children.length == 0)
    {
      this.chooseAns(this.dragResults[question.id],question.id)
    }
    
  }
  
  /********** Matching ********* */

   
    drop(event: any, list: string[]) {
      moveItemInArray(list, event.previousIndex, event.currentIndex);
    }
  
    dropItemsIngGroup(event: CdkDragDrop<string[]>) {
      if (event.previousContainer !== event.container) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
  
  
    /***************/
   
    selectedLeft: number | null = null;
    selectedRight: number | null = null;
  
    lines: { left: number, right: number, line: LeaderLine }[] = [];
  
    selectLeft(i: number,questionId:number) {
      
      this.selectedLeft = i;
      if (this.selectedRight !== null) {
        this.addMatch(this.selectedLeft, this.selectedRight,questionId);
        this.selectedLeft = null;
        this.selectedRight = null;
      }
    }
  
    selectRight(j: number,questionId:number) {
      this.selectedRight = j;
      ;
      if (this.selectedLeft !== null) {
        this.addMatch(this.selectedLeft, this.selectedRight,questionId);
        this.selectedLeft = null;
        this.selectedRight = null;
      }
    }
  
  
   
  
    addMatch(leftIndex: number, rightIndex: number, questionId: number) {
      if (this.selectedLeft === null || this.selectedRight === null) return;
    
      const leftEl = document.getElementById(`left-${questionId}-${leftIndex}`);
      const rightEl = document.getElementById(`right-${questionId}-${rightIndex}`);
      const leftIndicator = document.getElementById(`left-ind-${questionId}-${leftIndex}`);
      const rightIndicator = document.getElementById(`right-ind-${questionId}-${rightIndex}`);
    
      if (!leftEl || !rightEl) return;
    
      const existingMatchIndex = this.lines.findIndex(l => l.right === rightIndex);
    
      const drawLine = () => {
        const line = new LeaderLine(leftEl, rightEl, {
          color: '#5156be',
          size: 3,
          startPlug: 'arrow3',
          endPlug: 'disc',
          path: 'straight'
        });
    
        line.hide();
        line.show('draw', { duration: 1200, timing: 'ease-in-out' });
    
        if (existingMatchIndex !== -1) {
          // Replace old line
          this.lines[existingMatchIndex].line.remove();
          this.lines[existingMatchIndex].line = line;
          this.lines[existingMatchIndex].left = leftIndex;
        } else {
          // Add new line
          this.lines.push({ left: leftIndex, right: rightIndex, line });
        }
    
        // Update indicators
        if (leftIndicator) leftIndicator.style.color = '#5156be';
        if (rightIndicator) rightIndicator.style.color = '#5156be';
    
        // Reset selection
        this.selectedLeft = null;
        this.selectedRight = null;
    
        // ✅ Update userAnswer here AFTER line is added
        this.userAnswer = {};
        this.lines.forEach(match => {
          const rightText = this.rightItems[match.right];
          const leftText = this.leftItems[match.left];
          if (!this.userAnswer[rightText]) this.userAnswer[rightText] = [];
          if (!this.userAnswer[rightText].includes(leftText)) this.userAnswer[rightText].push(leftText);
        });
    
      };
    
      setTimeout(drawLine, 50);
  
      const container = document.getElementById(`matching-${questionId}`);
      container!.addEventListener('scroll', () => {
        this.lines.forEach(lineData => lineData.line.position());
      });
    }
    
    //for_matching
    formatUserAnswer(): string[] {
      const result: string[] = [];
    
      for (const key in this.userAnswer) {
        if (this.userAnswer.hasOwnProperty(key)) {
          const values = this.userAnswer[key];
          const line = `${key} → ${values.join(', ')}`;
          result.push(line);
        }
      }
    
      return result;
    }
  
  
  addMatchingListeners(msgDiv: HTMLElement, question: Question1) {
    const leftItems = msgDiv.querySelectorAll(`.match-item.left`);
    const rightItems = msgDiv.querySelectorAll(`.match-item.right`);
  
    leftItems.forEach((el, i) => {
      ;
      el.addEventListener('click', () => this.selectLeft(i,question.id));
    });
  
    rightItems.forEach((el, j) => {
      el.addEventListener('click', () => this.selectRight(j,question.id));
    });

    const sendBtn = msgDiv.querySelector('.sendQuesBtn') as HTMLButtonElement;
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        this.submitAns(sendBtn);
      });
    }

  }
  
  getMatches(questionId: number) {
    const matches: Record<number, number[]> = {}; // key: rightIndex, value: leftIndices[]
  
    this.lines.forEach(match => {
      if (!matches[match.right]) {
        matches[match.right] = [];
      }
      matches[match.right].push(match.left);
    });
  
    return matches;
  }
  
  /*****************/ 
  addSpeakerListener(msgDiv: HTMLElement, question: Question1) {
    const speakerBtn = msgDiv.querySelector('#speaker') as HTMLButtonElement;
    if (speakerBtn) {
      speakerBtn.addEventListener('click', () => {
        this.examService.readQuestion(this.examService.escapeHtml(question.text));
      });
    }
    }
  
    addAnswerReviewToDOM(result:any) {
      const chatContainer = document.getElementById('chat-content');
      if (!chatContainer) return;
    
      const wrapper = document.createElement('div');
      wrapper.className = 'msgs msgQuesContianer1';
    
      const isCorrect = result.isAnswerCorrect ;
    
       //time to add
       let time=new Date().toISOString();
       const date = new Date(time);
       time= date.toLocaleTimeString('en-US', {
         hour: 'numeric',
         minute: '2-digit'
       });
       time = time.replace('AM', this.t('exam.am')).replace('PM', this.t('exam.pm'));
 
       var Index=this.examData.findIndex((q)=>{
        return q.id == this.Question.id
      })
  

      // Build the feedback HTML only if it exists
  let feedbackHTML = '';
  if (result.feedback && result.feedback.trim() !== '') {
    feedbackHTML = `
      <div class="rightAns text-dark">
        ${this.t('training.feedback_label')}
        <br>
        <div class="basedOnLang text-dark">${this.examService.escapeHtml(result.feedback)}</div>
      </div>
    `;
  }
  
            const isArabic = this.isObjectiveArabic
   
            const label = isArabic ? this.t('exam.label_ar') : this.t('exam.label_en');
      wrapper.id="quesRev"+this.Question.id;

      wrapper.innerHTML = `
        <div class="message bot-message">
          <div class="start_exam_txt text-dark boldtxt">
            ${this.t('training.thanks_for_answer')}
            <hr>
          </div>
    
          <div class="exam_question boldtxt basedOnLang text-dark" >
            ${label}${Index +1}: ${this.examService.escapeHtml(this.Question.text)}
          </div>
    
          <div class="answers text-dark">
            ${!isCorrect ? `
              <div class="wrongAns text-dark">
                <img src="assets/images/wrong_ans.svg" class="Ans_imgIcon">
                ${this.t('training.wrong_answer')}
              </div>` : ''}
    
            <div class="rightAns text-dark">
              <img src="assets/images/right_ans.svg" class="Ans_imgIcon">
              ${this.t('training.correct_answer_label')}
              
              <div class="basedOnLang text-dark" >
              ${this.examService.escapeHtml(result.correctAnswer)}
              </div>
            </div>
    
            <br>
            ${feedbackHTML}
            <div class="start_exam_txt text-dark boldtxt">
             ${this.t('training.watch_video')}
               
                <video width="400" onerror="this.parentElement.remove()" controls>
                  <source onerror="this.parentElement.parentElement.remove()" src="https://chat1.wfrley.site/knowledge_base/videos/${result.videoRef}" type="video/mp4">
                  Your browser does not support HTML video.
                </video>
            </div>
          </div>
    
          <div class="timestamp">${time}</div>
        </div>
        <img src="../assets/images/Frame1.png">
      `;
    
      chatContainer.appendChild(wrapper);
    
      var QuesDiv=document.getElementById("quesRev"+this.Question.id)!;
      this.alignQuestionbasedonLang(this.Question,QuesDiv);
   
      this.nextQuestion();

    
    }

    

    finishExam()
    {
          if (this.cameraCheckHandle) clearInterval(this.cameraCheckHandle);

      this.IsExamFinish=true;
      this.isExamActive=false;
      this.isTyping=false;
 const buttons = document.querySelectorAll('.btn-check');

buttons.forEach((btn: any) => {
  btn.disabled = true;
});
      const sendQuesBtns = document.querySelectorAll('.sendQuesBtn');

sendQuesBtns.forEach((btn: any) => {
  btn.disabled = true;
});
         if (this.pendingCorrections === 0) {
    this.addReportToDOM();
  }
    }
    

   addReportToDOM() {
  
      try { this.CameraService.examActive = false; } catch (e) {}
        
         // Log each group separately
     this.objective_groupedJson = this.groupExamResultByObjective();
     
     
     const finalGrouped = this.mergeGroupedQuestionsWithResults();
     
     
       const numOfcorrectAnswers = this.examResult.filter((val,ind)=>{
         return val.isAnswerCorrect == true;
       }).length;
     
       const percent = Math.round((numOfcorrectAnswers / this.numOfQuestion) * 100);
       const timestamp = new Date().toLocaleTimeString();
     
       //precent data 
 
       const radius = 54;
       const stroke = 10;
       const normalizedRadius = radius - stroke / 2;
       const circumference = 2 * Math.PI * normalizedRadius;
       const offset = circumference - (percent / 100) * circumference;
       let color =""
    if(percent < 50 )
     color="#E80D0D";
     else if( 50 < percent && percent < 85 )
       color="#E0BF13"
        else
          color="#42B47B"
 
       const container = document.getElementById('chat-content');
       if (!container) return;
     
       const msgDiv = document.createElement('div');
       msgDiv.className = 'msgs msgQuesContianer';
     
       msgDiv.innerHTML = `
         <div class="message bot-message" id="report">
           <div class="start_exam_txt text-dark boldtxt">${this.t('training.report_title')}<hr></div>
           <div class="report_txt">${this.t('training.report_summary', { count: this.numOfQuestion, questionsWord: this.getQuestionsWord(this.numOfQuestion) })}</div>
           <div class="report_result row">
             <div class="col-lg-8 col-md-8 col-sm-12">
               <div class="start_exam_txt text-dark reportServy boldtxt">${this.t('training.general_summary')}</div>
               <div class="report_txt">
                 <ul>
                   <li>${this.t('training.total_questions')} ${this.numOfQuestion}</li>
                   <li class="green">${this.t('training.correct_answers')} ${numOfcorrectAnswers}</li>
                   <li class="red">${this.t('training.wrong_answers')} ${this.numOfQuestion - numOfcorrectAnswers}</li>
 
                 </ul>
               </div>
             </div>
       
 
           <div class="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
   <div class="position-relative d-inline-block" style="width: 100%; max-width: 122px; aspect-ratio: 1;">
     <svg viewBox="0 0 122 122" width="100%" height="100%">
       <circle
         stroke="#d6d5d5"
         fill="transparent"
         stroke-width="${stroke}"
         r="${normalizedRadius}"
         cx="61"
         cy="61"
       ></circle>
       <circle
         stroke="${color}"
         fill="transparent"
         stroke-width="${stroke}"
         stroke-dasharray="${circumference} ${circumference}"
         stroke-dashoffset="${offset}"
         stroke-linecap="round"
         r="${normalizedRadius}"
         cx="61"
         cy="61"
         transform="rotate(-90 61 61)"
       ></circle>
     </svg>
     <div class="position-absolute top-50 start-50 translate-middle fw-bold" style="font-size: 1.25rem;">
       ${percent}%
     </div>
 
           
         </div>
         
       </div>
       <div>
       <hr class="secondhr">
 
         <div class=" reviewtxt boldtxt">
             ${this.t('training.detailed_review')}
            
         </div>
 
       </div>
           
         </div>
       `;
     
     
      container.appendChild(msgDiv);
      
      const ordinals = [
        'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس',
        'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
        'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر', 'الخامس عشر',
        'السادس عشر', 'السابع عشر', 'الثامن عشر', 'التاسع عشر', 'العشرون',
        'الحادي والعشرون', 'الثاني والعشرون', 'الثالث والعشرون', 'الرابع والعشرون', 'الخامس والعشرون',
        'السادس والعشرون', 'السابع والعشرون', 'الثامن والعشرون', 'التاسع والعشرون', 'الثلاثون'
      ];

      let index = 0;

      let objectiveQuestion:any[]=[];
      let questionsToReport:any[]=[];
   
       //review on each question 
     
       for (const objective in finalGrouped) {
   
        const pre_obj = this.t('training.objective_label', { ordinal: this.t(`exam.ordinals_masculine.${index + 1}`) });
        index+=1;
        
        const objectiveDiv=document.createElement("div");
        
          
         const total = finalGrouped[objective].length;
         const correct = finalGrouped[objective].filter(q => q.isAnswerCorrect).length;

         let percent = Math.round((correct / total) * 100);
        let offset = circumference - (percent / 100) * circumference;
        let color2 =""
        if(percent <= 25 )
         color2="#F1C15B";
         else if(percent <= 75 )
           color2="#5156be"
         else
           color2="#42B47B"
     
        let line=``;
         const isArabicClass=this.isObjectiveArabic?'rtl-text':'ltr-text'
        if(index > 0)
          line=`<hr class="secondhr">`;

         objectiveDiv.innerHTML= 
         `
        ${line}
        ${pre_obj} :
         <div class="start_exam_txt text-dark reportServy boldtxt basedOnLang ${isArabicClass}">${objective}</div>
         <div class="row">  
         <div class="report_txt col-lg-9 col-md-9 col-sm-12">
                 <ul>
                   <li>${this.t('training.total_questions')} ${total}</li>
                   <li class="green">${this.t('training.correct_answers')} ${correct}</li>
                   <li class="red">${this.t('training.wrong_answers')} ${total - correct}</li>
 
                 </ul>
               </div>
           <div class="col-sm-12 col-lg-3 col-md-3 d-flex justify-content-center">
   <div class="position-relative d-inline-block" style="width: 100%; max-width: 122px; aspect-ratio: 1;">
     <svg viewBox="0 0 122 122" width="100%" height="100%">
       <circle
         stroke="#d6d5d5"
         fill="transparent"
         stroke-width="${stroke}"
         r="${normalizedRadius}"
         cx="61"
         cy="61"
       ></circle>
       <circle
         stroke="${color2}"
         fill="transparent"
         stroke-width="${stroke}"
         stroke-dasharray="${circumference} ${circumference}"
         stroke-dashoffset="${offset}"
         stroke-linecap="round"
         r="${normalizedRadius}"
         cx="61"
         cy="61"
         transform="rotate(-90 61 61)"
       ></circle>
     </svg>
     <div class="position-absolute top-50 start-50 translate-middle fw-bold" style="font-size: 1.25rem;">
       ${percent}%
     </div>
 
           
         </div>
         
       </div>
         `;
       
         document.getElementById("report")?.appendChild(objectiveDiv);

 
         questionsToReport=[];
  

         for (const result of finalGrouped[objective]) {
     
        const isArabic = this.isObjectiveArabic
     
        const label = isArabic ? this.t('exam.label_ar') : this.t('exam.label_en');
  

      const Q_Index=this.examData.findIndex((q)=>{
        return q.id == result.id
      })

          //set in object 
        questionsToReport.push(
          {
              "id": result.id,
              "question": result.question,
               "answer_text":result.answerText??'',
              "is_correct": result.isAnswerCorrect,
              "correct_answer": result.correctAnswer,
              "video": result.video,
              "timeStamp": result.timestamp,
              "feedback": result.feedback
            })

           const reviewDiv=document.createElement("div");
        reviewDiv.id="quesReport"+Q_Index;
 
           reviewDiv.innerHTML=`

           <div class="start_exam_txt text-dark Ques basedOnLang" >
        ${label}${Q_Index+1}: ${this.examService.escapeHtml(result.question)}
           
           </div>
     
           <div class="answers text-dark">
             ${!result.isAnswerCorrect ? `
               <div class="wrongAns text-dark">
                 <img src="assets/images/wrong_ans.svg" class="Ans_imgIcon">
                 ${this.t('training.wrong_answer')}
               </div>` : ''}
     
            ${result.correctAnswer !== null ? `
             <div class="rightAns text-dark">
               <img src="assets/images/right_ans.svg" class="Ans_imgIcon">
               ${this.t('training.correct_answer_label')}
            
           <div class="basedOnLang text-dark"> ${this.examService.escapeHtml(result.correctAnswer)} </div>
              
             </div>
     
  <br>
        ${result.feedback ?  `
             <div class="rightAns text-dark">
            ${this.t('training.feedback_label')}
            <br>
            <div class="basedOnLang text-dark"> ${this.examService.escapeHtml(result.feedback)} </div>
           
          </div>`
          : ''}

             <div class="start_exam_txt text-dark">
                 ${this.t('training.watch_video')}
               
                 <video width="400" onerror="this.parentElement.remove()" controls>
                  <source onerror="this.parentElement.parentElement.remove()" src="https://chat1.wfrley.site/knowledge_base/videos/${result.video}" type="video/mp4">
                  Your browser does not support HTML video.
                </video>
                
          </div>
          ` : this.t('training.no_answer')}
          `
           
 
           document.getElementById("report")?.appendChild(reviewDiv);
   


     var QuesDiv=document.getElementById("quesReport"+Q_Index)!;
     this.alignQuestionbasedonLang(this.Question,QuesDiv);
      
         };
 
         const objectiveId: number = Number(finalGrouped[objective][0].examObjectiveId?? 0);
          
         //add to save report
          objectiveQuestion.push({
            "id":objectiveId??0, 
            "objective": objective,
            "correct": correct,
            "total": total,
            "percent": percent,
            "questions": questionsToReport
          })
       }


           //time to add
         let time=new Date().toISOString();
         const date = new Date(time);
         time= date.toLocaleTimeString('en-US', {
           hour: 'numeric',
           minute: '2-digit'
         });
         time = time.replace('AM', this.t('exam.am')).replace('PM', this.t('exam.pm'));
 
         const anotherExamBtn = document.createElement('button');
         anotherExamBtn.type = 'button';
         anotherExamBtn.className = 'btn newExam btn-primary';
         anotherExamBtn.textContent = this.t('training.start_new');
    
         anotherExamBtn.addEventListener('click', () => {
          this.router.navigate([''])
        });


         document.getElementById("report")?.appendChild(anotherExamBtn);
         

         var divtime=document.createElement("div");
         divtime.className="timestamp"
         divtime.innerHTML=`<div class="timestamp">${time}</div>`;
         document.getElementById("report")?.appendChild(divtime);
         
         let icon=document.createElement("img");
         icon.src="../assets/images/Frame1.png";
         msgDiv.appendChild(icon);
      
         this.isDisabled=true;
         this.IsExamFinish=true;

         //save report
      var report={
        "summary": {
          "total_questions": this.numOfQuestion,
          "correct_answers": numOfcorrectAnswers,
          "wrong_answers": this.numOfQuestion - numOfcorrectAnswers,
          "percent": Math.round((numOfcorrectAnswers / this.numOfQuestion) * 100)
        },
        "objectives": objectiveQuestion
        };
      

   this.sendReportToServer(report);
     
      
    
    
    
    
       this.scrollToBottom();
     }
   
    

     sendReportToServer(report:any)
     {
       localStorage.setItem('examFinished', 'true');
       this.http.post(this.apiConfig.getUrl(this.apiConfig.endpoints.exam.setStudentAnswers(this.examId)),report).subscribe((data)=>{
            // Save immediately
       },(err:any)=>{
         console.log(err);
       })
     }

     createAudioResponseUI(variable: string,isErrorHappen:boolean) {
      

       const sendBtn = document.querySelector('#askLink') as HTMLButtonElement;
      
      sendBtn.disabled=true;

      this.isDisabled=true;

      if(!isErrorHappen)
        {
      const container =document.getElementById('chat-content');
    
      const wrapper = document.createElement('div');
      wrapper.className = 'response-audio ';
    
      const content = document.createElement('div');
      content.className = 'response-audio-conent';
    
      // Title
      const title = document.createElement('div');
      title.className = 'response-audio-text';
      title.textContent = this.t('exam.audio_review_title');
      content.appendChild(title);
    
      // Line SVG
      const line = document.createElement('div');
      line.className = 'line';
      line.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="917" height="2" viewBox="0 0 917 2" fill="none">
          <path d="M0 1H917" stroke="#5156be" stroke-width="0.75"/>
        </svg>`;
      content.appendChild(line);
    
      // Question text
      const questionText = document.createElement('div');
      questionText.className = 'question-text';
      questionText.innerHTML = `<label> ${this.examService.escapeHtml(this.Question.text)}</label>`;
      content.appendChild(questionText);
    
      // Audio response text
      const responseText = document.createElement('div');
      responseText.className = 'text-response-audio';
      responseText.innerHTML = `
        <label>${this.t('exam.audio_received', { answer: variable })}</label>
        <label>${this.t('exam.audio_stt_note')}</label>
        <label>${this.t('exam.audio_quality_note')}</label>`;
      content.appendChild(responseText);
    
      // Submit text
      const submitText = document.createElement('div');
      submitText.className = 'submit-answer-text';
      submitText.innerHTML = `<label>${this.t('exam.confirm_answer_prompt')}</label>`;
      content.appendChild(submitText);
    
      var acceptAns:boolean;
      // Buttons
      const btnContainer = document.createElement('div');
      btnContainer.className = 'btns-container';
    
      const btns = document.createElement('div');
      btns.className = 'btns';
    
      const yesBtn = document.createElement('button');
      yesBtn.type = 'button';
      yesBtn.className = 'sendbtn btn btn-secondary';
      yesBtn.textContent = this.t('exam.yes_send_for_grading');
    
      const noBtn = document.createElement('button');
      noBtn.type = 'button';
      noBtn.className = 'editbtn btn btn-secondary';
      noBtn.textContent = this.t('exam.no_edit_answer');
    
      btns.appendChild(yesBtn);
      btns.appendChild(noBtn);
    
      const finalSendBtn = document.createElement('button');
      finalSendBtn.type = 'button';
      finalSendBtn.className = 'send-button btn btn-primary';
      finalSendBtn.textContent = this.t('exam.submit');
    
    
      yesBtn.addEventListener('click', () => {
        acceptAns = true;
      });
    
      noBtn.addEventListener('click', () => {
        acceptAns = false;
      });
      
    

      const Timestamp = new Date().toISOString();

      finalSendBtn.addEventListener('click', () => {
      
        if(acceptAns)
        {
          this.userAnswer=variable;
          
          this.examService.displayMessage(variable,"user",Timestamp);
          this.saveAnswer(this.Question);
        }
        else
        {
            this.disableMultipleChoiceQuestion(false);

              this.isDisabled=false;
             sendBtn.disabled=false;
             
          this.examService.displayMessage(this.t('exam.answer_again'),"bot",Timestamp);
       
        }
    
        finalSendBtn.disabled = true;
        noBtn.disabled=true;
        yesBtn.disabled=true;
      });
    
      this.isTyping=false;
      btnContainer.appendChild(btns);
      btnContainer.appendChild(finalSendBtn);
    
      //var divtime=document.createElement("div");
      //divtime.className="timestamp"
     // divtime.innerHTML=`<div class="timestamp">${time}</div>`;
     // btnContainer.appendChild(divtime);
    
      content.appendChild(btnContainer);
    
     
      // Add content to wrapper
      wrapper.appendChild(content);
      let icon=document.createElement("img");
      icon.src="../assets/images/Frame1.png";
      wrapper.appendChild(icon);
      
      // Inject into DOM
      if(container)container.appendChild(wrapper);
    
       }
    else
      {
        this.isTyping = false;
        const Timestamp = new Date().toISOString();
        this.examService.displayMessage(this.t('training.audio_error'), "bot", Timestamp);

      }
      this.scrollToBottom()
    
    }
    

  readQuestion(question:string)
  {
    this.examService.readQuestion(question);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // ⛔ Block newline
  
      const inputElement = document.getElementById("question-input") as HTMLTextAreaElement;
      const text = inputElement?.value.trim();
  
      if (text) {
        // ✅ Trigger the click programmatically
        const sendBtn = document.querySelector('#askLink') as HTMLElement;
        sendBtn?.click();
  
        // Optionally clear input
        inputElement.value = '';
      }
    }
  }
  
  
  groupExamResultByObjective(): { [objective: string]: any[] } {
    const grouped: { [objective: string]: any[] } = {};
  
    for (const item of this.examData) {
      const key = item.objective;
  
      if (!grouped[key]) {
        grouped[key] = [];
      }
  
      grouped[key].push(item);
    }
  
    return grouped;
  }


  cleanText(text:any,type:any) {
   
    if(
        type == QuestionTypeEnum.DragAndDrop ||
        type == QuestionTypeEnum.Matching ||
        type == QuestionTypeEnum.Sequence ||
        type == QuestionTypeEnum.multiple_response
      )
      {
        return text;
      }
      else
      {
        
    return text.replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, '');
      }
  }
  
  mergeGroupedQuestionsWithResults(): { [objective: string]: any[] } {
    const merged: { [objective: string]: any[] } = {};
  
    for (const objective in this.objective_groupedJson) {
      const questions = this.objective_groupedJson[objective];
  
     
      merged[objective] = questions.map((question: any) => {
        const result = this.examResult.find(r => r.id === question.id);
  

        return {
          question: question.text,
          correctAnswer: result?.correctAnswer ?? null,
          isAnswerCorrect: result?.isAnswerCorrect ?? null,
          video:result?.videoRef ?? null ,
          feedback:result?.feedback ?? null ,
          id:question.id,
          answerText:result?.answerText ?? null,
          examObjectiveId: question.exam_objective_id
          
        };
      });
    }
  
    return merged;
  }

  
  playSoundOnce(src: string,btn:HTMLButtonElement): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      // A sound is still playing — do not interrupt
      return;
    }

    this.currentAudio = new Audio(src);
    this.currentAudio.load();
    this.currentAudio.play();

    this.currentAudio.onended = () => {
      this.currentAudio = null;
      btn.disabled=false;
    };
  }

  
  getAssistantId()
  {
   
   this.http.get(this.apiConfig.getUrl(this.apiConfig.endpoints.exam.getAssistantId)+this.subjectId).subscribe((data:any)=>{
        this.assistantId=data['aiAssistantId'];
    },(err)=>{

    })
 
  }




  alignQuestionbasedonLang(Question:any, container: HTMLElement)
{
    // Extract plain text 
      const isArabic = this.isObjectiveArabic
  

    let questionType:string="";
    
      if(isArabic)
      {
          
            container.querySelectorAll('.basedOnLang').forEach(el => {
              el.classList.add('rtl-text'); // ✅ add the class
              el.classList.remove('ltr-text');
          });
       
        switch(Question.type)
        {
            case 14: questionType=`(مقارنة)`;break;
            case 13: questionType=`(حسابي)`;break;
            case 12: questionType=`(دراسة حالة)`;break;
            case 11: questionType=`(رقمي)`;break;
            case 10: questionType=`(السحب والإسقاط)`;break;
     
            case 8: questionType=`(ترتيب)`;break;
          case 5: questionType=`(مقالي)`;break;
          case 4: questionType=`(إجابة قصيرة)`;break;
          case 6: questionType=`(أكمل)`;break;
          case 3:questionType=`(صحيح / خطأ)`;break;
          case 2:questionType=`(اختيار متعدد)`;break;
          case 1: questionType=`(اختياري)`;break;
        }

      }
      else{

  
          container.querySelectorAll('.basedOnLang').forEach(el => {
            el.classList.add('ltr-text'); // ✅ add the class
            el.classList.remove('rtl-text');
          });
        
        switch(Question.type)
        {
            case 14: questionType=`(Comparative)`;break;
            case 13: questionType=`(Computational)`;break;
            case 12: questionType=`(CaseStudy)`;break;
            case 11: questionType=`(Numeric)`;break;
            case 10: questionType=`(Drag And Drop)`;break;
            case 8: questionType=`(Sequence)`;break;
            case 7:questionType=`(matching)`;break;
          case 5: questionType=`(essay)`;break;
          case 4: questionType=`(short answer)`;break;
          case 6: questionType=`(fill in the blank)`;break;
          case 3:questionType=`(true / false)`;break;
          case 2: questionType=`(multiple response)`;break;
          case 1: questionType=`(multiple choice)`;break;
        }
      }

      return questionType;

}


startRecord()
{
  if(this.examResponses.some( (r:any) => r == ResponseTypeEnum.VOICE_ANSWER))
    {
      if(!this.IsExamFinish)
          {
            this.thereIsRecord=true;
            this.recorder.startRecording();
          }
    }
    else
    {
      this.toast.showError(this.t('training.recording_not_allowed'))
    }

  
}

onRecordingCompleted(event:any) {
  this.audioFile=event.audioFile;
  this.audioUrl=event.audioUrl;
}

onRecordingDeleted() {
  this.audioUrl=null;
 this.thereIsRecord=false;
}



   disableMultipleChoiceQuestion(BtnStatus:boolean)
  {
      let submitButton = document.getElementById("btn"+this.Question.id)as HTMLButtonElement;    
             let radios = document.querySelectorAll(`input[name="${this.Question.id}"]`);
            radios.forEach(input => (input as HTMLInputElement).disabled = BtnStatus);

             if(submitButton)
              submitButton.disabled=BtnStatus;

             
  }
onBackButton() {
  localStorage.setItem('examFinished', 'true');
}



onReturn() {
 if (!this.isExamActive) return;
  this.requestFullscreen();
  this.showViolationPopup = false;
}
// mvove it to service
requestFullscreen() {
  const elem = document.documentElement as any;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}
//copy and paste prevention


private triggerViolation() {
  if (this.violationHandled) return;

  this.violationHandled = true;

  this.handleViolation();

  // reset after short delay so next real violation counts again
  setTimeout(() => {
    this.violationHandled = false;
  }, 1000);
}

private handleViolation() {


this.addViolation('left_exam_window', ViolationType.Visibility);
  this.showViolationPopup = true;
}


addViolation(v: string, type: ViolationType) {
  if(!this.isExamActive || this.IsExamFinish) return
       if (this.violations.length >= this.maxViolations) {
      //show report when reach max
     // this.finishExam();
      this.isBlocked = true;
      this.showViolationPopup = false;
      return;
    } 
  this.counterViolation++;
   this.violations.push({
    type: type,
    message:v,
    timestamp: new Date(),
  })
}
get getVisibilityViolationsCount(): number {
  return this.violations.filter(v => v.type === ViolationType.Visibility).length;
}


// camera check: verifies camera availability via getUserMedia constraints
private async checkCameraStatus() {
  try {
    // try to get a short-lived camera stream to confirm camera is available
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // if succeeded, mark cameraOn true and stop tracks immediately
    this.cameraOn = true;
    try { stream.getTracks().forEach(t => t.stop()); } catch {}
    // hide any previous violation
    // do not increment violations here unless camera becomes off
  } catch (e) {
    // failed to access camera (permission denied or not found)
    this.cameraOn = false;
    // show violation popup and record violation
    this.showViolationPopup = true;
    this.addViolation('camera_not_available', ViolationType.Visibility);
  }
  // ensure UI updates
  try { (window as any).requestAnimationFrame(() => {}); } catch {}
}
applyLanguageDirection(container: HTMLElement, isArabic: boolean) {
   isArabic=this.isObjectiveArabic;
  const elements = container.querySelectorAll('.basedOnLang');

  elements.forEach((el: Element) => {

    if (isArabic) {
      el.classList.add('rtl-text');
      el.classList.remove('ltr-text');
    } 
    else {
      el.classList.add('ltr-text');
      el.classList.remove('rtl-text');
    }

  });

}

}

