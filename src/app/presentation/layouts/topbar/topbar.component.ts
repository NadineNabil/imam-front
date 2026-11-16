import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

// Business contracts from domain layer
import { IAuthBusiness, AUTH_BUSINESS_TOKEN } from '../../../domain/business-contracts';

// Services from shared
import { LanguageService } from '../../../shared/services/language.service';
import { UnsavedChangesService } from '../../../shared/services/unsaved-changes.service';

// Store from presentation layer
import { changeMode, changeSidebarMode, changeTopbarMode } from '../../store/layouts/layout.actions';
import { RootReducerState } from '../../store';
import { LogoutConfirmationModalComponent } from '../../../shared/components/logout-confirmation-modal/logout-confirmation-modal.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  standalone: false
})

/**
 * Topbar Component
 */
export class TopbarComponent implements OnInit {

  mode: string | undefined;
  element: any;
  flagvalue: any;
  cookieValue: any;
  countryName: any;
  valueset: any;
isStudent:boolean=false
  constructor(
    private router: Router,
    @Inject(AUTH_BUSINESS_TOKEN) private authBusiness: IAuthBusiness,
    public languageService: LanguageService,
    private unsavedChangesService: UnsavedChangesService,
    public _cookiesService: CookieService,
    public translate: TranslateService,
    private store: Store<RootReducerState>,
    private modalService: NgbModal
  ) { }

  /**
   * Language Listing
   */
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'العربية', flag: 'assets/images/ksa.png', lang: 'ar' },
  ];

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  layoutMode!: string;
  Username: string | undefined;

  ngOnInit(): void {

  
    this.Username = this.authBusiness.getCurrentUser()?.firstName;
    const roles=this.authBusiness.getCurrentUser()?.roles
    this.isStudent =roles?.includes('student')||false;
    const storedMode = localStorage.getItem('mode');
    if (storedMode === 'light' || storedMode === 'dark') {
      this.mode = storedMode;
      this.layoutMode = storedMode;
      this.store.dispatch(changeMode({ mode: storedMode }));
      this.store.dispatch(changeTopbarMode({ topbarmode: storedMode }));
      document.body.setAttribute('data-topbar', this.mode);
      document.body.setAttribute('data-bs-theme', this.mode);
      document.body.setAttribute('data-sidebar', this.mode);
    }

    this.store.select('layout').subscribe((data) => {
      this.layoutMode = data.LAYOUT_MODE;
      localStorage.setItem('mode', this.layoutMode);
    });
    this.element = document.documentElement;
    // Cookies wise Language set
    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
  }

  /**
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
    localStorage.setItem('lang',lang)
  }

  /**
   * Topbar Light-Dark Mode Change
   */
  changeMode(mode: string) {
    this.mode = mode;
    this.store.dispatch(changeMode({ mode }));
   document.body.setAttribute('data-sidebar', this.mode);
    this.store.dispatch(changeTopbarMode({ topbarmode: mode }));
        this.store.dispatch(changeSidebarMode({ sidebarMode:mode }));
    if (mode === 'dark') {
      document.body.setAttribute('data-topbar', 'dark');
    } else {
      document.body.setAttribute('data-topbar', mode);
    }
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Logout the user - Uses AuthBusiness contract
   */
  logout() {
    this.unsavedChangesService.canDeactivate().subscribe((canLeave) => {
      if (!canLeave) {
        return;
      }
      const modalRef = this.modalService.open(LogoutConfirmationModalComponent, { centered: true });
      modalRef.result.then((result) => {
        if (result === 'confirm') {
          this.authBusiness.logout().subscribe({
            complete: () => {
              this.router.navigate(['/account/auth/logout']);
            }
          });
        }
      }, () => { });
    });
  }

}


