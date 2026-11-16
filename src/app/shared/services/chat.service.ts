import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { marked } from 'marked';
import { environment } from 'src/environments/environment';
import { StreamService } from './stream.service';
import { ApiConfig } from 'src/app/data/config/api.config';
import DOMPurify from 'dompurify';
import renderMathInElement from 'katex/dist/contrib/auto-render';
import { GetValidAccessTokenUseCase } from 'src/app/domain/business/GetValidAccessToken.business';


export interface ChatMessage {
  content: string | SafeHtml;
  sender: 'user' | 'bot';
  timestamp: string;
  chatId: string;
}

export interface Chat {
  id: string;
  name: string;
  messages: ChatMessage[];
  previousQuestion?: string;
  created?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  mediaRecorder: MediaRecorder | undefined;
  audioChunks: Blob[] = [];
  URL = environment.aiUrl;
  private currentChatId: string = '';
  private chats: Chat[] = [];

  // Observables for reactive UI updates
  private isDisabledSubject = new BehaviorSubject<boolean>(true);
  isDisabled$ = this.isDisabledSubject.asObservable();


  private isTypingSubject = new BehaviorSubject<boolean>(false);
  isTyping$ = this.isTypingSubject.asObservable();

  private chatsSubject = new BehaviorSubject<Chat[]>([]);
  chats$ = this.chatsSubject.asObservable();

  private currentChatSubject = new BehaviorSubject<Chat | null>(null);
  currentChat$ = this.currentChatSubject.asObservable();

  public loadingHistory = new BehaviorSubject<'loading' | 'success' | 'error' | 'idle'>('loading');
  public audioUrl = new BehaviorSubject<string>('');


  assistantId: any;
  courseName:string='';
  isPlaying: boolean = false;
  currentSoundIcon: HTMLElement | null = null;
  currentAudio: HTMLAudioElement | null = null;
  isloading: boolean = false;

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private streamService:StreamService,
    readonly apiConfig:ApiConfig,
     private getValidToken: GetValidAccessTokenUseCase
  ) {

    //this.loadChatsFromStorage();


  }

  // Load chats from localStorage
