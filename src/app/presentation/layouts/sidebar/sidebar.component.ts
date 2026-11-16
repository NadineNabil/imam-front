import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import MetisMenu from 'metismenujs';
import { Router, NavigationEnd } from '@angular/router';
import { MENU } from './menu';
import {STUDENTMenu} from './student.menu';
import { MenuItem } from './menu.model';
import { TranslateService } from '@ngx-translate/core';
import { AUTH_BUSINESS_TOKEN, IAuthBusiness } from 'src/app/domain/business-contracts/auth-business.contract';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: false
})

/**
 * Sidebar Component
 */
export class SidebarComponent implements OnInit {

  @ViewChild('sideMenu') sideMenu!: ElementRef;
  menu: any;
  menuItems: MenuItem[] = [];
  isStudent:boolean=false

  constructor(private router: Router, public translate: TranslateService, @Inject(AUTH_BUSINESS_TOKEN) private authBusiness: IAuthBusiness) {
    translate.setDefaultLang('en');
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();

        // After navigation ends, if we're on a small viewport and the
        // mobile sidebar is open, trigger the topbar mobile toggle so the
        // same `toggleMobileMenu` flow runs (it emits the event handled by
        // the layout). This keeps behavior consistent across mobile navs.
        try {
          if (window.innerWidth < 992 && document.body.classList.contains('sidebar-enable')) {
            const btn = document.getElementById('vertical-menu-btn') as HTMLElement | null;
            if (btn) {
              btn.click();
            } else {
              // Fallback: directly remove the mobile sidebar classes
              document.body.classList.remove('sidebar-enable');
              document.body.classList.remove('sidebar-open');
            }
          }
        } catch (err) {
          // silent
        }
      }
    });
  }

  ngOnInit(): void {
        const roles=this.authBusiness.getCurrentUser()?.roles
    this.isStudent =roles?.includes('student')||false;
    if(this.isStudent){
      this.menuItems = STUDENTMenu;
    }else{
      this.menuItems = MENU;
    }
  }

  /***
   * Activate droup down set 
   */
  ngAfterViewInit() {
    this.menu = new MetisMenu('#side-menu');
    this._activateMenuDropdown();
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
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
   * Activate the parent dropdown
   */
  _activateMenuDropdown() {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');
    const links: any = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    const paths = [];
    for (let i = 0; i < links.length; i++) {
      paths.push(links[i]['pathname']);
    }
    var itemIndex = paths.indexOf(window.location.pathname);
    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf('/');
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }
    if (menuItemEl) {
      menuItemEl.classList.add('active');
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement.closest('ul');
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;
          if (parent3El && parent3El.id !== 'side-menu') {
            parent3El.classList.add('mm-active');
            const childAnchor = parent3El.querySelector('.has-arrow');
            const childDropdown = parent3El.querySelector('.has-dropdown');
            if (childAnchor) {
              childAnchor.classList.add('mm-active');
            }
            if (childDropdown) {
              childDropdown.classList.add('mm-active');
            }
            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== 'side-menu') {
              parent4El.classList.add('mm-show');
              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== 'side-menu') {
                parent5El.classList.add('mm-active');
                const childanchor = parent5El.querySelector('.is-parent');
                if (childanchor && parent5El.id !== 'side-menu') {
                  childanchor.classList.add('mm-active');
                }
              }
            }
          }
        }
      }
    }
  }
}

