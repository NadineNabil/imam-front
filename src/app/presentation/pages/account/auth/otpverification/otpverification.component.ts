import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AUTH_BUSINESS_TOKEN, IAuthBusiness } from 'src/app/domain/business-contracts';
import { StorageService } from 'src/app/shared/services/storage.service';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';

@Component({
    selector: 'app-otpverification',
    templateUrl: './otpverification.component.html',
    styleUrls: ['./otpverification.component.scss'],
    standalone: false
})

/**
 * OTP Verification Component
 */
export class OTPverificationComponent implements OnInit, OnDestroy {
  submitted = false;
  loading = false;
  loading1 = false;
  countdown=60;
   private timer: number=0;
   canResend:boolean=false
  successmsg = '';
  error = '';
  otpForm!: UntypedFormGroup;
  email: string = '';
  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;
  isDarkMode = localStorage.getItem('mode') === 'dark';
  regionBgImage: string = 'assets/images/auth-bg.jpg';
  regionImageLoaded: boolean = false;
  private destroy$ = new Subject<void>();

  /**
   * Confirm Otp Verification
   */
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };

  constructor(private formBuilder: UntypedFormBuilder,
    private translate: TranslateService,
    private router: Router,
    private storageService: StorageService,
    private geolocationService: GeolocationService,
    @Inject(AUTH_BUSINESS_TOKEN) private authBusiness: IAuthBusiness
  ) { }

  ngOnInit(): void {
    this.startCountdown();
    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
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

  /**
   * Resend OTP
   */
  resendOtp() {
    if(!this.canResend){
      return
    }
    this.startCountdown()
    this.loading1 = true;
    this.error = '';
    this.authBusiness.sendOtp(this.storageService.get('email') || '').subscribe({
      next: () => {
        this.loading1 = false;
        this.successmsg = this.translate.instant('VERIFICATION.OTP_SENT_SUCCESSFULLY');
      },
      error: (err: any) => {
        this.loading1 = false;
        this.error = err|| this.translate.instant('VERIFICATION.FAILED_TO_RESEND_OTP');
      }
    });
  }
  get f() { return this.otpForm.controls; }


  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.otpForm.invalid) {
      return;
    }

    this.loading = true;

    // Call business contract instead of direct use case
    this.authBusiness.verifyOtp(
      this.storageService.get('email') || '',
      this.otpForm.value.otp
      
    ).subscribe({
      next: (data:any) => {
        console.log(data);
        this.loading = false;
        this.successmsg = this.translate.instant('VERIFICATION.OTP_VERIFIED_SUCCESSFULLY');
        this.storageService.set('token', data["reset_token"]);
        this.router.navigate(['/account/auth/reset-password']);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err|| this.translate.instant('VERIFICATION.FAILED_TO_VERIFY_OTP');
      }
    });
  }
  startCountdown(){
    this.canResend=false
     this.countdown = 60;
this.timer=setInterval(()=>{
this.countdown--;
if(this.countdown===0){
this.canResend=true

}
},1000)
  }
}


