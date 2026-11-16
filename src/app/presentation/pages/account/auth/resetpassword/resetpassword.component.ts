import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AUTH_BUSINESS_TOKEN, IAuthBusiness } from 'src/app/domain/business-contracts';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/shared/services/toast-service';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss'],
  standalone: false
})
export class ResetpasswordComponent implements OnInit, OnDestroy {
  year: number = new Date().getFullYear();
  resetPasswordForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
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
    private translate: TranslateService,
    @Inject(AUTH_BUSINESS_TOKEN) private authBusiness: IAuthBusiness,
    private storageService: StorageService,
    private toastr: ToastService,
    private geolocationService: GeolocationService
  ) { }

  /**
   * Custom validator for password strength
   * Same rules as RegisterComponent
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
   * Same logic as RegisterComponent
   */
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator.bind(this)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator.bind(this)
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

  get f() { return this.resetPasswordForm.controls; }

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

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.loading = true;

    // TODO: Call API to actually reset password using token
    this.authBusiness.updatePassword(this.storageService.get('email') || '', this.resetPasswordForm.value.password, this.resetPasswordForm.value.confirmPassword,this.storageService.get('token') || '').subscribe({
      next: () => {
        this.loading = false;
        this.toastr.showSuccess(this.translate.instant('RESET_PASSWORD.Done'));
        this.router.navigate(['/account/login']);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err|| this.translate.instant('RESETPASSWORD.FAILED_TO_RESET_PASSWORD');
      }
    });
  }
}

