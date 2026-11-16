import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

// Business contracts from domain layer - Clean Architecture
import { IAuthBusiness, AUTH_BUSINESS_TOKEN } from '../../../../domain/business-contracts';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: false
})

/**
 * Register Component - Refactored for Clean Architecture
 * Uses Business contracts instead of direct use case calls
 */
export class RegisterComponent implements OnInit, OnDestroy {

  year: number = new Date().getFullYear();
  showNavigationArrows: any;
  signupForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  successmsg = false;
  error = '';
  fieldTextType = false;
  confirmFieldTextType = false;
  isDarkMode = localStorage.getItem('mode') === 'dark';
  regionBgImage: string = 'assets/images/auth-bg.jpg';
  regionImageLoaded: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    // Inject Business contract instead of use case
    @Inject(AUTH_BUSINESS_TOKEN) private authBusiness: IAuthBusiness,
    private geolocationService: GeolocationService
  ) { }

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
   * Custom validator for password strength
   */
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

  /**
   * Custom validator to check if passwords match
   */
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      fullname: ['', [Validators.required, Validators.minLength(3),Validators.pattern(/^(?=.*[A-Za-z\u0600-\u06FF])[A-Za-z\u0600-\u06FF ]+$/),Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email,this.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
    document.body.setAttribute('data-layout', 'vertical');
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

  get f() { return this.signupForm.controls; }

  /**
   * Toggle password visibility
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  /**
   * Toggle confirm password visibility
   */
  toggleConfirmFieldTextType() {
    this.confirmFieldTextType = !this.confirmFieldTextType;
  }

  /**
   * On submit form - Uses AuthBusiness contract
   */
  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;

    // Call business contract instead of direct use case
    this.authBusiness.register(
      this.f['email'].value,
      this.f['password'].value,
      this.f['fullname'].value.trim()
    )
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (user) => {
          this.successmsg = true;
          this.router.navigate(['/account/login']);
        },
        error: (err) => {
          this.error = err.message || 'Registration failed';
        }
      });
  }
}
