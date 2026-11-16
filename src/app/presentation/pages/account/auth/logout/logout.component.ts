import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IAuthBusiness, AUTH_BUSINESS_TOKEN } from '../../../../../domain/business-contracts';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';

@Component({ selector: 'app-logout', templateUrl: './logout.component.html', styleUrls: ['./logout.component.scss'], standalone: false })
export class LogoutComponent implements OnInit, OnDestroy {
  year: number = new Date().getFullYear();
  showNavigationArrows: any;
  isDarkMode = localStorage.getItem('mode') === 'dark';
  regionBgImage: string = 'assets/images/auth-bg.jpg';
  regionImageLoaded: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private geolocationService: GeolocationService,
    @Inject(AUTH_BUSINESS_TOKEN) private authBusiness: IAuthBusiness
  ) { }

  ngOnInit(): void {
    this.authBusiness.logout().subscribe();
    this.geolocationService.getRegionTheme()
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.regionBgImage = theme.imageUrl;
        setTimeout(() => { this.regionImageLoaded = true; }, 50);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
