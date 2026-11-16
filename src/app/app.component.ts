import { Component, OnInit } from '@angular/core';
import { LanguageService } from './shared/services/language.service';
import { changeMode, changeSidebarMode, changesLayout, changeTopbarMode } from './presentation/store/layouts/layout.actions';
import { Store } from '@ngrx/store';
import { RootReducerState } from './presentation/store';
import { StudentSessionService } from './shared/services/studentSession.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'Moga edu';
  mode: string='';
  layoutMode: string='';
 
  constructor(
    private languageService: LanguageService,
    private sessionService: StudentSessionService,
        private store: Store<RootReducerState>,
    
  ) {
    // LanguageService constructor automatically:
    // 1. Reads language from cookie
    // 2. Sets translate service to use that language
    // 3. Sets HTML dir attribute (rtl/ltr)
   if(localStorage.getItem('mode')!=='light' && localStorage.getItem('mode')!=='dark'){
    localStorage.setItem('mode', 'light');
  }
}
  ngOnInit(): void {
       const storedMode = localStorage.getItem('mode');
       const theme = localStorage.getItem('layout');
       if (theme === 'horizontal') {
            this.store.dispatch(changesLayout({ layoutMode: 'horizontal' }));
       }
        else  {
          this.store.dispatch(changeMode({ mode: 'vertical' }));
        }
       if (storedMode === 'light' || storedMode === 'dark') {
         this.mode = storedMode;
         this.layoutMode = storedMode;
         this.store.dispatch(changeMode({ mode: storedMode }));
         this.store.dispatch(changeTopbarMode({ topbarmode: storedMode }));
         this.store.dispatch(changeSidebarMode({sidebarMode:storedMode}))
         document.body.setAttribute('data-topbar', this.mode);
         document.body.setAttribute('data-bs-theme', this.mode);
         document.body.setAttribute('data-sidebar', this.mode);
       }
  }

  /***** session start after refresh ***** 
   * 
   *  const token = localStorage.getItem('token');

  if (token) {
    this.sessionService.startWatching();
    this.sessionService.resetTimer();
  }
    
  */
}
