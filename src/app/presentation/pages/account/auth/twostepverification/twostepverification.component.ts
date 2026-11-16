import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';

@Component({
    selector: 'app-twostepverification',
    templateUrl: './twostepverification.component.html',
    styleUrls: ['./twostepverification.component.scss'],
    standalone: false
})

/**
 * Two Step Verification Component
 */
export class TwostepverificationComponent implements OnInit, OnDestroy {

  // set the currenr year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;
  regionBgImage: string = 'assets/images/auth-bg.jpg';
  regionImageLoaded: boolean = false;
  private destroy$ = new Subject<void>();

  /**
   * Confirm Otp Verification
   */
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };

  constructor(private geolocationService: GeolocationService) { }

  ngOnInit(): void {
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
