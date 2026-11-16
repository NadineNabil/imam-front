import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WsTestComponent } from './ws-test.component';



const routes: Routes = [{ path: '', component: WsTestComponent }];

@NgModule({
 
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [WsTestComponent],
})
export class WsTestModule {}