loadChatsFromStorage(): Observable<Chat[]> {
  this.loadingHistory.next('loading');

  this.currentChatId = localStorage.getItem('currentChatId') || '';

  const payload = {
    course_name: this.courseName,
    collection_id: this.assistantId,
    user_id: (
      JSON.parse(sessionStorage.getItem('currentUser') || '{}').id
    ).toString()
  };

  return this.http.get<any>(
    this.apiConfig.getAiUrl(
      this.apiConfig.endpoints.chat.getHistory
    ),
    {
      params: payload
    }
  ).pipe(
    map(res => {
      const chats = res.messages || [];

      this.chats = chats;
      this.chatsSubject.next(chats);

      this.loadingHistory.next('success');

      return chats;
    })
  );
}

  // Save chats to localStorage
  private saveChatsToStorage(): void {
    localStorage.setItem('chats', JSON.stringify(this.chats));
  }

  // Set current chat
  setCurrentChat(chatId: string): void {
    this.currentChatId = localStorage.getItem('currentChatId') || '';
    const currentChat = this.chats.find(c => c.id === chatId) || null;
    this.currentChatSubject.next(currentChat);



  }

  // Create a new chat
  createNewChat(): string {
    const newChatId = Date.now().toString();
    const newChat: Chat = {
      id: newChatId,
      name: 'New Chat',
      messages: [],
      created: new Date()
    };

    const container = document.getElementById("chat-content");

    // Clear old messages except helloDiv
    Array.from(container!.children).forEach(child => {
      if (child.id !== "helloDiv") {
        child.remove();
      }
    });

    this.chats.push(newChat);
    this.saveChatsToStorage();
    this.chatsSubject.next(this.chats);
    this.switchChat(newChatId)
    this.setCurrentChat(newChatId);



    return newChatId;
  }

  // Generate chat name
  async generateChatName(firstMessage: string) {

  }



  // Save message to storage
  saveMessage(sender: 'user' | 'bot', content: string, timestamp: string, chatId: string): void {
    const chat = this.chats.find(c => c.id === chatId);

    if (chat) {
      chat.messages.push({ sender, content, timestamp, chatId });
      this.saveChatsToStorage();
      this.chatsSubject.next(this.chats);


    }
  }



  async sendAudio(audioFile: File, subject: string): Promise<void> {
    this.setUIState(true, true);

    const formData = new FormData();
    formData.append('audio', audioFile, audioFile.name); // e.g., hello.mp3


    try {

      const response = await this.http.post<{ audio_path: string, transcription: string }>(this.apiConfig.getAiUrl(this.apiConfig.endpoints.chat.audioToText), formData).toPromise();

      if (response) {
        //  this.displayAudio(response.audio_path);
        this.audioUrl.next(response.audio_path)
        await this.askQuestion(response.transcription, true);
      }
    } catch (error) {
      console.error(error);
      this.addMessage(this.translate.instant('No speech detected in the audio'), 'bot', this.currentChatId);
    }
  }


  // Display audio message
  displayAudio(path: string): void {
    // Create message container

    const divMsg = document.createElement('div');
    divMsg.className = "msgs text-dark";

    // Create image element
    const img = document.createElement('img');
    img.src = "../../assets/images/user.svg";

    const contentElement = document.createElement('div');
    contentElement.className = "message user-message text-dark";
    contentElement.innerHTML = `

      <audio controls class='audio-response'>
        <source [src]="${environment.apiUrl + path}" type="audio/mpeg">
      </audio>
      
    `;


    const timeElement = document.createElement('div');
    timeElement.className = 'timestamp';
    const timestamp = new Date().toISOString();
    const date = new Date(timestamp);
    timeElement.textContent = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });

    let lang = localStorage.getItem("lang")
    if (lang == "ar") {
      timeElement.textContent = timeElement.textContent
        .replace('AM', 'صباحًا')
        .replace('PM', 'مساءً');
    }
    else {
      timeElement.textContent = timeElement.textContent
        .replace('صباحًا', 'AM')
        .replace('مساءً', 'PM');
    }

    divMsg.appendChild(contentElement).append(timeElement);
    divMsg.appendChild(img);

    const helloDiv = document.getElementById("helloDiv") as HTMLElement;
    if (helloDiv) helloDiv.style.display = "none";

    document.getElementById('chat-content')!.appendChild(divMsg);

    const myDiv = document.getElementById('chat-content')!;
    myDiv.scrollIntoView({ behavior: 'smooth' });
    myDiv.scrollTop = myDiv.scrollHeight;
  }




  // Ask a question
  async askQuestion(optionQuestion?: string, thereisRecord = false): Promise<void> {


    const inputElement = document.getElementById('question-input') as HTMLTextAreaElement;

    if (inputElement) {
      inputElement.style.height = "auto";
    }

    this.setUIState(true, true);

    let question: string;
    if (optionQuestion === undefined) {
      if (!inputElement) return;

      question = inputElement.value.trim();
      if (!question) return;
      inputElement.value = '';
    } else {
      question = optionQuestion;
    }

    const chat = this.chats.find(c => c.id === this.currentChatId);

    // Generate chat name from first msg if it's a new chat
    if (chat?.name == "New Chat") {

      //chat!.name=question;
      this.saveChatsToStorage();

      /*const header = document.getElementById("chatheader");
        
        if(header)
          header.innerText=chat.name;
      */
    }


    const userTimestamp = new Date().toISOString();
    this.saveMessage('user', question, userTimestamp, this.currentChatId);
    this.displayMessage(question, 'user', userTimestamp, this.currentChatId);


    try {

      var req = {
        "question": question,
        "course_name":this.courseName,
        "collection_id": this.assistantId,
        "user_id":(JSON.parse(sessionStorage.getItem('currentUser') || '{}').id).toString()
      }
      // Show a loading image instead of "..."
      const loadingId = `loading-${Date.now()}`;
      this.displayMessage(
        `<img id="${loadingId}" src="../../../assets/images/icons8-dots-loading.gif" alt="Loading..." class="bot-loading loadingimg" />`,
        'bot',
        '',
        this.currentChatId,
        true,
        true
      );
 
  
        this.streamService.streamResponse(`${this.apiConfig.getAiUrl(this.apiConfig.endpoints.chat.stream)}`, req).subscribe({
          next: (response: any) => {

                    this.beginBotStream();
                           //  Remove the "typing..." message and bot image
          const loadingDiv = document.querySelector('.bot-loading');
          if (loadingDiv && loadingDiv.parentElement) {
            loadingDiv.parentElement.removeChild(loadingDiv);
          }
            this.parseStreamResponse(response);
          },
          error: (err: any) => {
                     //  Remove the "typing..." message and bot image
          const loadingDiv = document.querySelector('.bot-loading');
          if (loadingDiv && loadingDiv.parentElement) {
            loadingDiv.parentElement.removeChild(loadingDiv);
          }
            this.endBotStream(true);
            this.addMessage( this.translate.instant('chat.connection_error'), 'bot', this.currentChatId);
            this.isTypingSubject.next(false);
            if (inputElement && !inputElement.value.trim()) this.isDisabledSubject.next(false);
          },
          complete: () => {
            this.endBotStream();
          }
        })
    } catch (error) {
      console.error('Error connecting to AI teacher:', error);
      document.getElementById("recordIcon")!.style.display = "block";
      document.getElementById("loadrecord")!.style.display = "none";
      this.addMessage( this.translate.instant('chat.connection_error'), 'bot', this.currentChatId);
    }
  }

  // Add message
  async addMessage(content: any, sender: 'user' | 'bot', chatId: string): Promise<void> {
    this.setUIState(false, false);
    console.log('video dkhal', content)

    let text = '';
    let videoSrc = '';

    // Handle when content is either a string or object
    if (typeof content === 'string') {
      text = content;
    } else {
      text = content.responseText || '';
      videoSrc = content.videoReference || '';
    }
    /*     // Sanitize HTML content
       const parser = new DOMParser();
       const doc = parser.parseFromString(content, 'text/html'); */


    //const text = doc.querySelector('.text-answer')?.innerHTML.trim() || '';
    /*    const videoSrc = doc.querySelector('video source')?.getAttribute('src') || ''; */
    const html = await marked.parse(text); // await the Promise 
    // Build full HTML string
    let fullAnswerHtml = `
            <div class="text-answer">${html}</div>
            ${videoSrc ? `
              <div class="video-response">
                <video controls>
                  <source src="${this.URL + videoSrc}">
                </video>
              </div>` : ''}
            `;
    // Generate a timestamp
    const timestamp = new Date().toISOString();

    // Save the message to localStorage
    // this.saveMessage(sender, content, timestamp, chatId);

    // Display the message with sender-specific styling

    this.displayMessage(fullAnswerHtml, sender, timestamp, chatId, true);


  }

  // Display message
  async displayMessage(content: string | SafeHtml, sender: 'user' | 'bot', timestamp: string, chatId: string, isHtml: boolean = false, isTyping: boolean = false): Promise<void> {
    // Implementation would go here - similar to your original code
    // This would create and append DOM elements for the message
    // Create message container


    const divMsg = document.createElement('div');
    divMsg.className = "msgs text-dark";
    if (isTyping) divMsg.classList.add("bot-loading");

    // Create image element
    const img = document.createElement('img');

    let classTimename;
    if (sender == 'user') {
      classTimename = "timestamp";
      img.src = "../../assets/images/user.svg"
    }
    else {
      classTimename = "timestamp1 text-dark";
      divMsg.style.flexDirection = "row";
      divMsg.style.margin = "0 auto 0 0";
      img.src = "../assets/images/Frame1.png";
      divMsg.appendChild(img);

    }


    const contentElement = document.createElement('div');
    contentElement.className = `message ${sender}-message`;

    /*     if (typeof content === 'string') {
    const html = await marked.parse(content); // await the Promise 
         contentElement.innerHTML = html;
        } else {
          // Handle SafeHtml
          const div = document.createElement('div');
          const html = await marked.parse(content.toString()); // await the Promise 
          div.innerHTML = html;
          contentElement.appendChild(div);
        } */
    if (isHtml) {
      // 👇 Directly render the HTML without escaping it
      const x = await marked.parse(content as string);
      contentElement.innerHTML = content as string;
    } else {
      const html = await marked.parse(content as string);
      contentElement.innerHTML = html;
    }

    // Render math equations using KaTeX
    this.renderMath(contentElement);

    // Extract plain text 
    const text = contentElement.textContent?.trim() || '';
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
const englishChars = (text.match(/[A-Za-z]/g) || []).length;

const isArabic = arabicChars > englishChars;

    // Apply alignment
    contentElement.style.textAlign = isArabic ? 'right' : 'left';
    contentElement.style.direction = isArabic ? 'rtl' : 'ltr';

    const timeElement = document.createElement('div');
    timeElement.className = classTimename;


    const date = new Date(timestamp);
    timeElement.textContent = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
    
    let lang = localStorage.getItem("lang")
    if (lang == "ar") {
      timeElement.textContent = timeElement.textContent
        .replace('AM', 'صباحًا')
        .replace('PM', 'مساءً');
    }
    else {
      timeElement.textContent = timeElement.textContent
        .replace('صباحًا', 'AM')
        .replace('مساءً', 'PM');
    }

    if(!isTyping){
        const sound = this.createSoundIcon(text)
        contentElement.appendChild(sound);
      }
    divMsg.appendChild(contentElement).append(timeElement);
    if (sender == "user") divMsg.appendChild(img);


    const helloDiv = document.getElementById("helloDiv") as HTMLElement;
    if (helloDiv) helloDiv.style.display = "none";



    document.getElementById('chat-content')!.appendChild(divMsg);

    const myDiv = document.getElementById('chat-content')!;
    myDiv.scrollIntoView({ behavior: 'smooth' });
    myDiv.scrollTop = myDiv.scrollHeight;
  }

  public renderMath(element: HTMLElement): void {
    if (!element) return;
    try {
      renderMathInElement(element, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false
      });
    } catch (e) {
      console.error('KaTeX auto-render error:', e);
    }
  }

  // --- Streaming helpers for ChatGPT-like incremental rendering ---
  private streamingBuffer: string = '';
  private streamingContentElement: HTMLElement | null = null;
  private streamingMessageContainer: HTMLElement | null = null;
  private streamingTimestamp: string = '';
  private isStreaming: boolean = false;
  private jsonBuffer: string = ''; // Buffer for incomplete JSON chunks

  private beginBotStream(): void {
    if (this.isStreaming) return;

    this.isStreaming = true;
    this.streamingBuffer = '';
    this.streamingTimestamp = new Date().toISOString();

    const divMsg = document.createElement('div');
    divMsg.className = 'msgs text-dark';

    const img = document.createElement('img');
    const classTimename = 'timestamp1';
    divMsg.style.flexDirection = 'row';
    divMsg.style.margin = '0 auto 0 0';
    img.src = '../assets/images/Frame1.png';
    divMsg.appendChild(img);

    const contentElement = document.createElement('div');
    contentElement.className = 'message bot-message text-dark';

    const timeElement = document.createElement('div');
    timeElement.className = classTimename;
    const date = new Date(this.streamingTimestamp);
    timeElement.textContent = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    let lang = localStorage.getItem('lang');
    if (lang == 'ar') {
      timeElement.textContent = (timeElement.textContent || '')
        .replace('AM', 'صباحًا')
        .replace('PM', 'مساءً');
    } else {
      timeElement.textContent = (timeElement.textContent || '')
        .replace('صباحًا', 'AM')
        .replace('مساءً', 'PM');
    }
// Append timeElement inside contentElement at the bottom
  // append in correct order
  divMsg.appendChild(img);
  contentElement.appendChild(timeElement);
    divMsg.appendChild(contentElement);


    const helloDiv = document.getElementById('helloDiv') as HTMLElement;
    if (helloDiv) helloDiv.style.display = 'none';

    const chatContent = document.getElementById('chat-content')!;
    chatContent.appendChild(divMsg);
    chatContent.scrollIntoView({ behavior: 'smooth' });
    chatContent.scrollTop = chatContent.scrollHeight;

    this.streamingMessageContainer = divMsg;
    this.streamingContentElement = contentElement;
  }

  private appendToBotStream(chunk: string): void {
    if (!this.isStreaming || !this.streamingContentElement) return;
    this.streamingBuffer += chunk;

    // Extract plain text 
    const text = this.streamingBuffer.trim();
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
const englishChars = (text.match(/[A-Za-z]/g) || []).length;

const isArabic = arabicChars > englishChars;

    // Apply alignment
    this.streamingContentElement.style.textAlign = isArabic ? 'right' : 'left';
    this.streamingContentElement.style.direction = isArabic ? 'rtl' : 'ltr';

    // Convert streaming markdown to HTML
    const html = marked.parse(this.streamingBuffer, { async: false }) as string;
    
    // Sanitize HTML with DOMPurify for security
    const sanitizedHtml = DOMPurify.sanitize(html);

    // Update element with sanitized HTML
    this.streamingContentElement.innerHTML = sanitizedHtml;

    // Render math equations
    this.renderMath(this.streamingContentElement);
    
/*     const chatContent = document.getElementById('chat-content')!;
    chatContent.scrollTop = chatContent.scrollHeight; */
  }

