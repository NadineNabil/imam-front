import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

// Business contracts from domain layer - Clean Architecture
import { IAuthBusiness, AUTH_BUSINESS_TOKEN } from '../../../../domain/business-contracts';
import { UserStatus } from 'src/app/domain/enums/user-status.enum';
import { IP_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/ip-business.contract';
import { ipBusiness } from 'src/app/domain/business/ip.business';
import { StudentSessionService } from 'src/app/shared/services/studentSession.service';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';

declare global {
  interface Window {
    turnstile: any;
  }
}


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})


/**
 * Login Component - Refactored for Clean Architecture
 * Uses Business contracts instead of direct use case calls
 */
export class LoginComponent implements OnInit, OnDestroy {

  year: number = new Date().getFullYear();
  showNavigationArrows: any;
  loginForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  returnUrl!: string;
  fieldTextType!: boolean;
  private destroy$ = new Subject<void>();
  isDarkMode = localStorage.getItem('mode') === 'dark';

  /** Regional background image URL — updated asynchronously on page load */
  regionBgImage: string = 'assets/images/auth-bg.jpg';
  /** Whether the regional image has finished loading (for fade-in) */
  regionImageLoaded: boolean = false;

 // ViewChild for CAPTCHA widget container
  @ViewChild('turnstileWidget')
  turnstileWidget!: ElementRef;
  captchaWidgetId: any;
  captchaToken: string='';
  showCaptchaOverlay = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    // Inject Business contract instead of use cases
    @Inject(AUTH_BUSINESS_TOKEN) private authBusiness: IAuthBusiness,
      @Inject(IP_BUSINESS_TOKEN) private IpBusiness: ipBusiness,
      private session: StudentSessionService,
      private geolocationService: GeolocationService
  ) {
    // redirect to the right home page if already logged in
    const currentUser = this.authBusiness.getCurrentUser();
    if (currentUser) {
      this.router.navigate([this.getRedirectUrl(currentUser)]);
    }

   

    

  }

  ngAfterViewInit() {

    //this.renderTurnstile();

}
  ngOnInit(): void {
    localStorage.removeItem('email'); // Clear email from localStorage on login page load
    localStorage.removeItem('successOtp'); // Clear OTP from localStorage on login page load
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, this.emailValidator,Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    document.body.setAttribute('data-layout', 'vertical');
    
    /**************************** */
      this.LogIpAddress();
      this.session.startSession();

    // Load regional background image asynchronously — does not block login form
    this.geolocationService.getRegionTheme()
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.regionBgImage = theme.imageUrl;
        // Small tick to let Angular render the new URL, then trigger fade-in
        setTimeout(() => { this.regionImageLoaded = true; }, 50);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() { return this.loginForm.controls; }

  /**
   * Custom email validator matching domain layer regex
   * Same pattern as AuthCredentials entity
   */
  emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { email: true };
  }

  /**
   * Form submit - Uses AuthBusiness contract
   */
  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    // Call business contract instead of direct use case
    this.authBusiness.login(this.f['email'].value, this.f['password'].value, this.f['rememberMe'].value ? true : false)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (user) => {
            // sessionStorage.setItem(
            //   'currentUser',
            //   JSON.stringify(user)
            // );
            const targetUrl = this.getRedirectUrl(user);
            this.router.navigate([targetUrl]);
        },
        error: (err) => {
           this.error = err.message || 'Login failed';

          
             // أظهر overlay
            this.showCaptchaOverlay = true;

            this.renderTurnstile();
        }
      });
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  private getRedirectUrl(user: any): string {
  /*   const roles = user?.roles || [];
    const isStudent = roles.some((role: string) => role?.toLowerCase() === 'student');

    if (isStudent) {
      return '/exam-journey';
    } */

    return this.returnUrl || '';
  }


  /************ Student Login here ************ */

 

  LogIpAddress()
  {
    this.IpBusiness.getIpAddress().subscribe((data)=>{
        localStorage.setItem("IpAddress",data.ip);
    })
     
  }



 renderTurnstile() {

  if (!window.turnstile) {
    console.error('Turnstile not loaded');
    return;
  }

  if (!this.turnstileWidget) {
    console.error('Widget element not found');
    return;
  }

  // إذا موجود → reset فقط
  if (this.captchaWidgetId) {

    window.turnstile.reset(this.captchaWidgetId);

    return;
  }

  this.captchaWidgetId = window.turnstile.render(
    this.turnstileWidget.nativeElement,
    {
      
      sitekey: '0x4AAAAAADTugCMD5KW_W1kA',
      size: 'normal',  
      callback: (token: string) => {

        this.captchaToken = token;

       
            // أخفِ overlay
        this.showCaptchaOverlay = false;

        // reset للمرة القادمة
        window.turnstile.reset(this.captchaWidgetId);

      },

      'error-callback': (err: any) => {
        console.error('Turnstile Error:', err);
      }
    }
  );
}
  /*
  executeCaptcha() {

    if (!window.turnstile) {
      console.error('Turnstile not loaded');
      return;
    }

    window.turnstile.render('#turnstile-widget', {
      sitekey: '0x4AAAAAADTugCMD5KW_W1kA',
      size: 'invisible',

      callback: (token: string) => {

        console.log('CAPTCHA SUCCESS:', token);

        this.captchaToken = token;

        // بعد نجاح CAPTCHA 
        this.onSubmit();
      },

      'error-callback': () => {
        console.error('CAPTCHA ERROR');
      }
    });
  }
  */

 
}
