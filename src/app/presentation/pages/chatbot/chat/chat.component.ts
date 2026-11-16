import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation,AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import WaveSurfer from 'wavesurfer.js';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RecoderComponent } from 'src/app/shared/components/recoder/recoder.component';
import { Chat, ChatService } from 'src/app/shared/services/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None ,
  standalone: false
})
export class ChatComponent implements OnInit {
  @ViewChild('questionInput') questionInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('Chat_box') private scrollContainer!: ElementRef;
  @ViewChild('chatInput', { static: false }) chatInputRef!: ElementRef;
  @ViewChild('load', { static: false }) loadDiv!: ElementRef;
  //@ViewChild('waveform', { static: false }) waveformRef!: ElementRef;
  @ViewChild(RecoderComponent) recorder!: RecoderComponent;

private destroy$ = new Subject<void>();

  showExam=false;
  documentDir=document.body.dir || 'ltr';
  chats: Chat[] = [];
  currentChat: Chat | null = null;
  isDisabled = true;
  isTyping = true;
  subject = 'Math'; // Replace with your actual subject
  haveOldMsg=false;
  currentChat$ = this.chatService.currentChat$;
  courseName=null;
  subjectId:number=0
  subjectName:string=''
errorOccured:boolean=false
  /********Audio recording ************* */
  mediaRecorder!: MediaRecorder;
  audioUrl: string | null = null;
  isPlaying = false;
  audioFile: File | undefined;
  thereIsRecord=false;
status:string='loading'
currentUrl:string=''
  constructor(private chatService: ChatService,
    private translate: TranslateService,
    private cdRef: ChangeDetectorRef,private router: Router,
  
    private route: ActivatedRoute) {
          this.route.params.subscribe(params => {
          this.courseName=(params['courseName']); 
this.currentUrl=this.router.url;
 });
  }
  
    
  ngOnInit(): void {
   const chatIid=localStorage.getItem('currentChatId')||''

/*     this.route.params.subscribe(params => {
      var subjectId = Number(params['id']); 
      this.header = params['name'];
      this.chatService.getAssistantId(subjectId)   
    }); */

    this.handleLoading()

    // Subscribe to observables from the service
    this.chatService.currentChat$.pipe(takeUntil(this.destroy$)).subscribe((chat:any) => {
      this.currentChat = chat;
      
      this.haveOldMsg=(chat?.messages.length > 0)?true:false;
      if(this.currentChat?.id.toString())
        
      this.chatService.switchChat(chatIid);
    });

   
    
 
    
    this.chatService.isDisabled$.pipe(takeUntil(this.destroy$)).subscribe(isDisabled => {
     
      this.isDisabled = isDisabled;
    });
    
    this.chatService.isTyping$.pipe(takeUntil(this.destroy$)).subscribe(isTyping => {
      this.isTyping = isTyping;
  
    });
    


   
  }
  
  ngAfterViewInit()
  {
  
    this.scrollToBottom();
   
  }

  scrollToBottom()
  {
    this.scrollContainer.nativeElement.scrollTo({
      top: this.scrollContainer.nativeElement.scrollHeight,
      behavior: 'smooth'
    });
  
  }

  selectChat(chatId: string): void {
    this.chatService.setCurrentChat(chatId);
 
  }
  
  async askQuestion(optionQuestion?:string): Promise<void> {

    if(this.thereIsRecord)
    {
      if(this.audioUrl)
      {
        this.thereIsRecord=false;
        this.displayAudio(this.audioUrl);
        this.recorder.deleteRecording();
       
      }
      else{
          this.recorder.stopRecording();
      }
    
    }
    else
    {
      
      const inputElement = document.getElementById("question-input") as HTMLInputElement;
      const text = inputElement?.value || '';
  
      if (text.trim() != "" || optionQuestion != null)
      {
        this.chatService.askQuestion(optionQuestion);
      }
    
     
    }
  }
  
  askTranslatedQuestion(question:any) {
    const translated = this.translate.instant(question);
    this.askQuestion(translated);
  }

  sendAudio(audioFile:any): void {
    
      this.chatService.sendAudio(audioFile, this.subject);


  }
  
