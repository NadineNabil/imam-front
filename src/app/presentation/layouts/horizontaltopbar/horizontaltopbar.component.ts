import { Component, OnInit, AfterViewInit, Output, EventEmitter, Inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Store } from '@ngrx/store';

// Business contracts from domain layer
import { IAuthBusiness, AUTH_BUSINESS_TOKEN } from '../../../domain/business-contracts';

// Services from shared
import { LanguageService } from '../../../shared/services/language.service';
import { UnsavedChangesService } from '../../../shared/services/unsaved-changes.service';

// Store from presentation layer
import { changeMode } from '../../store/layouts/layout.actions';
import { RootReducerState } from '../../store';
import { LogoutConfirmationModalComponent } from '../../../shared/components/logout-confirmation-modal/logout-confirmation-modal.component';

@Component({
  selector: 'app-horizontaltopbar',
  templateUrl: './horizontaltopbar.component.html',
  styleUrls: ['./horizontaltopbar.component.scss'],
  standalone: false
})

/**
 * Horizontal-Topbar Component
 */
export class HorizontaltopbarComponent implements OnInit, AfterViewInit {

  mode: string | undefined;
  layoutMode!: string;

  menuItems: MenuItem[] = [];
  element: any;
  flagvalue: any;
  cookieValue: any;
  countryName: any;
  valueset: any;
  Username: string | undefined;
  isStudent:boolean=false
  /**
   * Language Listing
   */
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'العربية', flag: 'assets/images/ksa.png', lang: 'ar' },
  ];

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  constructor(
    private router: Router,
    public translate: TranslateService,
    public languageService: LanguageService,
    private unsavedChangesService: UnsavedChangesService,
    public _cookiesService: CookieService,
    private store: Store<RootReducerState>,
    @Inject(AUTH_BUSINESS_TOKEN) private authBusiness: IAuthBusiness,
    private modalService: NgbModal
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activateMenu();
      }
    });
  }

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
     localStorage.setItem('lang',lang)
  }

  ngOnInit(): void {
        this.Username = this.authBusiness.getCurrentUser()?.firstName;
            const roles=this.authBusiness.getCurrentUser()?.roles
    this.isStudent =roles?.includes('student')||false;
    this.store.select('layout').subscribe((data) => {
      this.layoutMode = data.LAYOUT_MODE;
    })
    this.element = document.documentElement;
    this.initialize();
    /***
     * Language value cookies wise set
     */
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
   * Initialize
   */
  initialize(): void {
    this.menuItems = MENU;
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }

  /**
   * On menu click
   */
  onMenuClick(event: any) {
    const clickedEl = event.currentTarget; 
    const nextEl = event.target.nextElementSibling;

      // 🔴 Close all open menus first
      const allDropdowns = document.querySelectorAll('.dropdown-menu');
      allDropdowns.forEach((menu: any) => {
        if (menu !== nextEl) {
          menu.classList.remove('show');
        }
      });
      
    if (nextEl) {
      /*const parentEl = event.target.parentNode;
      if (parentEl) {
        parentEl.classList.remove('show');
      }
      */
      nextEl.classList.toggle('show');
    }
    return false;
  }

  ngAfterViewInit() {
    this.activateMenu();
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className: any) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Topbar Light-Dark Mode Change
   */
  changeMode(mode: string) {
    this.mode = mode;
    this.store.dispatch(changeMode({ mode }));
    if (mode == 'dark') {
      localStorage.setItem('mode', 'dark');
      document.body.setAttribute('data-topbar', 'dark')
    } else {
      localStorage.setItem('mode', 'light');
      document.body.setAttribute('data-topbar', mode)
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
   * Activates the menu
   */
  private activateMenu() {
    const resetParent = (el: any) => {
      const parent = el.parentElement;
      if (parent) {
        parent.classList.remove('active');
        const parent2 = parent.parentElement;
        this._removeAllClass('mm-active');
        this._removeAllClass('mm-show');
        if (parent2) {
          parent2.classList.remove('active');
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove('active');
            const parent4 = parent3.parentElement;
            if (parent4) {
              parent4.classList.remove('active');
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove('active');
                const menuelement = document.getElementById('topnav-menu-content');
                if (menuelement !== null)
                  if (menuelement.classList.contains('show'))
                    document.getElementById('topnav-menu-content')!.classList.remove('show');
              }
            }
          }
        }
      }
    };

    const links: any = document.getElementsByClassName('side-nav-link-ref');
    let matchingMenuItem = null;
    for (let i = 0; i < links.length; i++) {
      resetParent(links[i]);
    }
    for (let i = 0; i < links.length; i++) {
      if (location.pathname === links[i]['pathname']) {
        matchingMenuItem = links[i];
        break;
      }
    }

    if (matchingMenuItem) {
      const parent = matchingMenuItem.parentElement;
      if (parent) {
        parent.classList.add('active');
        const parent2 = parent.parentElement;
        if (parent2) {
          parent2.classList.add('active');
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.add('active');
            const parent4 = parent3.parentElement;
            if (parent4) {
              parent4.classList.add('active');
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.add('active');
              }
            }
          }
        }
      }
    }
  }

  /**
   * Logout - Uses AuthBusiness contract
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

