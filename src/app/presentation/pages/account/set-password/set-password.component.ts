import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AUTH_BUSINESS_TOKEN, IAuthBusiness } from 'src/app/domain/business-contracts/auth-business.contract';
import { ToastService } from 'src/app/shared/services/toast-service';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.scss',
  standalone:false
})
export class SetPasswordComponent implements OnInit, OnDestroy {
  showNavigationArrows: any;
  submitted = false;
  loading = false;
  error = '';
  returnUrl!: string;
  fieldTextType!: boolean;
  isDarkMode = localStorage.getItem('mode') === 'dark';
  email: string="example@gmail.com";
  regionBgImage: string = 'assets/images/auth-bg.jpg';
  regionImageLoaded: boolean = false;
  private destroy$ = new Subject<void>();

  confirmFieldTextType = false;

  setPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(AUTH_BUSINESS_TOKEN) private authBusiness: IAuthBusiness,
    private translate: TranslateService,
    private geolocationService: GeolocationService) {

    
    this.setPasswordForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordStrengthValidator.bind(this)
          ]
        ],

        confirmPassword: [
          '',
          [
            Validators.required
          ]
        ]
      },
      {
        validators: this.passwordMatchValidator.bind(this)
      }
    );
  }

  ngOnInit(): void {

  this.route.queryParams.subscribe(params => {

    this.email = params['email'];

   
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

  get f() {
    return this.setPasswordForm.controls;
  }

  togglePasswordVisibility(): void {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmFieldTextType = !this.confirmFieldTextType;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {

  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
  } else {
    confirmPassword.setErrors(null);
  }

  return null;
}

 passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    return !passwordValid ? { passwordStrength: true } : null;
  }

  onSubmit(): void {

    this.submitted = true;

   
    if (this.setPasswordForm.invalid) {
      return;
    }


    this.loading = true;



    const payload = {
      new_password: this.f['password'].value,
      comfirm_password: this.f['confirmPassword'].value,
      email: this.email
    };

   
    this.authBusiness.setPassword!(payload).subscribe({
      next: () => {
        this.loading = false;
    
        
        this.router.navigateByUrl('/account/login');

      },
      error: (err:any) => {
        this.error = err.message || 'Failed to set password';
        this.loading = false;
      }
    });    

    setTimeout(() => {
      this.loading = false;
    }, 1500);
  }
}
