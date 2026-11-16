import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, ViewChild, ViewEncapsulation, ChangeDetectorRef, HostListener, Input, OnDestroy } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CameraService } from 'src/app/shared/services/camera.service';


import LeaderLine from 'leader-line-new';
import { TranslateService } from '@ngx-translate/core';
import { ExamService, Question1, QuestionAI } from 'src/app/shared/services/exam.service';
import { RecoderComponent } from 'src/app/shared/components/recoder/recoder.component';
import { ViolationType } from 'src/app/domain/enums/violation-type.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/shared/services/toast-service';
import { ApiConfig } from 'src/app/data/config';
import { QuestionTypeEnum, ResponseTypeEnum } from 'src/app/domain/enums/exam-enums';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ExamComponent implements OnDestroy {
  @ViewChild('questionInput') questionInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('Chat_box') private scrollContainer!: ElementRef;
  @Input() verified = false;
  private currentAudio: HTMLAudioElement | null = null;
  showExam = false;
  objectiveText: string = '';
  isObjectiveArabic: boolean = false
  sentReportToServer: boolean = false
  documentDir = document.body.dir || 'ltr';
  isDisabled = true;
  isTyping = false;
  courseName: string = '';
  subject = 'Math'; // Replace with your actual subject
  haveOldMsg = false;
  variable: any = 'تكرار هو أحد مفاهيم الخوارزميات'
  //exam 
  examId: any;
  exam: any;
  userAnswer: any = null;
  examData: any[] = [];
  Question!: QuestionAI;
  examResult: any[] = [];
  QuestionType = QuestionTypeEnum;
  numOfQuestion: any;
  loading = false;
  sub: any;
  questionType: any = "Essay";
  groupedByObjective: { [key: string]: any[] } = {};
  IsExamFinish: any = false;
  thread_id: any;
  objective_groupedJson: any;
  objectiveWithPercent: any[] = [];
  examResponses: any[] = [];
  disabledinput: boolean = true;

  assistantId: any;
  pre_Ques: string = '';
  showDialog: any = false;
  QuestionNotCorretnesss: any = [];
  problemInCorrect: boolean = false;
  /********Audio recording ************* */
  mediaRecorder!: MediaRecorder;
  audioUrl: string | null = null;
  isPlaying = false;
  audioFile: File | undefined;
  thereIsRecord = false;
  @ViewChild(RecoderComponent) recorder!: RecoderComponent;
  subjectId: any;
  leftItems: any[] = [];
  rightItems: any[] = [];
  /******************** */
  audioQuestionId: number | string | null = null;
  audioQuestionText: string | null = null;

  violations: { type: ViolationType; message: string; timestamp: Date }[] = [];
  isBlocked = false;
  showViolationPopup = false;
  maxViolations = 10;
  counterViolation = 0;
  isExamActive = true;
  cameraOn = true;
  pendingCorrections = 0;

  private cameraCheckHandle: any = null;
  private violationSubscription: any;
  private violationHandled = false;
  @HostListener('document:fullscreenchange')
  onFullScreenChange = () => {
    if (!this.isExamActive) return;
    if (!document.fullscreenElement) {

      this.addViolation('fullscreen_exit', ViolationType.Visibility);

      this.showViolationPopup = true;
      this.requestFullscreen();
    }
  };

  //Drag and Drop Question
  items: any[] = [];

  // Groups (empty at first)
  groupA: string[] = [];
  groupB: string[] = [];
  dragResults: any;
  isForceFinished: boolean = false;
  courseId: number = 0
  /***************************** */

  constructor(private examService: ExamService, private router: Router,
    private https: HttpClient,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private toast: ToastService, private cdr: ChangeDetectorRef, private readonly apiConfig: ApiConfig,
    private CameraService: CameraService) {


    // listen if user record
    this.sub = this.examService.answer$.subscribe(([answerTxt, isthereError, qId, qText]) => {
      this.createAudioResponseUI(answerTxt, isthereError, qId, qText);
    });




  }

  ngOnInit(): void {

document.body.removeAttribute('data-sidebar-size');

    this.route.params.subscribe(params => {
      this.subjectId = params['subjectId']; // "+" converts to number
      this.examId = params['id']; // "+" converts to number

    });

  }

  ngAfterViewInit() {

    this.preventRefresh();

    this.violationSubscription = this.CameraService.violation$.subscribe((data) => {
      this.showViolationPopup = true;
      this.addViolation(data.err, ViolationType.verifyIdentity);
    });

    this.checkCameraStatus();
    this.cameraCheckHandle = setInterval(() => this.checkCameraStatus(), 30 * 1000);

    //get exam and first Question

    //get AssistantId
    /*     this.getAssistantId();
     */
    setTimeout(() => {
      this.loading = true;
      this.cdr.detectChanges();
    }, 0);

    this.examService.getExam(this.examId).subscribe((data: any) => {
      setTimeout(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }, 0);
      this.objectiveText = data.questions?.[0]?.objective ?? '';
      // One direction for the whole exam
      this.isObjectiveArabic = this.isArabicText(this.objectiveText);

      this.examData = data.questions;
      this.numOfQuestion = this.examData.length;
      this.assistantId = data.collection_id;
      this.examId = data.exam_id;
      document.getElementById("chatheader")!.innerHTML = data.exam_name;

      this.examResponses.push(data.response_types
      );

      this.getReponseType();

      //get first question;
      this.Question = this.examService.getCurrentQuestion(0);


      if (this.Question)
        this.addQuestionToDom(this.Question);


    }, (err) => {


      const match = err.error.error[0].match(/ExamId\s*=\s*(\d+)/);
      const examId = match ? Number(match[1]) : null;



    });


  }

  getAssistantId() {


    this.https.get(this.apiConfig.getUrl(this.apiConfig.endpoints.exam.getAssistantId) + this.subjectId).subscribe((data: any) => {
      this.assistantId = data['aiAssistantId'];
    }, (err) => {

    })

  }

  scrollToBottom() {
    if (this.scrollContainer)
      this.scrollContainer.nativeElement.scrollTo({
        top: this.scrollContainer.nativeElement.scrollHeight,
        behavior: 'smooth'
      });

  }


  displayAnswer(): void {
    if (this.thereIsRecord) {
      if (this.audioUrl) {
        this.thereIsRecord = false;
        setTimeout(() => {
          this.isTyping = true;
          this.cdr.detectChanges();
        }, 0);
        this.examService.displayAudioInExam(
          this.audioUrl,
          this.audioFile,
          this.audioQuestionId ?? this.Question?.id,
          this.audioQuestionText ?? this.Question?.text
        );
        this.recorder.deleteRecording();

      }
      else {
        this.recorder.stopRecording();
      }

    }
    else {
      //prevent empty answer
      const inputElement1 = document.getElementById("question-input") as HTMLInputElement;
      const text = inputElement1?.value || '';

      if (text.trim() != "" && this.isTyping == false) {

        const userTimestamp = new Date().toISOString();

        //store answers
        const inputElement = document.getElementById("question-input") as HTMLInputElement;

        this.userAnswer = inputElement?.value;

        //send answer to api and display it.
        this.examService.displayMessage(this.userAnswer, "user", userTimestamp);


        this.scrollToBottom();


        //store answers
        if (!this.problemInCorrect) {
          this.saveAnswer(this.Question);
        }
        else {
          this.retry_To_saveAnswer(this.Question);
        }

        inputElement.value = '';

      }
    }

  }




  TypingQuestionChange(): void {

    if (!this.IsExamFinish) {
      const inputElement = document.getElementById("question-input") as HTMLInputElement;
      const text = inputElement?.value || '';


      if (text.trim() === "" || this.isTyping === true) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }

      inputElement.scrollTop = inputElement.scrollHeight;
    }
  }

  getReponseType() {


    const hasWritingQuestion = this.examData.some(q => [QuestionTypeEnum.essay, QuestionTypeEnum.fill_blank,
    QuestionTypeEnum.short_answer, QuestionTypeEnum.Comparative, QuestionTypeEnum.CaseStudy].includes(q.type));



    if ((this.examResponses[0] ?? []).some((r: any) => r == ResponseTypeEnum.WRITING_ANSWER)) {

      this.disabledinput = false;


    }
    else {

      if (hasWritingQuestion && !this.examResponses[0].some((r: any) => r == ResponseTypeEnum.VOICE_ANSWER)) {
        this.disabledinput = false;

      }

    }
  }



  stopRecord() {
    this.examService.stopRecording();

  }



  //start exam code
  chooseAns(answer: any, questionId: any) {
    this.userAnswer = answer;


    if (this.Question.id == questionId) {
      let submitButton;
      if (!this.problemInCorrect) {
        submitButton = document.getElementById("btn" + questionId) as HTMLButtonElement;

      }
      else {
        submitButton = document.getElementById("btn" + questionId + "P") as HTMLButtonElement;

      }

      if (submitButton) {
        if (Array.isArray(answer) && answer.length === 0) {
          submitButton.disabled = true;
        } else {
          submitButton.disabled = false;
        }
      }


    }

  }

  submitAns(button: HTMLButtonElement) {


    if (this.userAnswer != null) {

      const container = document.getElementById('chat-content');
      if (!container) return;


      button.disabled = true;


      const userTimestamp = new Date().toISOString();


      if (this.Question.question_type == this.QuestionType.Sequence
        || this.Question.question_type == this.QuestionType.Matching
        || this.Question.question_type == this.QuestionType.DragAndDrop
      ) {
        //      const selectedTexts = this.userAnswer.map((key:any) => this.Question.options[key]);

        if (this.Question.question_type == this.QuestionType.Matching) {

          this.userAnswer = this.formatUserAnswer();
          // Remove each LeaderLine
          this.lines.forEach(match => match.line.remove());

          // Clear the array
          this.lines = [];


        }
        else if (this.Question.question_type == this.QuestionType.DragAndDrop) {
          // Format each key-value pair like `key: [val1, val2]`
          const formattedAnswer = Object.keys(this.userAnswer)
            .map(key => `<div><strong>${key}</strong>: ${this.userAnswer[key].join(', ')}</div>`)
            .join('\n'); // use '\n' for line breaks
          this.userAnswer = formattedAnswer;
        }
        const selectedTexts = this.userAnswer;
        //   this.userAnswer = selectedTexts.join(', ');  // Or use '\n' if you want line breaks

        //send answer to api and display it.
        this.examService.displayMessage(selectedTexts, "user", userTimestamp);


      }
      else {

        //send answer to api and display it.
        this.examService.displayMessage(this.userAnswer, "user", userTimestamp);


      }


      //store answers
      if (!this.problemInCorrect) {
        this.saveAnswer(this.Question);
      }
      else {
        this.retry_To_saveAnswer(this.Question);
      }

      container.scrollTop = container.scrollHeight;



    }

  }

  nextQuestion() {
    //next ques
    const NextQuestion = this.examService.goToNextQuestion();
    if (NextQuestion != null) {
      this.Question = NextQuestion;
      this.addQuestionToDom(this.Question);

    }
    else {
      this.finishExam();
    }

  }

  saveAnswer(Question: any) {

    // let answer = {
    //   question: Question.question,
    //   answer: this.cleanText(this.userAnswer, Question.type),
    //   assistant_id: this.assistantId
    // };
    const userAnswer = this.cleanText(this.userAnswer, Question.question_type);


    let answer = {
      "answer": userAnswer,
      "collection_id": this.assistantId,
      "question_details": {

        "id": Question.id,


        "question": Question.text,
        "question_type": this.examService.convertToQuestionTypeString(Question.question_type),
        "cognitive_style": this.examService.convertToCognitiveStyleString(Question.cognitive_style),
        "correct_answer": (Question.correct_answer == null) ? "no answer available" : Question.correct_answer,
        "difficulty": this.examService.convertToComplexityLevelsString(Question.difficulty),
        "file_name": (Question.learning_unit_file == null) ? '' : Question.learning_unit_file,
        "objective_name": Question.objective,
        "points": 0,
        options: Question.options.map((option: any) => ({
          option: option.text,
          is_correct: option.is_correct
        }))

      }
    };

    let submitButton = document.getElementById("btn" + Question.id) as HTMLButtonElement;
    if (submitButton)
      submitButton.disabled = true;

    //correct answer and get feedback

    if (Question.question_type == this.QuestionType.Sequence
      || Question.question_type == this.QuestionType.Matching
      || Question.question_type == this.QuestionType.DragAndDrop
    ) {
      const wrongResult = {
        id: Question.id,
        answerText: userAnswer,
        correctAnswer: "study to find the correct answer",
        feedback: "any feedback here",
        improvement: null,
        isAnswerCorrect: false,
        timestamp: null,
        videoRef: null
      };

      this.examResult.push(wrongResult);

    }
    else {
      this.pendingCorrections++;

      this.examService.correctExam(answer).subscribe({
        next: (data: any) => {
          data.id = Question.id
          data.answerText = userAnswer
          this.examResult.push(data);


        },
        error: (err: any) => {

          const wrongResult = {
            id: Question.id,
            answerText: userAnswer,
            correctAnswer: "study to find the correct answer",
            feedback: "any feedback here",
            improvement: null,
            isAnswerCorrect: false,
            timestamp: null,
            videoRef: null
          };

          this.examResult.push(wrongResult);


          this.QuestionNotCorretnesss.push(Question);
          //  this.problemInCorrect = true;
          console.error('Error correcting exam', err);
        },
        complete: () => {

          this.pendingCorrections--;
          if (this.IsExamFinish && this.pendingCorrections === 0) {
            this.finishExam();
          }

        }

      })

    }

    this.userAnswer = null;
    this.nextQuestion();

  }



  async retry_To_saveAnswer(Question: QuestionAI) {


    // let answer={
    //   question: Question.question,
    //   answer: this.cleanText(this.userAnswer,Question.type),
    //   assistant_id:this.assistantId
    // };


    let submitButton = document.getElementById("btn" + Question.id) as HTMLButtonElement;

    if (submitButton)
      submitButton.disabled = true;

    //correct answer and get feedback
    setTimeout(() => {
      this.isTyping = true;
      this.cdr.detectChanges();
    }, 0);



    const userAnswer = this.cleanText(this.userAnswer, Question.question_type);


    let answer = {
      "answer": userAnswer,
      "collection_id": this.assistantId,
      "question_details": {

        "id": Question.id,


        "question": Question.text,
        "question_type": this.examService.convertToQuestionTypeString(Question.question_type),
        "cognitive_style": this.examService.convertToCognitiveStyleString(Question.cognitive_style),
        "correct_answer": (Question.correct_answer == null) ? "no answer available" : Question.correct_answer,
        "difficulty": this.examService.convertToComplexityLevelsString(Question.difficulty),
        "file_name": (Question.learning_unit_file == null) ? '' : Question.learning_unit_file,
        "objective_name": Question.objective,
        "points": 0,
        options: Question.options.map((option: any) => ({
          option: option.text,
          is_correct: option.is_correct
        }))

      }
    };

    this.examService.correctExam(answer).subscribe({
      next: (data: any) => {
        data.id = Question.id;
        data.answerText = this.userAnswer
        this.examResult.push(data);

        setTimeout(() => {
          this.isTyping = false;
          this.cdr.detectChanges();
        }, 0);
        this.QuestionNotCorretnesss = this.QuestionNotCorretnesss.filter((q: Question1) => q.id !== Question.id);
        this.nextQuestionThatNotCorrect();

      },
      error: (err: any) => {
        setTimeout(() => {
          this.isTyping = false;
          this.cdr.detectChanges();
        }, 0);
/*         this.examService.displayMessage(this.t('exam.retry_answer_error'),"bot",new Date().toISOString());
 */        this.scrollToBottom();

        //enable answer again   
        const sendBtn = document.getElementById(`btn${Question.id}`) as HTMLButtonElement;
        sendBtn.disabled = false;

        const radios = document.getElementsByName(Question.id) as NodeListOf<HTMLInputElement>;
        radios.forEach(radio => radio.disabled = false);

        console.error('Error correcting exam', err);
      }

    })

    this.userAnswer = null;


  }



  addQuestionToDom(question: QuestionAI) {

    question.id = (this.problemInCorrect) ? question.id + "P" : question.id;

    const container = document.getElementById('chat-content');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'msgs msgQuesContianer';

    const index = this.findQuestionIndex(question.id);
    const time = this.formatTime(new Date());
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

  isArabicText(text: string): boolean {
    return /[\u0600-\u06FF]/.test(text);
  }

  private t(key: string, params?: object): string {
    return this.translate.instant(key, params);
  }

  private getQuestionsWord(count: number): string {
    return count < 11 ? this.t('exam.questions_plural') : this.t('exam.question_singular');
  }

  private getQuestionLabel(isArabic: boolean): string {
    return isArabic ? this.t('exam.label_ar') : this.t('exam.label_en');
  }

  private getTrueFalseAnswers(isArabic: boolean): string[] {
    return isArabic
      ? [this.t('exam.true_ar'), this.t('exam.false_ar')]
      : [this.t('exam.true_en'), this.t('exam.false_en')];
  }

  private getOrdinal(index: number): string {
    return this.t(`exam.ordinals.${index + 1}`);
  }

  private getQuestionTypeLabel(type: number): string {
    const key = `exam.question_types.${type}`;
    const label = this.t(key);
    return label !== key ? `(${label})` : '';
  }

  /* ---------- HTML Builders ---------- */
  getIntroHtml(index: number, question: QuestionAI): string {
    if (index === 0 && !this.problemInCorrect) {
      const intro = this.t('exam.start_intro', {
        count: this.numOfQuestion,
        questionsWord: this.getQuestionsWord(this.numOfQuestion)
      });
      return `<div class="start_exam_txt text-dark blackcolor">${intro}</div>`;
    }
    return '';
  }

  getControlsHtml(question: QuestionAI, isArabic: boolean): string {

    let html = '';

    switch (question.question_type) {
      case this.QuestionType.multiple_choice:
      case this.QuestionType.Numeric:
      case this.QuestionType.Computational:

        html = this.renderMultipleChoice(question);
        break;
      case this.QuestionType.multiple_response:
        html = this.renderMultipleResponse(question);
        break;
      case this.QuestionType.true_false:
        html = this.renderTrueFalse(isArabic, question);
        break;
      case this.QuestionType.Sequence:
        html = this.renderSequence(question);
        break;
      case this.QuestionType.DragAndDrop:
        html = this.renderGroups(question);
        break;
      case this.QuestionType.Matching:
        html = this.renderMatching(question);
        break;
      default:
        html = '';
    }

    return `
    <div class="${isArabic ? 'arabic-content' : 'english-content'}">
      ${html}
    </div>
  `;

  }

  renderGroups(question: QuestionAI): string {
    const submitLabel = this.t('exam.submit');

    return `
      <div class="draggableContainer row" data-question-id="${question.id}">
        
        <!-- Groups -->
        <div class="groups col-8">
          <div id="groupA-${question.id}" class="group">
            <h3><span>${question.terms[0]}</span></h3>
          </div>
  
          <div id="groupB-${question.id}" class="group">
            <h3><span>${question.terms[1]}</span></h3>
          </div>
        </div>
  
        <!-- Source -->
        <div id="source-${question.id}" class="source col">
          ${question.matches.map((ans: any) => `
            <div class="item">
              <img src="assets/images/move.svg" width="19" height="19" />
              ${ans}
            </div>
          `).join('')}
        </div>
      </div>
      <button class="btn sendQuesBtn btn-primary" id="btn${question.id}" type="button">${submitLabel}</button>
    `;
  }


  renderMultipleChoice(question: QuestionAI): string {
    return question.answers.map((answer, ind) => `
      <input type="radio" class="btn-check" name="${question.id}" id="ques${question.id}_${ind}" value="${ind}">
      <label class="btn btnRadio" for="ques${question.id}_${ind}">${this.examService.escapeHtml(answer)}</label>
    `).join('');
  }

  renderMultipleResponse(question: QuestionAI): string {
    return question.answers.map((answer, ind) => `
      <input type="checkbox" class="btn-check" name="${question.id}" id="ques${question.id}_${ind}" value="${ind}">
      <label class="btn btnRadio" for="ques${question.id}_${ind}">${this.examService.escapeHtml(answer)}</label>
    `).join('');
  }

  renderTrueFalse(isArabic: boolean, question: Question1): string {
    const answers = this.getTrueFalseAnswers(isArabic);
    return answers.map((answer, ind) => `
      <input type="radio" class="btn-check" name="${question.id}" id="ques${question.id}_${ind}" value="${ind}">
      <label class="btn btnRadio" for="ques${question.id}_${ind}">${answer}</label>
    `).join('');
  }

  renderSequence(question: Question1): string {
    const submitLabel = this.t('exam.submit');
    return `
      <div class="example-list" data-question-id="${question.id}">
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
    const questionIsArabic = this.isArabicText(this.objectiveText);

    const questionLanguageClass = questionIsArabic
      ? 'arabic-content'
      : 'english-content';
    this.leftItems = question.terms;
    this.rightItems = question.matches;
    const submitLabel = this.t('exam.submit');
    const columnA = this.t('exam.matching_column_a');
    const columnB = this.t('exam.matching_column_b');

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
    const questionIsArabic = this.isArabicText(question.text);

    const questionLanguageClass =
      this.isObjectiveArabic ? 'rtl-text' : 'ltr-text';
    const label = this.getQuestionLabel(isArabic);
    const submitLabel = this.t('exam.submit');
    const sendButtonHtml = (question.question_type !== this.QuestionType.essay &&
      question.question_type !== this.QuestionType.fill_blank &&
      question.question_type !== this.QuestionType.short_answer &&
      question.question_type !== this.QuestionType.Sequence &&
      question.question_type !== this.QuestionType.Comparative &&
      question.question_type !== this.QuestionType.CaseStudy &&
      question.question_type !== this.QuestionType.Matching &&
      question.question_type !== this.QuestionType.DragAndDrop
    )
      ? `<button class="btn sendQuesBtn btn-primary" disabled id="btn${question.id}" type="button">${submitLabel}</button>`
      : '';

    return `
      <div class="message bot-message">
        ${introHtml}
        <div class="exam_question" >
          <div id="questionDiv${question.id}" class="basedOnLang text-dark ${questionLanguageClass}">
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
      question.question_type === this.QuestionType.Numeric) {
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
    let placeholder: HTMLElement | null = null;
    let draggedEl: HTMLElement | null = null;

    if (!dropList) return;

    dropList.querySelectorAll('.example-box').forEach((box, index) => {
      const dragBox = box as HTMLElement;
      dragBox.draggable = true;
      dragBox.dataset['index'] = index.toString();

      // dragstart
      dragBox.addEventListener('dragstart', (e) => {
        draggedEl = dragBox;
        e.dataTransfer?.setData('text/plain', index.toString());
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          // 🟢 نسخة مع الماوس
          e.dataTransfer.setDragImage(dragBox, dragBox.offsetWidth / 2, dragBox.offsetHeight / 2);
        }

        // placeholder
        placeholder = document.createElement('div');
        placeholder.className = 'drag-placeholder';
        placeholder.style.height = dragBox.offsetHeight + 'px';
        placeholder.style.border = '2px dashed #aaa';
        placeholder.style.margin = '4px 0';

        // ⚠️ استنى بعد ما الـ browser ياخد نسخة العنصر
        setTimeout(() => {
          if (draggedEl && placeholder) {
            dropList.replaceChild(placeholder, draggedEl);
          }
        }, 0);
      });

      // dragend
      dragBox.addEventListener('dragend', () => {
        if (placeholder && draggedEl) {
          dropList.replaceChild(draggedEl, placeholder);
          placeholder = null;
        }
        draggedEl = null;
      });
    });

    // dragover
    dropList.addEventListener('dragover', (e) => {
      e.preventDefault();
      const targetBox = (e.target as HTMLElement).closest('.example-box') as HTMLElement;

      if (targetBox && placeholder && targetBox !== placeholder) {
        const rect = targetBox.getBoundingClientRect();
        const next = (e.clientY - rect.top) / rect.height > 0.5;
        dropList.insertBefore(placeholder, next ? targetBox.nextSibling : targetBox);
      }
    });

    // drop
    dropList.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!placeholder || !draggedEl) return;

      const from = parseInt(draggedEl.dataset['index'] || '0', 10);
      const to = Array.from(dropList.children).indexOf(placeholder);

      const movedItem = question.answers.splice(from, 1)[0];
      question.answers.splice(to, 0, movedItem);

      // رجّع العنصر مكان placeholder
      dropList.replaceChild(draggedEl, placeholder);

      // تحديث العرض
      this.updateSequenceDisplay(msgDiv, question.answers);

      placeholder = null;
      draggedEl = null;

      const sendBtn = msgDiv.querySelector('.sendQuesBtn') as HTMLButtonElement;
      if (sendBtn) sendBtn.disabled = false;
    });
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
        // Extract text content excluding the image
        const textContent = Array.from(item.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent?.trim())
          .join('')
          .trim();

        e.dataTransfer?.setData('text/plain', JSON.stringify({
          text: textContent,
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
      list.addEventListener('dragover', (e) => {
        e.preventDefault();
        // Add hover effect to show empty space
        list.classList.add('drag-over');
      });

      list.addEventListener('dragleave', (e) => {
        // Remove hover effect
        list.classList.remove('drag-over');
      });

      list.addEventListener('drop', (e) => {
        e.preventDefault();

        // Remove hover effect
        list.classList.remove('drag-over');

        const data = e.dataTransfer?.getData('text/plain');
        if (!data) return;

        const { text, fromId } = JSON.parse(data);

        // Remove item from old list
        const fromList = msgDiv.querySelector(`#${fromId}`) as HTMLElement;
        const itemEl = Array.from(fromList.querySelectorAll('.item'))
          .find(el => {
            const itemText = Array.from(el.childNodes)
              .filter(node => node.nodeType === Node.TEXT_NODE)
              .map(node => node.textContent?.trim())
              .join('')
              .trim();
            return itemText === text;
          });

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
      .map(el => {
        // Get all text nodes, excluding the image
        const textNodes = Array.from(el.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent?.trim())
          .join('')
          .trim();
        return textNodes;
      })
      .filter(text => text.length > 0);

    const group2Items = Array.from(msgDiv.querySelectorAll(`#groupB-${question.id} .item`))
      .map(el => {
        // Get all text nodes, excluding the image
        const textNodes = Array.from(el.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent?.trim())
          .join('')
          .trim();
        return textNodes;
      })
      .filter(text => text.length > 0);

    // Save result with dynamic keys
    if (!this.dragResults) this.dragResults = {};
    this.dragResults[question.id] = {
      [key1]: group1Items,
      [key2]: group2Items
    };

    //  console.log('Updated result:', this.dragResults[question.id]);

    // --- Enable Submit button if source is empty ---
    const sourceList = msgDiv.querySelector(`#source-${question.id}`) as HTMLElement;



    if (sourceList?.children.length == 0) {
      this.chooseAns(this.dragResults[question.id], question.id)
    }

  }

  /********** Matching ********* */
  addMatchingListeners(msgDiv: HTMLElement, question: Question1) {
    const leftItems = msgDiv.querySelectorAll(`.match-item.left`);
    const rightItems = msgDiv.querySelectorAll(`.match-item.right`);

    let selectedLeft: number | null = null;
    let selectedRight: number | null = null;

    // Filter lines for this question only
    this.lines = this.lines.filter(line => line.questionId !== question.id);

    leftItems.forEach((el, i) => {
      el.addEventListener('click', () => {
        this.toggleSelection(leftItems, el, 'selected');
        selectedLeft = selectedLeft === i ? null : i;

        if (selectedLeft !== null && selectedRight !== null) {
          this.toggleMatch(selectedLeft, selectedRight, question.id);
          selectedLeft = null;
          selectedRight = null;
          this.clearHighlights(leftItems, 'selected');
          this.clearHighlights(rightItems, 'selected');
        }
      });
    });

    rightItems.forEach((el, j) => {
      el.addEventListener('click', () => {
        this.toggleSelection(rightItems, el, 'selected');
        selectedRight = selectedRight === j ? null : j;

        if (selectedLeft !== null && selectedRight !== null) {
          this.toggleMatch(selectedLeft, selectedRight, question.id);
          selectedLeft = null;
          selectedRight = null;
          this.clearHighlights(leftItems, 'selected');
          this.clearHighlights(rightItems, 'selected');
        }
      });
    });

    // Add submit button event listener for matching questions
    const sendBtn = msgDiv.querySelector('.sendQuesBtn') as HTMLButtonElement;
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        sendBtn.disabled = true;
        this.submitAns(sendBtn);
      });
    }
  }

  // Highlight selected item
  toggleSelection(elements: NodeListOf<Element>, el: Element, className: string) {
    if (el.classList.contains(className)) {
      el.classList.remove(className);
    } else {
      this.clearHighlights(elements, className);
      el.classList.add(className);
    }
  }

  clearHighlights(elements: NodeListOf<Element>, className: string) {
    elements.forEach(el => el.classList.remove(className));
  }

  // Toggle a match and draw/remove line with checkboxes
  toggleMatch(leftIndex: number, rightIndex: number, questionId: number) {
    const existingIndex = this.lines.findIndex(
      line => line.left === leftIndex && line.right === rightIndex && line.questionId === questionId
    );

    const leftEl = document.getElementById(`left-${questionId}-${leftIndex}`);
    const rightEl = document.getElementById(`right-${questionId}-${rightIndex}`);

    if (!leftEl || !rightEl) return;

    if (existingIndex !== -1) {
      // === REMOVE MATCH ===
      this.lines[existingIndex].line.remove();
      this.lines.splice(existingIndex, 1);
    } else {
      // === ADD MATCH ===

      // Remove any old line connected to this right item
      const conflictingIndex = this.lines.findIndex(
        l => l.right === rightIndex && l.questionId === questionId
      );
      if (conflictingIndex !== -1) {
        this.lines[conflictingIndex].line.remove();
        this.lines.splice(conflictingIndex, 1);
      }

      const leftCheckbox = document.createElement('input') as any;
      leftCheckbox.type = 'checkbox';
      leftCheckbox.disabled = true;
      leftCheckbox.checked = true;

      const rightCheckbox = document.createElement('input') as any;
      rightCheckbox.type = 'checkbox';
      rightCheckbox.disabled = true;
      rightCheckbox.checked = true;

      const line = new LeaderLine(leftEl, rightEl, {
        startPlug: leftCheckbox as any,
        endPlug: rightCheckbox as any,
        color: '#5156be',
        size: 3,
        path: 'straight'
      });

      line.show('draw', { duration: 800, timing: 'ease-in-out' });

      this.lines.push({ left: leftIndex, right: rightIndex, questionId, line });
    }

    // Update userAnswer dynamically
    this.userAnswer = {};
    this.lines
      .filter(l => l.questionId === questionId)
      .forEach(match => {
        const leftText = this.leftItems[match.left];
        const rightText = this.rightItems[match.right];
        if (!this.userAnswer[rightText]) this.userAnswer[rightText] = [];
        if (!this.userAnswer[rightText].includes(leftText)) {
          this.userAnswer[rightText].push(leftText);
        }
      });

    // Enable submit button when matches are made
    if (Object.keys(this.userAnswer).length > 0) {
      this.chooseAns(this.userAnswer, questionId);
    }

    // Update line positions on scroll
    const container = document.getElementById(`matching-${questionId}`);
    if (container) {
      container.addEventListener('scroll', () => {
        this.lines.forEach(l => l.line.position());
      });
    }
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

  async finishExam() {

    if (this.thereIsRecord) {
      this.recorder.stopRecording();
      this.recorder.deleteRecording();
    }
    if (this.cameraCheckHandle) clearInterval(this.cameraCheckHandle);
    this.violationSubscription?.unsubscribe();
    this.cameraOn = false;
    this.CameraService.stopCamera();
    const buttons = document.querySelectorAll('.btn-check');

    buttons.forEach((btn: any) => {
      btn.disabled = true;
    });
    const sendQuesBtns = document.querySelectorAll('.sendQuesBtn');

    sendQuesBtns.forEach((btn: any) => {
      btn.disabled = true;
    });
    this.IsExamFinish = true;
    this.isExamActive = false;
    setTimeout(() => {
      this.isTyping = true;
      this.cdr.detectChanges();
    }, 0);


    this.problemInCorrect = false;

    setTimeout(() => {
      this.isTyping = false;
      this.cdr.detectChanges();
    }, 0);

    while ((this.examResult.length < this.examData.length) && !this.isForceFinished) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setTimeout(() => {
      this.isTyping = false;
      this.cdr.detectChanges();
    }, 0);



    //if (this.pendingCorrections === 0) {
    this.addReportToDOM();
    //}

  }



  nextQuestionThatNotCorrect() {
    this.userAnswer = null;
    const NextQuestion = this.QuestionNotCorretnesss[0];

    if (NextQuestion != null) {

      this.addQuestionToDom(NextQuestion);

    }
    else {
      this.finishExam();
    }

  }
  addReportToDOM() {
    if (document.getElementById('report')) return
    this.showViolationPopup = false
    try { this.CameraService.examActive = false; } catch (e) { }

    // Log each group separately
    this.objective_groupedJson = this.groupExamResultByObjective();

    const finalGrouped = this.mergeGroupedQuestionsWithResults();
    const numOfcorrectAnswers = this.examResult.filter((val, ind) => {
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
    let color = ""
    if (percent < 50)
      color = "#E80D0D";
    else if (50 < percent && percent < 85)
      color = "#E0BF13"
    else
      color = "#42B47B"

    const container = document.getElementById('chat-content');
    if (!container) return;

    const questionsWord = this.getQuestionsWord(this.numOfQuestion);
    const reportSummary = this.t('exam.report_summary', {
      count: this.numOfQuestion,
      questionsWord
    });

    const msgDiv = document.createElement('div');
    msgDiv.className = 'msgs msgQuesContianer';

    msgDiv.innerHTML = `
      <div class="message bot-message" id="report">
        <div class="start_exam_txt text-dark boldtxt">${this.t('exam.report_title')}<hr></div>
        <div class="report_txt">${reportSummary}</div>
        <div class="report_result row">
          <div class="col-lg-8 col-md-8 col-sm-12">
            <div class="start_exam_txt text-dark reportServy boldtxt">${this.t('exam.general_summary')}</div>
            <div class="report_txt">
              <ul>
                <li>${this.t('exam.total_questions')}: ${this.numOfQuestion}</li>
                <li class="green">${this.t('exam.correct_answers')}: ${numOfcorrectAnswers}</li>
                <li class="red">${this.t('exam.wrong_answers')}: ${this.numOfQuestion - numOfcorrectAnswers}</li>

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
          ${this.t('exam.detailed_review_intro')}
         
      </div>

    </div>
        
      </div>
    `;


    container.appendChild(msgDiv);

    let index = 0;

    let objectiveQuestion: any[] = [];
    let questionsToReport: any[] = [];

    //review on each question 
    for (const objective in finalGrouped) {

      const pre_obj = this.t('exam.objective_label', { ordinal: this.getOrdinal(index) });
      index += 1;

      const objectiveDiv = document.createElement("div");


      const total = finalGrouped[objective].length;
      const correct = finalGrouped[objective].filter(q => q.isAnswerCorrect).length;

      let percent = Math.round((correct / total) * 100);

      /*     this.objectiveWithPercent.push({objective, percent});
       */
      let offset = circumference - (percent / 100) * circumference;
      let color2 = ""
      if (percent <= 25)
        color2 = "#F1C15B";
      else if (percent <= 75)
        color2 = "#5156be"
      else
        color2 = "#42B47B"

      let line = ``;
      const isArabicClass = this.isArabicText(objective) ? 'rtl-text' : 'ltr-text';
      if (index > 0)
        line = `<hr class="secondhr">`;

      objectiveDiv.innerHTML =
        `
     ${line}
     ${pre_obj} :
      <div class="start_exam_txt text-dark reportServy boldtxt basedOnLang ${isArabicClass}">   ${objective}</div>
      <div class="row">  
      <div class="report_txt col-lg-9 col-md-9 col-sm-12">
              <ul>
                <li>${this.t('exam.total_questions')}: ${total}</li>
                <li class="green">${this.t('exam.correct_answers')}: ${correct}</li>
                <li class="red">${this.t('exam.wrong_answers')}: ${total - correct}</li>

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


      questionsToReport = [];

      const isArabic = this.isObjectiveArabic

      const label = this.getQuestionLabel(isArabic);


      for (const result of finalGrouped[objective]) {



        var Q_Index = this.examData.findIndex((q) => {
          return q.id == result.id
        })
        //set in object // to backend 
        questionsToReport.push(
          {
            "id": result.id,
            "question": result.question,
            "answer_text": result.answerText ?? '',
            "is_correct": result.isAnswerCorrect,
            "correct_answer": result.correctAnswer,
            "video": result.video,
            "timeStamp": result.timestamp,
            "feedback": result.feedback
          })

        const reviewDiv = document.createElement("div");

        const questionLanguageClass =
          this.isObjectiveArabic ? 'rtl-text' : 'ltr-text';
        let correctAnswer = result.correctAnswer;

        if (Array.isArray(correctAnswer)) {
          // Join array items with comma or line breaks depending on your needs
          correctAnswer = correctAnswer.join('<br>');
        }

        reviewDiv.id = "repQues" + this.Question.id;
        reviewDiv.innerHTML = `

        <div class="start_exam_txt text-dark Ques ${questionLanguageClass}">
        ${label}${Q_Index + 1}: ${this.examService.escapeHtml(result.question)}
        
        </div>
  
        <div class="answers text-dark">
          ${!result.isAnswerCorrect ? `
            <div class="wrongAns">
              <img src="assets/images/wrong_ans.svg" class="Ans_imgIcon">
              ${this.t('exam.your_answer_incorrect')}
            </div>` : ''}
  
            ${correctAnswer !== null ? `
          <div class="rightAns text-dark">
            <img src="assets/images/right_ans.svg" class="Ans_imgIcon">
            ${this.t('exam.correct_answer')}:
            
           <div class="basedOnLang text-dark"> ${this.examService.escapeHtml(`${correctAnswer}`)} </div>
           
          </div>
  
  <br>
        ${result.feedback ? `
          <div class="rightAns text-dark">
         ${this.t('exam.explanation')} :
         <br>
         <div class="basedOnLang text-dark"> ${this.examService.escapeHtml(result.feedback)}</div>
        
          </div>`
              : ''}


          ` : this.t('exam.no_answer_provided')}
          `


        document.getElementById("report")?.appendChild(reviewDiv);

      };

      const objectiveId: number = Number(finalGrouped[objective][0].examObjectiveId ?? 0);

      //add to save report
      objectiveQuestion.push({
        "id": objectiveId,
        "objective": objective,
        "correct": correct,
        "total": total,
        "percent": percent,
        "questions": questionsToReport
      })
    }


    //time to add
    let time = new Date().toISOString();
    const date = new Date(time);
    time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
    time = time.replace('AM', this.t('exam.am')).replace('PM', this.t('exam.pm'));

    const anotherExamBtn = document.createElement('button');
    anotherExamBtn.type = 'button';
    anotherExamBtn.className = 'btn newExam btn-primary';
    anotherExamBtn.textContent = this.t('exam.BACK_TO_HOME_PAGE');

    anotherExamBtn.addEventListener('click', () => {
      this.router.navigateByUrl('');

    });


    document.getElementById("report")?.appendChild(anotherExamBtn);


    var divtime = document.createElement("div");
    divtime.className = "timestamp"
    divtime.innerHTML = `<div class="timestamp">${time}</div>`;
    document.getElementById("report")?.appendChild(divtime);

    let icon = document.createElement("img");
    icon.src = "../assets/images/Frame1.png";
    msgDiv.appendChild(icon);

    this.isDisabled = true;
    this.IsExamFinish = true;
    if (this.cameraCheckHandle) clearInterval(this.cameraCheckHandle);



    //save report
    var report = {
      "summary": {
        "id": this.examId,
        "total_questions": this.numOfQuestion,
        "correct_answers": numOfcorrectAnswers,
        "wrong_answers": this.numOfQuestion - numOfcorrectAnswers,
        "percent": Math.round((numOfcorrectAnswers / this.numOfQuestion) * 100)
      },
      "objectives": objectiveQuestion
    };

    var Ques = document.getElementById("repQues" + this.Question.id)!;
    this.alignQuestionbasedonLang(this.Question, Ques);

    this.sendReportToServer(report);



    this.scrollToBottom();
  }

  createAudioResponseUI(variable: string, error: any, boundQuestionId?: string | number, boundQuestionText?: string) {
    const container = document.getElementById('chat-content');
    const questionId = boundQuestionId ?? this.audioQuestionId ?? this.Question?.id ?? 'current-question';
    const questionText = boundQuestionText ?? this.audioQuestionText ?? this.Question?.text ?? '';
    const transcript = String(variable ?? '').trim();
    const existingWrapper = document.getElementById(`audio-response-${questionId}`);

    if (existingWrapper) {
      const existingTranscript = existingWrapper.dataset.transcript ?? '';

      if (existingTranscript === transcript) {
        return; // same text already shown for this question
      }

      existingWrapper.remove();
    }

    if (!error) {
      // Wrapper
      const wrapper = document.createElement('div');
      wrapper.id = `audio-response-${questionId}`;
      wrapper.className = 'response-audio ';
      wrapper.dataset.questionId = String(questionId);
      wrapper.dataset.transcript = transcript;

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
      const questionTextDiv = document.createElement('div');
      questionTextDiv.className = 'question-text';
      questionTextDiv.innerHTML = `<label>${(this.examService.escapeHtml(questionText) || this.examService.escapeHtml(this.Question?.text)) ?? ''}</label>`;
      content.appendChild(questionTextDiv);

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

      let acceptAns: boolean;

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
        const targetQuestion = (this.examData && Array.isArray(this.examData))
          ? (this.examData.find((q: any) => String(q.id) === String(questionId)) ?? this.Question)
          : this.Question;

        if (acceptAns) {
          this.userAnswer = variable;

          this.examService.displayMessage(variable, 'user', Timestamp);

          // store answers
          if (!this.problemInCorrect) {
            this.saveAnswer(targetQuestion);
          } else {
            this.retry_To_saveAnswer(targetQuestion);
          }
        } else {
          this.examService.displayMessage(
            this.t('exam.answer_again'),
            'bot',
            Timestamp
          );
        }

        finalSendBtn.disabled = true;
        noBtn.disabled = true;
        yesBtn.disabled = true;
      });

      setTimeout(() => {
        this.isTyping = false;
        this.cdr.detectChanges();
      }, 0);

      btnContainer.appendChild(btns);
      btnContainer.appendChild(finalSendBtn);

      /*
      var divtime = document.createElement("div");
      divtime.className = "timestamp";
      divtime.innerHTML = `<div class="timestamp">${time}</div>`;
      btnContainer.appendChild(divtime);
      */

      content.appendChild(btnContainer);

      // Add content to wrapper
      wrapper.appendChild(content);

      const icon = document.createElement('img');
      icon.src = '../assets/images/Frame1.png';
      wrapper.appendChild(icon);

      // Inject into DOM
      if (container) {
        container.appendChild(wrapper);
      }

      this.audioQuestionId = null;
      this.audioQuestionText = null;
    } else {
      this.isTyping = false;
      const timestamp = new Date().toISOString();

      if (error.error) {
        this.examService.displayMessage(
          this.translate.instant('exam.no_speech_detected'),
          'bot',
          timestamp
        );
      } else {
        this.examService.displayMessage(
          this.translate.instant('exam.answer_error'),
          'bot',
          timestamp
        );
      }
    }

    this.isTyping = false;
    this.cdr.detectChanges();
    this.scrollToBottom();
  }

  readQuestion(question: string) {
    this.examService.readQuestion(question);
  }


  handleKeyDown(event: KeyboardEvent) {

    if (event.key === 'Enter') {
      event.preventDefault(); //  Block newline

      const inputElement = document.getElementById("question-input") as HTMLInputElement;
      const text = inputElement?.value || '';


      if (text) {
        //  Trigger the click programmatically
        const sendBtn = document.querySelector('#askLink') as HTMLElement;
        sendBtn?.click();


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



  cleanText(text: any, type: any) {

    if (
      type == QuestionTypeEnum.DragAndDrop ||
      type == QuestionTypeEnum.Matching ||
      type == QuestionTypeEnum.Sequence ||
      type == QuestionTypeEnum.multiple_response
    ) {
      return text;
    }
    else {

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
          isAnswerCorrect: result?.isAnswerCorrect,
          video: result?.videoRef ?? null,
          feedback: result?.feedback ?? null,
          id: question.id,
          answerText: result?.answerText ?? null,
          examObjectiveId: question.exam_objective_id
        };
      });
    }

    return merged;
  }















  sendReportToServer(report: any) {
    if (this.sentReportToServer) return; // Report has already been sent to the server
    this.https.post(this.apiConfig.getUrl(this.apiConfig.endpoints.exam.setStudentAnswers(this.examId)), report).subscribe({
      next: (data) => {
        this.sentReportToServer = true

      },

      error: (err) => {
        console.error('Error:', err);
      },
    });

  }






  preventRefresh() {
    const refreshDisabledMsg = this.t('exam.refresh_disabled');
    document.addEventListener('keydown', function (e) {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault(); // ✅ stops refresh
        alert(refreshDisabledMsg);
      }
    });

    // 3. Block right-click reload menu (optional)
    /*document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  alert(this.t('exam.page_reload_not_allowed'));
});
    */


  }

  /******** Record and View Audio********/

  startRecord() {
    if (this.examResponses[0].some((r: any) => r == ResponseTypeEnum.VOICE_ANSWER)) {
      if (!this.IsExamFinish) {
        this.thereIsRecord = true;
        this.audioQuestionId = this.Question?.id ?? null;
        this.audioQuestionText = this.Question?.text ?? null;
        this.recorder.startRecording();
      }
    }
    else {
      this.toast.showError(this.t('exam.recording_not_allowed'))
    }


  }

  onRecordingCompleted(event: any) {
    this.audioFile = event.audioFile;
    this.audioUrl = event.audioUrl;
  }

  onRecordingDeleted() {
    this.audioUrl = null;
    this.thereIsRecord = false;
    this.audioQuestionId = null;
    this.audioQuestionText = null;
  }


  playSoundOnce(src: string, btn: HTMLButtonElement): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      // A sound is still playing — do not interrupt
      return;
    }

    this.currentAudio = new Audio(src);
    this.currentAudio.load();
    this.currentAudio.play();

    this.currentAudio.onended = () => {
      this.currentAudio = null;
      btn.disabled = false;
    };
  }

  onReturn() {
    if (!this.isExamActive) return;
    this.requestFullscreen();
    this.showViolationPopup = false;
  }

  onEnd() {
    this.isExamActive = false;
    try { this.CameraService.examActive = false; } catch (e) { }
    document.removeEventListener('fullscreenchange', this.onFullScreenChange);
    this.showViolationPopup = false;

    if (this.cameraCheckHandle) clearInterval(this.cameraCheckHandle);

    this.finishExamEarly();
  }

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

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (!this.isExamActive) return;
    if (
      (event.ctrlKey || event.metaKey) &&
      ['c', 'v', 'x', 'C', 'V', 'X'].includes(event.key)
    ) {
      event.preventDefault();
      this.showViolationPopup = true;
      this.addViolation('copy_and_paste_not_allowed', ViolationType.ContextMenu);
    }
  }

  @HostListener('window:blur')
  onBlur() {
    if (!this.isExamActive) return;

    if (document.hidden) return; // already handled by visibilitychange
    this.triggerViolation();
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (!this.isExamActive) return;
    event.preventDefault();
    this.addViolation('copy_and_paste_not_allowed', ViolationType.ContextMenu);
    this.showViolationPopup = true;
  }

  @HostListener('document:copy', ['$event'])
  onCopy(event: ClipboardEvent) {
    if (!this.isExamActive) return;
    event.preventDefault();
    this.addViolation('copy_and_paste_not_allowed', ViolationType.ContextMenu);
    this.showViolationPopup = true;
  }

  @HostListener('document:cut', ['$event'])
  onCut(event: ClipboardEvent) {
    if (!this.isExamActive) return;
    event.preventDefault();
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    if (!this.isExamActive) return;
    if (document.hidden) {
      this.triggerViolation();
    }
  }

  private triggerViolation() {
    if (this.violationHandled) return;

    this.violationHandled = true;

    this.handleViolation();

    setTimeout(() => {
      this.violationHandled = false;
    }, 1000);
  }

  private handleViolation() {
    if (!this.isExamActive) return;
    this.addViolation('left_exam_window', ViolationType.Visibility);
    this.showViolationPopup = true;
  }

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    if (!this.isExamActive) return;
    event.preventDefault();
    this.addViolation('right_click_not_allowed', ViolationType.ContextMenu);
    this.showViolationPopup = true;
  }

  addViolation(v: string, type: ViolationType) {
    if (this.IsExamFinish || this.isForceFinished) return;
    if (this.violations.length >= this.maxViolations) {
      this.finishExamEarly();;
      this.isBlocked = true;
      this.showViolationPopup = false;
      return;
    }
    this.counterViolation++;
    this.violations.push({
      type: type,
      message: v,
      timestamp: new Date(),
    });
  }

  get getVisibilityViolationsCount(): number {
    return this.violations.filter(v => v.type === ViolationType.Visibility).length;
  }

  ngOnDestroy() {
    document.removeEventListener('fullscreenchange', this.onFullScreenChange);
    if (this.cameraCheckHandle) clearInterval(this.cameraCheckHandle);
    if (this.violationSubscription) {
      this.violationSubscription.unsubscribe?.();
    }
    if (this.sub) {
      this.sub.unsubscribe?.();
    }
    this.CameraService.stopCamera();
  }

  private async checkCameraStatus() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.cameraOn = true;
      try { stream.getTracks().forEach(t => t.stop()); } catch { }
    } catch (e) {
      this.cameraOn = false;
      this.showViolationPopup = true;
      this.addViolation('camera_not_available', ViolationType.Visibility);
    }
    try { (window as any).requestAnimationFrame(() => { }); } catch { }
  }

  /**********************/

  handleDialogAction(confirmed: boolean) {
    this.showDialog = false;
    if (confirmed) {
      this.finishExamEarly();;

    } else {
      //console.log('❌ User canceled.');
    }
  }



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

  lines: { left: number, right: number, line: LeaderLine, questionId: number }[] = [];

  selectLeft(i: number, questionId: number) {

    this.selectedLeft = i;
    if (this.selectedRight !== null) {
      this.addMatch(this.selectedLeft, this.selectedRight, questionId);
      this.selectedLeft = null;
      this.selectedRight = null;
    }
  }

  selectRight(j: number, questionId: number) {
    this.selectedRight = j;

    if (this.selectedLeft !== null) {
      this.addMatch(this.selectedLeft, this.selectedRight, questionId);
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

    // Find if this exact pair already exists
    const existingMatchIndex = this.lines.findIndex(
      line =>
        line.left === leftIndex &&
        line.right === rightIndex &&
        line.questionId === questionId
    );

    if (existingMatchIndex !== -1) {
      // === REMOVE MATCH ===
      this.lines[existingMatchIndex].line.remove();
      this.lines.splice(existingMatchIndex, 1);

      if (leftIndicator) leftIndicator.textContent = '●';
      if (rightIndicator) rightIndicator.textContent = '●';

    } else {
      // === ADD OR REPLACE MATCH ===
      const conflictingIndex = this.lines.findIndex(
        l => l.right === rightIndex && l.questionId === questionId
      );
      if (conflictingIndex !== -1) {
        // Remove old line on this right side
        this.lines[conflictingIndex].line.remove();
        this.lines.splice(conflictingIndex, 1);
      }

      const line = new LeaderLine(leftEl, rightEl, {
        color: '#5156be',
        size: 3,
        startPlug: 'arrow3',
        endPlug: 'disc',
        path: 'straight'
      });

      line.show('draw', { duration: 1200, timing: 'ease-in-out' });

      // Add new match with questionId
      this.lines.push({ left: leftIndex, right: rightIndex, line, questionId });

      // Update indicators to check mark
      if (leftIndicator) leftIndicator.textContent = '✓';
      if (rightIndicator) rightIndicator.textContent = '✓';
    }

    // Reset selection
    this.selectedLeft = null;
    this.selectedRight = null;

    // Update userAnswer
    this.userAnswer = {};
    this.lines
      .filter(m => m.questionId === questionId)
      .forEach(match => {
        const rightText = this.rightItems[match.right];
        const leftText = this.leftItems[match.left];
        if (!this.userAnswer[rightText]) this.userAnswer[rightText] = [];
        if (!this.userAnswer[rightText].includes(leftText)) {
          this.userAnswer[rightText].push(leftText);
        }
      });

    // Update line positions on scroll
    const container = document.getElementById(`matching-${questionId}`);
    if (container) {
      container.addEventListener('scroll', () => {
        this.lines.forEach(lineData => lineData.line.position());
      });
    }
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

  finishExamEarly() {
    this.isForceFinished = true;
    this.IsExamFinish = true;
    this.isExamActive = false;
    this.finishExam();
  }

  applyLanguageDirection(container: HTMLElement, isArabic: boolean) {
    isArabic = this.isObjectiveArabic
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


  alignQuestionbasedonLang(question: any, container: HTMLElement) {

    const isArabic = this.isObjectiveArabic

    if (container.classList.contains('basedOnLang')) {
      container.classList.toggle('rtl-text', isArabic);
      container.classList.toggle('ltr-text', !isArabic);
    }

    container.querySelectorAll('.basedOnLang').forEach(el => {
      el.classList.toggle('rtl-text', isArabic);
      el.classList.toggle('ltr-text', !isArabic);
    });

    return this.getQuestionTypeLabel(question.type);
  }

}