private async endBotStream(isError: boolean = false): Promise<void> {
  if (!this.isStreaming) return;
  this.isStreaming = false;

  if (!this.streamingContentElement) {
    this.resetStreamingRefs();
    return;
  }

  if (!isError) {
    const html = await marked.parse(this.streamingBuffer);

    // Sanitize HTML
    const sanitizedHtml = DOMPurify.sanitize(html as string);
    this.streamingContentElement.innerHTML = sanitizedHtml;

    // Render math equations
    this.renderMath(this.streamingContentElement);

    // Create sound icon
    const text = this.streamingContentElement.textContent?.trim() || '';
    const sound = this.createSoundIcon(text);
    this.streamingContentElement.appendChild(sound);

    // ✅ Create timestamp
    const timeElement = document.createElement('div');
    timeElement.className = 'timestamp1 text-dark';

    const timestamp =
      this.streamingTimestamp || new Date().toISOString();
    const date = new Date(timestamp);

    let formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    // Arabic conversion
    const lang = localStorage.getItem('lang');
    if (lang === 'ar') {
      formattedTime = formattedTime.replace('AM', 'صباحًا').replace('PM', 'مساءً');
    }

    timeElement.textContent = formattedTime;

    // ✅ Append timestamp inside the chat bubble
    this.streamingContentElement.appendChild(timeElement);

    // Save message
    this.saveMessage('bot', this.streamingBuffer, timestamp, this.currentChatId);
  }

  this.resetStreamingRefs();
  this.setUIState(false, false);

  const inputElement = document.getElementById('question-input') as HTMLTextAreaElement;
  if (inputElement && !inputElement.value.trim()) this.isDisabledSubject.next(false);
}


  private resetStreamingRefs(): void {
    this.streamingBuffer = '';
    this.streamingContentElement = null;
    this.streamingMessageContainer = null;
    this.streamingTimestamp = '';
    this.jsonBuffer = '';
  }

  private parseStreamResponse(response: any): void {
    if (!response) return;

    let dataString = '';
    
    // Handle string response (SSE format)
    if (typeof response === 'string') {
      dataString = response;
    } else if (response.data) {
      dataString = response.data;
    } else {
      // If it's already an object, process it directly
      if (response.type === 'token' && response.content) {
        this.appendToBotStream(response.content);
      }
      return;
    }

    // Handle SSE format: split by lines and process each "data: " line
    const lines = dataString.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Handle SSE format with "data: " prefix
      let jsonStr = trimmed;
      if (trimmed.startsWith('data: ')) {
        jsonStr = trimmed.substring(6).trim(); // Remove "data: " prefix
      }

      // Skip empty strings or special SSE events
      if (!jsonStr || jsonStr === '[DONE]') continue;

      // Try to parse this line as complete JSON first
      try {
        const parsed = JSON.parse(jsonStr);
        
        // Successfully parsed as complete JSON
        this.jsonBuffer = ''; // Clear any previous buffer
        
        // Process the parsed object
        if (parsed.type === 'token' && parsed.content) {
          this.appendToBotStream(parsed.content);
        } else if (parsed.done === true) {
          this.endBotStream();
        }
      } catch (e) {
        // This line might be part of incomplete JSON - add to buffer
        this.jsonBuffer += jsonStr;
        
        // Try to parse the buffered JSON
        try {
          const parsed = JSON.parse(this.jsonBuffer);
          
          // Successfully parsed, clear buffer
          this.jsonBuffer = '';

          // Process the parsed object
          if (parsed.type === 'token' && parsed.content) {
            this.appendToBotStream(parsed.content);
          } else if (parsed.done === true) {
            this.endBotStream();
          }
        } catch (bufferError) {
          // JSON is still incomplete, keep buffering for next chunk
          // If buffer gets too large, it might be malformed - reset it
          if (this.jsonBuffer.length > 10000) {
            console.warn('JSON buffer too large, resetting');
            this.jsonBuffer = '';
          }
        }
      }
    }
  }

  // Update chat list UI
  updateChatList(): void {
    // Implementation depends on your UI structure
    // This would update your chat list in the UI
    this.chatsSubject.next(this.chats);
  }

  // Video seeking functionality
  seekVideo(event: Event): void {
    const button = event.target as HTMLElement;
    const timestamp = button.dataset['timestamp'];
    if (!timestamp) return;

    const videoElement = button.closest('.video-response')?.querySelector('video');
    if (!videoElement) return;

    // Convert HH:MM:SS to seconds
    const parts = timestamp.split(':');
    const seconds = (+parts[0]) * 3600 + (+parts[1]) * 60 + (+parts[2]);

    videoElement.currentTime = seconds;


  }

  // Set UI state (typing and disabled status)
  private setUIState(isDisabled: boolean, isTyping: boolean): void {


    this.isDisabledSubject.next(isDisabled);
    this.isTypingSubject.next(isTyping);


  }


  loadChatSessions(): void {


    /*     const storedChats = localStorage.getItem('chats');
        this.chats = storedChats ? JSON.parse(storedChats) : []; */
const payload={
      collection_id: this.assistantId,
      user_id: (JSON.parse(sessionStorage.getItem('currentUser') || '{}').id).toString()
}

this.http.get(
  this.apiConfig.getAiUrl(this.apiConfig.endpoints.chat.getHistory),
  {
    params: payload
  }
).subscribe({
      next: (res: any) => {
        // Assuming `res` contains the chats array
        this.chats = res.messages || [];
        console.log(res.messages, 'this.chats')

        if (this.chats.length === 0) {
          this.createNewChat(); // auto-create if no chat exists
          return
        }

        this.chatsSubject.next(this.chats);
        if (!this.currentChatId) {
          this.setCurrentChat(this.chats[0].id); // default to first chat
        }
      },
      error: (err) => {
        console.error('Error loading chats from API:', err);


      }
    });
    /*      this.chatsSubject.next(this.chats);
         if (!this.currentChatId) {
           this.setCurrentChat(this.chats[0].id); // default to first chat
         } */

  }


  switchChat(chatId: string): void {


    const container = document.getElementById("chat-content");
    // const header = document.getElementById("chatheader");

    /* this.chats = Array.isArray(this.chats)
      ? this.chats
      : Array.isArray(this.chats)
      ? this.chats
      : [];
       this.chats?.forEach((msg: any) => {
      console.log('Chat ID:', msg.chatId,msg);
    }); */
    const chat = this.chats.filter((msg: any) => msg.chatId == chatId);


    if (!container || !chat) return;

    // Set header
    /* if (header) {
       header.innerText = chat.name;
     }
   */
    // Clear old messages except helloDiv
    Array.from(container.children).forEach(child => {
      if (child.id !== "helloDiv") {
        child.remove();
      }
    });

    (chat as any).forEach((msg: any) => {

  // Convert timestamp to Date
/* let date = new Date(msg.timestamp);

// Add 3 hours
date.setHours(date.getHours() + 3);

// Convert back to ISO string (or whatever format you need)
let updatedTimestamp = date.toISOString(); */
let timestampWithZ = msg.timestamp.endsWith('Z') ? msg.timestamp : msg.timestamp + 'Z';

// Now pass the updated timestamp
this.displayMessage(msg.content, msg.sender, timestampWithZ, chatId);
    });

  }


  deleteChat(chatId: string): void {
    const chatIndex = this.chats.findIndex(c => c.id === chatId);
    if (chatIndex === -1) return;

    const deletedChat = this.chats[chatIndex];

    // Optional: if you're storing messageIds separately and want to delete them
    if ((deletedChat as any).messageIds) {
      (deletedChat as any).messageIds.forEach((msgId: string) => {
        localStorage.removeItem(msgId);
      });
    }

    // Remove chat from the list
    this.chats.splice(chatIndex, 1);
    this.saveChatsToStorage();
    this.chatsSubject.next(this.chats);

    // Handle current chat deletion
    if (this.currentChatId === chatId) {
      if (this.chats.length === 0) {
        this.createNewChat();
      } else {
        this.setCurrentChat(this.chats[0].id);
      }
    }

    this.updateChatList();
  }



  /*   getAssistantId(subjectId:number):Observable<> {
      
      this.http.get(Config.getAssistantId+subjectId).subscribe((data:any)=>{
          this.assistantId= data['aiAssistantId'];
          console.log(JSON.parse(this.userData || '{}').id,'JSON.parse(this.userDataid');
          localStorage.setItem('currentChatId',`${this.assistantId}_${JSON.parse(this.userData || '{}').id}`)
     },(err)=>{
   
      })
      
  
    } */
  getAssistantId(subjectId: number): Observable<any> {
    return this.http.get(this.apiConfig.getUrl(this.apiConfig.endpoints.chat.getAssistantId) + subjectId);
  }



  // --- :loud_sound: Create sound icon above timestamp ---
  createSoundIcon(text: string) {
    const soundIcon = document.createElement('div');
    soundIcon.className = 'soundIcon';
    soundIcon.style.cursor = "pointer";
    soundIcon.style.display = "inline-block";
    soundIcon.style.width = "fit-content";
    soundIcon.style.color = 'inherit';

    // 🎵 Default icon (sound)
    const defaultIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.3344 8C13.3344 5.78125 11.9781 3.88125 10.0531 3.07812L9.54062 4.30937C10.9844 4.9125 12 6.3375 12 8C12 9.66562 10.9844 11.0875 9.5375 11.6906L10.05 12.9219C11.9781 12.1187 13.3344 10.2188 13.3344 8ZM10.6656 8C10.6656 6.89062 9.9875 5.94063 9.025 5.54063L8.5125 6.77187C8.99375 6.97187 9.33125 7.44688 9.33125 8.00313C9.33125 8.55625 8.99375 9.03125 8.5125 9.23438L9.025 10.4656C9.9875 10.0594 10.6656 9.10938 10.6656 8ZM11.0781 0.615625L10.5625 1.84687C12.9719 2.85 14.6656 5.225 14.6656 8C14.6656 10.7719 12.9719 13.15 10.5625 14.1531L11.075 15.3844C13.9688 14.1781 16 11.3281 16 8C16 4.67188 13.9688 1.82187 11.0781 0.615625ZM0 4.66563V11.3313H2.66563L7.33437 16V0L2.66563 4.66563H0Z" fill="currentColor"/>
    </svg>
  `;

    // ⏳ Loading icon
    const loadingIcon = `
 <div class="loader"></div>  `;

    // 🔊 Playing icon
    const playingIcon = `
 <?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11 5H5V11H11V5Z" fill="black"/></svg>

  `;

    soundIcon.innerHTML = defaultIcon;
    soundIcon.addEventListener('click', () => {
      if (this.isloading) return;
      this.isloading = true;
      soundIcon.innerHTML = loadingIcon;
      //  If another audio is already playing
      if (this.currentAudio && !this.currentAudio.paused && !this.currentAudio.ended) {
        this.currentAudio.pause();

        // Reset the previous icon if it’s not this one
        if (this.currentSoundIcon && this.currentSoundIcon !== soundIcon) {
          this.currentSoundIcon.innerHTML = defaultIcon;
        }

        this.isloading = false;
        soundIcon.innerHTML = defaultIcon;
        return;
      }

      
      var lang= (/[\u0600-\u06FF]/.test(text))?'ar':'en';
      var body={
                  "text": text,
                  "language": lang,
                  "chunk_size":40
                };
        this.generateAndPlayTTS(body, soundIcon);
    });
    return soundIcon;
  }



async generateAndPlayTTS(body: any, soundIcon: HTMLElement) {
  this.isloading = true;

  // 🎵 Default icon
  const defaultIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13.3344 8C13.3344 5.78125 11.9781 3.88125 10.0531 3.07812L9.54062 4.30937C10.9844 4.9125 12 6.3375 12 8C12 9.66562 10.9844 11.0875 9.5375 11.6906L10.05 12.9219C11.9781 12.1187 13.3344 10.2188 13.3344 8ZM10.6656 8C10.6656 6.89062 9.9875 5.94063 9.025 5.54063L8.5125 6.77187C8.99375 6.97187 9.33125 7.44688 9.33125 8.00313C9.33125 8.55625 8.99375 9.03125 8.5125 9.23438L9.025 10.4656C9.9875 10.0594 10.6656 9.10938 10.6656 8ZM11.0781 0.615625L10.5625 1.84687C12.9719 2.85 14.6656 5.225 14.6656 8C14.6656 10.7719 12.9719 13.15 10.5625 14.1531L11.075 15.3844C13.9688 14.1781 16 11.3281 16 8C16 4.67188 13.9688 1.82187 11.0781 0.615625ZM0 4.66563V11.3313H2.66563L7.33437 16V0L2.66563 4.66563H0Z" fill="currentColor"/>
  </svg>
  `;

  // 🔊 Playing icon
  const playingIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd"
      d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11 5H5V11H11V5Z"
     fill="currentColor"/>
  </svg>
  `;

  try {
    // أوقف أي صوت سابق
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    const mediaSource = new MediaSource();
    const audio = new Audio();
    this.currentAudio = audio;

    audio.src = URL.createObjectURL(mediaSource);
    audio.autoplay = true;

    soundIcon.innerHTML = playingIcon;
    this.currentSoundIcon = soundIcon;

    audio.onended = () => {
      soundIcon.innerHTML = defaultIcon;
      this.isloading = false;
      this.currentAudio = null;
    };

    audio.onerror = () => {
      throw new Error('Audio playback error');
    };

    mediaSource.addEventListener('sourceopen', async () => {
      const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
  const accessToken =
    (await firstValueFrom(this.getValidToken.execute())) ?? '';
      const response = await fetch(this.apiConfig.getAiUrl(this.apiConfig.endpoints.chat.streamTTS), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(body)
      });

      if (!response.body) {
        throw new Error('No stream body');
      }

      const reader = response.body.getReader();

      const queue: any[] = []; // ⬅ الكود الجديد

        const appendNext = () => {      // ⬅ دالة المعالجة
          if (queue.length === 0 || sourceBuffer.updating) return;
          const chunk = queue.shift()!;
          sourceBuffer.appendBuffer(chunk);
        };

        sourceBuffer.addEventListener('updateend', () => { // ⬅ حدث updateend لمعالجة التالي
          appendNext();
        });

      while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          queue.push(value); // ضع chunk في queue
          appendNext();      // حاول إضافته إذا الـ SourceBuffer جاهز
        }


      // إنهاء الستريم بشكل نظيف
     await new Promise<void>(resolve => {
          const checkQueue = () => {
            if (!sourceBuffer.updating && queue.length === 0) return resolve();
            setTimeout(checkQueue, 20); // تحقق كل 20ms
          };
          checkQueue();
        });

        mediaSource.endOfStream();
      this.isloading = false;
    });

  } catch (err) {
    console.error('TTS streaming error:', err);
    soundIcon.innerHTML = defaultIcon;
    this.isloading = false;
  }
}


}