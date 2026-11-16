import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { catchError, EMPTY, firstValueFrom, map, Observable, Subject, tap, throwError } from 'rxjs';
import WaveSurfer from 'wavesurfer.js';
import { TranslateService } from '@ngx-translate/core';
import { ApiConfig } from 'src/app/data/config';
import { ExamConfigPayload_AI } from 'src/app/presentation/models/generateexammodel';
import { CognitiveStyle, complexityLevels, examtypes, QuestionTypeEnum, ResponseTypeEnum } from 'src/app/domain/enums/exam-enums';
import { GetValidAccessTokenUseCase } from 'src/app/domain/business/GetValidAccessToken.business';
import { ToastService } from './toast-service';
import { Router } from '@angular/router';
/*
export interface Question {
  id: number;
  question: string;
  type:number;
  options: { [key: string]: string };
  correctAnswer: string;
  explanation: string;
  media?: {
    videoUrl?: any;
  };
}
*/
export interface QuestionAI {
  //new remote
  id:any;
  text: string;
  answers: [string ];
  matches:any,
  terms:any
  question_type:number;
  cognitive_style:string;
  correct_answer:string;
  difficulty:string;
  learning_unit_file:string;
  objective:string;
  options:any; 
}

export interface Question1 {
  
  id:any;
  text: string;
  answers: [string ];
  question_type:number;
  matches:any,
  terms:any
}

export interface Question {
  
  id:number;
  text: string;
  answers: [string ];
  question_type:string;
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private examData:any// Question1[] = []; // All questions
  private currentIndex = 0;
  mediaRecorder: MediaRecorder | undefined;
  audioChunks: Blob[] = [];
  staticExam:any=[
      {
        "id": 3,
        "examObjectiveId": 2,
        "answers": [
          "A. Facilitating communication between different hardware components",
          "B. Rendering graphics to a display",
          "C. Providing a platform to install the CPU",
          "D. Powering peripherals directly via an external power source"
        ],
        "objective": "Understand the components and functions of computer hardware",
        "question": "Which of the following is NOT a primary function of a motherboard?",
        "type": 1
      },
      {
        "id": 4,
        "examObjectiveId": 2,
        "answers": [
          "True",
          "False"
        ],
        "objective": "Understand the components and functions of computer hardware",
        "question": "True or False: The central processing unit (CPU) is also known as the main memory of the computer.",
        "type": 3
      },
      {
        "id": 5,
        "examObjectiveId": 2,
        "answers": [
          "Comprehensive answer ..."
        ],
        "objective": "Understand the components and functions of computer hardware",
        "question": "Discuss the impact of the GPU (Graphics Processing Unit) on modern computing tasks and elaborate on how its design differs from that of a CPU.",
        "type": 5
      },
      {
        "id": 6,
        "examObjectiveId": 3,
        "answers": [
          "laptop"
        ],
        "objective": "Comprehend the variety and specificity of computer types used in different contexts",
        "question": "The ________ is a portable computer designed primarily for mobile use, possessing a form that encompasses both the display and the keyboard.",
        "type": 6
      }
    ]
  ;

    
  // what user record .. audioToText
  private Recorded_answer = new Subject<[string, boolean, (string | number)?, string?]>();
  answer$ = this.Recorded_answer.asObservable();

 
  
  generateExam(numOfQuestion:any,type:any): Observable<Question[]> {
    //generate exam
  console.log(numOfQuestion,type,'gom')
   return this.http.post(this.apiConfig.getUrl(this.apiConfig.endpoints.exam.generateExam),
    {
      "num_questions": numOfQuestion,
      "question_type": type
    }
   ).pipe(
      tap( (data:any) => {
//        localStorage.setItem("exam",JSON.stringify(data.exam.exam.questions)) 
  //      this.examData = data.exam.exam.questions
      },(Error)=>{
        console.log(Error)
      }
    ) // Store the data
    );
    
  }
    generateExamV2(payload:ExamConfigPayload_AI): Observable<Question[]> {
    //generate exam
  
   return this.http.post(this.apiConfig.getUrl(this.apiConfig.endpoints.exam.generateExam),payload
   ).pipe(
      tap( (data:any) => {
        localStorage.setItem("exam",JSON.stringify(data.exam)) 
  //      this.examData = data.exam.exam.questions
      },(Error)=>{
        console.log(Error)
      }
    ) // ✅ Store the data
    );
    
  }



 
    constructor(private toastservice:ToastService ,private router:Router,private http: HttpClient,private translate:TranslateService, private readonly apiConfig: ApiConfig,private getValidToken: GetValidAccessTokenUseCase) {
    
    }
  
