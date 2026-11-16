import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatbotRoutingModule } from './chatbot-routing.module';
import { ChatComponent } from './chat/chat.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecoderComponent } from 'src/app/shared/components/recoder/recoder.component';
import { MainChatComponent } from './main-chat/main-chat.component';


@NgModule({
  declarations: [ChatComponent,MainChatComponent],
  imports: [
    CommonModule,
    ChatbotRoutingModule,
    SharedModule,
    RecoderComponent
  ]
})
export class ChatbotModule { }
