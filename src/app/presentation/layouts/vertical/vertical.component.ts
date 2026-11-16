import { Component, Inject, OnInit } from '@angular/core';
import { AUTH_BUSINESS_TOKEN, IAuthBusiness } from 'src/app/domain/business-contracts';

@Component({
  selector: 'app-vertical',
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.scss'],
  standalone: false
})

/**
 * Vertical Component
 */
export class VerticalComponent implements OnInit {
  isCondensed = false;
isStudent:boolean=false;
  constructor(    @Inject(AUTH_BUSINESS_TOKEN) private authBusiness: IAuthBusiness,
) { }

  ngOnInit(): void {
    document.body.setAttribute('data-layout', 'vertical');
                const roles=this.authBusiness.getCurrentUser()?.roles
    this.isStudent =roles?.includes('student')||false;
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    document.body.classList.toggle('sidebar-enable');
    const currentSidebarSize = document.body.getAttribute('data-sidebar-size');
   
    if (window.innerWidth >= 992) {
      if (currentSidebarSize == null || currentSidebarSize === 'lg') {
        document.body.setAttribute('data-sidebar-size', 'sm');
      } else if (currentSidebarSize === 'md') {
        document.body.setAttribute('data-sidebar-size', 'sm');
      } else {
        document.body.setAttribute('data-sidebar-size', 'lg');
      }
    }
    
    this.isCondensed = !this.isCondensed;
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }
}