  displayAudio(url:any)
  {


    const playBtnId = `playBtn-${Date.now()}`;
    const waveformId = `waveform-${Date.now()}`;
    const timeId = `time-${Date.now()}`;
    let duration=0;

        const divMsg = document.createElement('div');
        divMsg.className = "msgs";
        
        // Create image element
        const img = document.createElement('img');
        img.src = "../../assets/images/user.svg";
        
        const contentElement = document.createElement('div');
        contentElement.className = "message user-message text-dark";
        contentElement.innerHTML = `
         <div class="audio-container" style="display: flex; align-items: center; gap: 10px; width: 100%;">
      
        <button class="playBtns" id="${playBtnId}">
                         <span class="play-icon"><img src="../../../assets/images/playsound.png"></span>
                         <span class="pause-icon"><img src="../../../assets/images/pause.png"></span>
                  </button>
            <div  class="wave" id="${waveformId}" style="width: 100%;"></div>
            </div>
            <div class="row" style="width:100%">
              <div class="col-3"> </div>
              <div class="col">
                <div class="time" id="${timeId}">${duration}</div>
              </div>
            <div>
        `;
        

        divMsg.appendChild(contentElement)
        
        divMsg.appendChild(img);

        
        document.getElementById('chat-content')!.appendChild(divMsg);
        
 
      
        // Toggle logic
          const playBtn = document.getElementById(playBtnId)!;
          const playIcon = playBtn.querySelector('.play-icon') as HTMLElement;
          const pauseIcon = playBtn.querySelector('.pause-icon') as HTMLElement;
        
      
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
            waveColor: '#999999',       // default background wave
            progressColor: '#000000', 
              barWidth: 1,
              interact: false,
              barGap: 3,
              barRadius: 3, 
              height: 30,
              responsive: true,
              barMinHeight:1,
              cursorWidth: 0 
          });
        
if (this.audioFile) {
  const audioUrl = URL.createObjectURL(this.audioFile);
  wavesurfer.load(audioUrl);
} else {
  console.error("No audio file found");
}

        wavesurfer.on('ready', () => {
          duration = wavesurfer.getDuration();
          const timeElement = document.getElementById(timeId);
          if (timeElement) {
            timeElement.textContent = this.formatTime(duration);
          }
        });

      // Optional: Toggle play/pause on button click
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
        pauseIcon.style.display ='none';
      });

        },100);

    this.scrollToBottom();    
    this.sendAudio(this.audioFile); 
  }

 
  // Additional UI helper methods can be added here
  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  
  TypingQuestionChange(): void {
    const inputElement = document.getElementById("question-input") as HTMLInputElement;
    const text = inputElement?.value || '';
  
    if (text.trim() === "" || this.isTyping === true) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }

  }

 




  public expandChatInput(extra = 10,lang:any) {
   
    const el = this.chatInputRef.nativeElement as HTMLElement;
    const currentWidth = el.offsetWidth;
    el.style.width = (currentWidth + extra) + 'px';
  
    if(lang == 'en')
    {
      const loadDiv = this.loadDiv.nativeElement as HTMLElement;
      const currentLeft = parseInt(loadDiv.style.left || '0', 10);
      loadDiv.style.left = '90px';
    }
  }

  public minusChatInput( val :any,lang:any) {
   
    const el = this.chatInputRef.nativeElement as HTMLElement;
    const currentWidth = el.offsetWidth;
    el.style.width = (currentWidth - val) + 'px';


    if(lang == 'en')
    {


      const loadDiv = this.loadDiv.nativeElement as HTMLElement;
      const currentLeft = parseInt(loadDiv.style.left || '0', 10);
      loadDiv.style.left = '230px';
    }
  }

  resetLoading()
  {
    const loadDiv = this.loadDiv.nativeElement as HTMLElement;
    const currentLeft = parseInt(loadDiv.style.left || '0', 10);
    loadDiv.style.left = '38px';
  
  }

  startRecord()
  {
    this.thereIsRecord=true;
    this.recorder.startRecording();
  }

  onRecordingCompleted(event:any) {
    this.audioFile=event.audioFile;
    this.audioUrl=event.audioUrl;
  }
  
  onRecordingDeleted() {
    this.audioUrl=null;
   this.thereIsRecord=false;
  }
  
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  sendOnEnter(event?: any) {
    if(this.status=='loading'||this.status=='error'||this.isTyping){
      return
    }
        event?.preventDefault(); // stops the newline
    
    this.askQuestion();    // your send logic
  }
get isSpecialSubject(): boolean {
  return !this.currentUrl.includes('studDashboard');
}

getSuggestKey(questionNumber: number): string {
  return this.isSpecialSubject
    ? `chat.suggestions.subject.${questionNumber}`
    : `chat.suggestions.student.${questionNumber}`;
}
handleLoading(){
    this.chatService.loadingHistory.pipe(takeUntil(this.destroy$)).subscribe(status => {
    this.status = status;
        this.cdRef.detectChanges();
  });
}
ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
}