    getExam(examId:number){

      this.currentIndex=0; 

      return this.http.get(this.apiConfig.getUrl(this.apiConfig.endpoints.exam.getExam(examId)))  .pipe(
map((data: any) => {
  data.exam_type=examtypes[data.exam_type as keyof typeof examtypes]
   data.complexity_level =
    complexityLevels[
      data.complexity_level as keyof typeof complexityLevels
    ];
 
    data.response_types=(data.response_types ??[]).map((type:string)=>(
        ResponseTypeEnum[type as keyof typeof ResponseTypeEnum]
 ))
  data.questions = (data.questions??[]).map((question: any) => ({
    ...question,
    question_type:
      QuestionTypeEnum[
        question.question_type as keyof typeof QuestionTypeEnum
      ],
      cognitive_style :
    CognitiveStyle[
      question.cognitive_style as keyof typeof CognitiveStyle
    ]
  }));

  return data;
    }),

    tap((data: any) => {

      this.examData = data.questions;
    }),

    catchError((error) => {
        this.toastservice.showError(error)
        this.router.navigate([''])
         return EMPTY; // Stop
    })
  )
        
    }
  



    getCurrentQuestion(currentIndex:any): QuestionAI {
      return this.examData[currentIndex];
    }

    goToNextQuestion(): QuestionAI | null {

      this.currentIndex=this.currentIndex+1;
      

      if(this.currentIndex < this.examData.length)
      {
        return  this.examData[this.currentIndex];
      }
      else 
      return  null;
    }

   
    // Function to handle recording
    async  startRecording(): Promise<void> {

      const stopIcon = document.getElementById("stoprecordIcon") as HTMLElement;
      const recordIcon = document.getElementById("recordIcon") as HTMLElement;
      const recordButton = document.getElementById("recordButton") as HTMLButtonElement;
      const stopButton = document.getElementById("stopButton") as HTMLButtonElement;

      if (stopIcon && recordIcon) {
        stopIcon.style.display = "block";
        recordIcon.style.display = "none";
      }

      try {
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];


        this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {

          console.log(this.audioChunks);
          const audioBlob = new Blob(this.audioChunks);
          const audioFile = new File([audioBlob], 'recording.webm');
            this.sendAudio(audioFile,"Math");
        };

        //this.togglePlaceholder(); // You must ensure this function exists and is defined elsewhere

        this.mediaRecorder.start();

        if (recordButton) recordButton.disabled = true;
        if (stopButton) stopButton.disabled = false;

      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Could not start audio recording.");
      }
    }

    stopRecording(): void {
      
      const stopIcon = document.getElementById("stoprecordIcon") as HTMLElement;
      const recordIcon = document.getElementById("recordIcon") as HTMLElement;
      const helloDiv = document.getElementById("helloDiv") as HTMLElement;
      const recordButton = document.getElementById("recordButton") as HTMLButtonElement;
      const stopButton = document.getElementById("stopButton") as HTMLButtonElement;

      if (stopIcon) stopIcon.style.display = "none";
      if (recordIcon) recordIcon.style.display = "block";
      if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
        this.mediaRecorder.stop();
      }

      if (helloDiv) helloDiv.style.display = "none";
      if (recordButton) recordButton.disabled = false;
      if (stopButton) stopButton.disabled = true;
    }


    // Send audio message
    async sendAudio(audioFile: File, subject: string, questionId?: string | number, questionText?: string): Promise<void> {
  
 
    const formData = new FormData();
  
    formData.append('audio', audioFile); // e.g., hello.mp3

    //  const response = { audio_path: '/audioToText', question: 'What is this?' }
   

     const response = await this.http.post(this.apiConfig.getAiUrl(this.apiConfig.endpoints.exam.audioToText), formData)
     .subscribe((response:any)=>{
      
      
      if (response) {
       this.sendAnswer(response.transcription, false, questionId, questionText);
      }

     },((error:any)=>{
      this.sendAnswer(error.error_code, error, questionId, questionText);
     })
     )
    }   

   
    // Display message
    displayMessage(content: string | SafeHtml | string[], sender: 'user' | 'bot', timestamp: string,isTyping: boolean = false): void {
      // Implementation would go here - similar to your original code
      // This would create and append DOM elements for the message
      // Create message container
  
      
      const divMsg = document.createElement('div');
   
      
      // Create image element
      const img = document.createElement('img');
      let classTimename;
      
          if(sender == 'user')  
          {
            classTimename="timestamp1";
              img.src ="/assets/images/user.svg"
              divMsg.className = "msgs user text-dark";
          }
          else
          {
              classTimename="timestamp";
              img.src ="/assets/images/Frame1.png"; 
              divMsg.className = "msgs bot text-dark";
          }
  
      divMsg.appendChild(img);
      
      const contentElement = document.createElement('div');
      contentElement.className = `message ${sender}-message`;
      if (Array.isArray(content)) {
        // Handle array of strings - display each item on a new line
        const formattedContent = content.map((item, index) => `${index + 1}. ${item}`).join('<br>');
        contentElement.innerHTML = formattedContent;
      } else if (typeof content === 'string') {
      
        contentElement.innerHTML = `<div>${this.escapeHtml(content)}</div>`;
        
      } else {
        // Handle SafeHtml
        const div = document.createElement('div');
        div.innerHTML = content.toString();
        contentElement.appendChild(div);
      }
      
      contentElement.classList.add("basedOnLang")
      const timeElement = document.createElement('div');
      if(timestamp != "null")
      {
        timeElement.className = classTimename;
        const date = new Date(timestamp);

      
        timeElement.textContent = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit'
        });
        
    const isArabiclang = this.translate.currentLang === 'ar';


    if (isArabiclang) {
      timeElement.textContent = timeElement.textContent
        .replace('AM', 'صباحًا')
        .replace('PM', 'مساءً');
    }
  
      
        // Extract plain text (you can refine this)
        const text = contentElement.textContent?.trim() || '';
        const isArabic = /[\u0600-\u06FF]/.test(text);

        // Apply alignment
        contentElement.style.textAlign = isArabic ? 'right' : 'left';
       
        divMsg.appendChild(contentElement).append(timeElement);
        
      }
      
      
      document.getElementById('chat-content')!.appendChild(divMsg);
    }

     convertToQuestionTypeString(value: number): string {
      // Get the enum key (string) from the numeric value
      const enumKey = QuestionTypeEnum[value];
      if (enumKey) {
      
        return enumKey; // fallback to enum key if no metadata
      }
      return 'Essay'; // default value
    }
  
     convertToCognitiveStyleString(value: number | string): string {
      
      if (typeof value === 'number') {
        // Get the enum key (string) from the numeric value
        const enumKey = CognitiveStyle[value];
        if (enumKey) {
          // Convert to proper case (e.g., "Create", "Evaluate")
          return enumKey.charAt(0).toUpperCase() + enumKey.slice(1).toLowerCase();
        }
      } else if (typeof value === 'string') {
        // If it's already a string, just ensure proper case
        const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        if (Object.keys(CognitiveStyle).includes(formattedValue)) {
          return formattedValue;
        }
      }
      return 'Understand'; // default value
    }
     convertToComplexityLevelsString(value: number | string): string {
      
      if (typeof value === 'number') {
        // Get the enum key (string) from the numeric value
        const enumKey = complexityLevels[value];
        if (enumKey) {
          // Convert to proper case (e.g., "Create", "Evaluate")
          return enumKey.charAt(0).toUpperCase() + enumKey.slice(1).toLowerCase();
        }
      } else if (typeof value === 'string') {
        // If it's already a string, just ensure proper case
        const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        if (Object.keys(complexityLevels).includes(formattedValue)) {
          return formattedValue;
        }
      }
      return 'Easy'; // default value
    }

    correctExam(QuestionWithAnswer: any): Observable<any> {
      
      return  this.http.post(this.apiConfig.getAiUrl(this.apiConfig.endpoints.exam.correct_answer), QuestionWithAnswer)
       // return  this.http.post("hfgh", QuestionWithAnswer)
 
    }
    

    private AudioisPlaying = false;
    private currentAudio: HTMLAudioElement | null = null;
    
    readQuestion(text: string) {
      
      if (this.AudioisPlaying) {
        return; // ✅ Prevent overlapping
      }
    
      this.AudioisPlaying = true;
    
     // const questiontxt = { "text":text };
    
      var lang= (/[\u0600-\u06FF]/.test(text))?'ar':'en';
      var body={
                  "text": text,
                  "language": lang,
                  "chunk_size":40
                };


      this.streamAndPlayTTS(body, text);
    }
    

 async streamAndPlayTTS(body: any, text: string) {
  try {
    this.AudioisPlaying = true;

    // أوقف أي TTS سابق
    window.speechSynthesis.cancel();
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    // إنشاء MediaSource و Audio
    const mediaSource = new MediaSource();
    const audio = new Audio();
    audio.src = URL.createObjectURL(mediaSource);
    audio.autoplay = true;
    this.currentAudio = audio;

    audio.onended = () => {
      this.AudioisPlaying = false;
      this.currentAudio = null;
    };

    audio.onerror = () => {
      throw new Error('Audio playback error');
    };

    mediaSource.addEventListener('sourceopen', async () => {
      const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');

      // queue لتخزين chunks مؤقتاً
      const queue: any[] = [];

      // دالة لمعالجة queue بشكل متسلسل
      const appendNext = () => {
        if (queue.length === 0 || sourceBuffer.updating) return;
        const chunk = queue.shift()!;
        sourceBuffer.appendBuffer(chunk);
      };

      // عند انتهاء append الحالي، حاول إضافة chunk التالي
      sourceBuffer.addEventListener('updateend', () => {
        appendNext();
      });
     const tokenService = this.getValidToken;
      let accessToken = '';

      const ensureAccessToken = async () => {
        accessToken = await firstValueFrom(tokenService.execute()) ?? '';
        return accessToken;
      };
      await ensureAccessToken();
      const response = await fetch(this.apiConfig.getAiUrl(this.apiConfig.endpoints.exam.streamtts), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 
          'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify(body)
      });

      if (!response.body) throw new Error('No streaming body');

      const reader = response.body.getReader();

      // قراءة كل chunk وإضافته إلى queue
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        queue.push(value); // ضع chunk في queue
        appendNext();      // حاول إضافته إذا كان SourceBuffer جاهز
      }

      // انتظر حتى يتم تفريغ كل الـ queue قبل إنهاء الستريم
      await new Promise<void>(resolve => {
        const checkQueue = () => {
          if (!sourceBuffer.updating && queue.length === 0) return resolve();
          setTimeout(checkQueue, 20);
        };
        checkQueue();
      });

      mediaSource.endOfStream();
    });

  } catch (err) {
    console.error('Streaming TTS error:', err);
    this.AudioisPlaying = false;
    this.fallbackTTS(text);
  }
}



    // 🔹 Fallback: Use browser TTS with end-event to unlock
    private fallbackTTS(text: string) {
      if (this.AudioisPlaying) return;
    
      this.AudioisPlaying = true;
      window.speechSynthesis.cancel();
    
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1;
      utterance.pitch = 1;
    
      utterance.onend = () => {
        this.AudioisPlaying = false;
      };
    
      window.speechSynthesis.speak(utterance);
    }
    

    sendAnswer(text: string, IsThereError: boolean, questionId?: string | number, questionText?: string) {
      this.Recorded_answer.next([text, IsThereError, questionId, questionText]);
    }

    displayAudioInExam(url: any, file: any, questionId?: string | number, questionText?: string) {
      const playBtnId = `playBtn-${Date.now()}`;
      const waveformId = `waveform-${Date.now()}`;
      const timeId = `time-${Date.now()}`;
      let duration = 0;
  
      const divMsg = document.createElement('div');
      divMsg.className = "msgs alignright";
      
      const img = document.createElement('img');
      img.src = "../../assets/images/user.svg";
      
      const contentElement = document.createElement('div');
      contentElement.className = "message user-message ";
      contentElement.innerHTML = `
        <div class="audio-container" style="display: flex; flex-direction: row-reverse; align-items: center; gap: 10px; width: 100%;">
          <button class="playBtns" id="${playBtnId}">
            <span class="play-icon"><img src="../../../assets/images/playsound.png"></span>
            <span class="pause-icon"><img src="../../../assets/images/pause.png"></span>
          </button>
          <div class="wave" id="${waveformId}" style="width: 100%;"></div>
        </div>
        <div class="row" style="width:100%">
          <div class="offset-2 col">
            <div class="time" id="${timeId}">${duration}</div>
          </div>
        <div>
      `;
      
      const timeElement = document.createElement('div');
      timeElement.className = 'timestamp1';
      const timestamp = new Date().toISOString();
      const date = new Date(timestamp);
      timeElement.textContent = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      });
      
      const isArabiclang = this.translate.currentLang === 'ar';
      if (isArabiclang) {
        timeElement.textContent = timeElement.textContent
          .replace('AM', 'صباحًا')
          .replace('PM', 'مساءً');
      }
        
      divMsg.appendChild(contentElement).append(timeElement);
      divMsg.appendChild(img);
      document.getElementById('chat-content')!.appendChild(divMsg);

      let isPlaying = false;

      setTimeout(() => {
        const waveformElement = document.getElementById(waveformId) as HTMLElement;
        const playBtn = document.getElementById(playBtnId) as HTMLElement;
      
        if (!waveformElement || !playBtn) {
          console.error('Waveform or Play Button not found in DOM');
          return;
        }
      
        const wavesurfer = WaveSurfer.create({
          container: waveformElement,
          waveColor: '#999999',
          progressColor: '#000000',
          barWidth: 1,
          interact: false,
          barGap: 3,
          barRadius: 3,
          height: 30,
          responsive: true,
          barMinHeight: 1,
          cursorWidth: 0
        });

        let audioUrl = "";
        if (file instanceof Blob || file instanceof File) {
          audioUrl = URL.createObjectURL(file);
        } else if (typeof url === "string") {
          audioUrl = url;
        } else {
          return;
        }

        wavesurfer.load(audioUrl);

        wavesurfer.on('ready', () => {
          duration = wavesurfer.getDuration();
          const timeElem = document.getElementById(timeId);
          if (timeElem) {
            timeElem.textContent = this.formatTime(duration);
          }
        });

        const playIcon = playBtn.querySelector('.play-icon') as HTMLElement;
        const pauseIcon = playBtn.querySelector('.pause-icon') as HTMLElement;

        playBtn.addEventListener('click', () => {
          isPlaying = !isPlaying;
          if (isPlaying) {
            wavesurfer.play();
          } else {
            wavesurfer.pause();
          }
          playIcon.style.display = isPlaying ? 'none' : 'inline';
          pauseIcon.style.display = isPlaying ? 'inline' : 'none';
        });

        wavesurfer.on('finish', () => {
          playIcon.style.display = 'inline';
          pauseIcon.style.display = 'none';
        });
      }, 50);

      this.sendAudio(file, "", questionId, questionText);
    }



      formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
private applyTextDirection(element: HTMLElement, text: string): void {
  const cleanText = text.trim();
  const isArabic = /^[^A-Za-z]*[\u0600-\u06FF]/.test(cleanText);

  element.style.direction = isArabic ? 'rtl' : 'ltr';
  element.style.textAlign = isArabic ? 'right' : 'left';
}
escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
}