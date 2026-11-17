import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';
import { Chat, ChatService } from 'src/app/shared/services/chat.service';


@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrl: './main-chat.component.scss',
  standalone:false
})
export class MainChatComponent {

 title = 'AI_Assistant';
  @ViewChild('agreeRadio') agreeRadio!: ElementRef<HTMLInputElement>;
  @ViewChild('submitBtn') submitBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('childRef') childComponent!: ChatComponent;

  isNavClosed=false;
  isAgree=false;
  chats$ = this.chatService.chats$;
  currentChat$ = this.chatService.currentChat$;
  currentChat: Chat | null = null;
  savedLang: any;
  isCollapsed = true;
  subjectId:number=0
  status:string='loading'
  private destroy$ = new Subject<void>();
  assisstantId!:string
  courseName:string=''
  loading:boolean=true;
  showMainPage:boolean=true;

  toggleSidenav() {

  }

constructor(private chatService:ChatService,private route:ActivatedRoute,private router: Router,
    private translate: TranslateService) {
        this.route.params.subscribe(params => {
/*       var subjectId = Number(params['id']); 
 *//* this.subjectId=subjectId */
 this.assisstantId = (params['id']); 
 this.courseName=(params['courseName']);
 const currentUrl = this.router.url;

 });



  }
  
  start()
  {
    this.isAgree=true;
     localStorage.setItem('agree','true')
  /*   if(!localStorage.getItem('agree')){
    } */
/*            this.loadChatsAfterAgree();
 */
   
  }


ngAfterViewInit(): void {
      //set Defalt language
      
      const myDiv = document.getElementById('chat-content');
      if(myDiv)
      {
        myDiv.scrollIntoView({ behavior: 'smooth' });
        myDiv.scrollTop = myDiv.scrollHeight;
      }

       this.AfterView1()

  }

  
  onRadioChange()
  {
        this.submitBtn.nativeElement.disabled = !this.agreeRadio.nativeElement.checked;
        localStorage.setItem("agree", "true");

    
  }

  /***************************** */

  ngOnInit(){

this.handleLoading()
    
     //aggrement in the start of website
     if (localStorage.getItem("agree") != null) {
      this.isAgree=true;

     }
     else
     this.isAgree=false;
        //aggrement in the start of website
    if (localStorage.getItem("agree") == null || localStorage.getItem("agree") == undefined) {
          this.isAgree=false;
          this.isCollapsed=true;
          this.status='idle'
    }
  




    // Subscribe to observables from the service
/*     this.chatService.loadChatSessions();
 */
    this.currentChat$.pipe(takeUntil(this.destroy$)).subscribe(chat => {
      this.currentChat = chat;
    });

 // Create a new chat if none exists
/*  this.chats$.subscribe(chats => {
  if (chats.length === 0) {
    this.createNewChat();
  } else {
    const chatIid=localStorage.getItem('currentChatId')||''
    this.chatService.setCurrentChat(chatIid);
   
  }
}); */
}

/*   switch(chatId: string) {
    const chatIid=localStorage.getItem('currentChatId')||''
    this.chatService.switchChat(chatIid);
  } */

  createNewChat(): void {
    
    const newChatId = this.chatService.createNewChat();
    this.chatService.setCurrentChat(newChatId);

    }


  deleteChat(chatId:any){
    this.chatService.deleteChat(chatId);
  }
  
  AfterView1(): void {
        this.chatService.assistantId = this.assisstantId;
        this.chatService.courseName = this.courseName
      const userId = this.chatService.userId;
      localStorage.setItem('currentChatId', `${this.chatService.assistantId}_${userId}_${this.courseName}`);

      // Load chats after assistant is ready
/*       if(localStorage.getItem('agree')){
 */      this.loadChatsAfterAgree();
   /*    } */
  }
private loadChatsAfterAgree(): void {

  this.loading = true;

  this.chatService
    .loadChatsFromStorage()
    .pipe(take(1))
    .subscribe({
      next: (chats) => {

        this.loading = false;


        if (chats.length > 0) {

          // ✅ History exists
          this.isAgree = true;
          localStorage.setItem('agree', 'true');

          const chatId =
            localStorage.getItem('currentChatId') || '';

          this.chatService.setCurrentChat(chatId);
          this.chatService.switchChat(chatId);

        } else {

          // ❌ No history
          if (localStorage.getItem('agree') === 'true') {

            // User already agreed → create first chat
            this.isAgree = true;
            this.createNewChat();

          } else {

            // No history + no agreement
            this.isAgree = false;
            this.isCollapsed = true;
            this.status = 'idle';
          }
        }
      },

      error: (err) => {
        this.loading = false;
        this.status = 'error';

        console.error('Failed to load chat history', err);
      }
    });
}



 

handleLoading(){
     this.chatService.loadingHistory.pipe(takeUntil(this.destroy$)).subscribe(status => {
    this.status = status
  });
}
ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
}
