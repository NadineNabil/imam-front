import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IAuthBusiness, AUTH_BUSINESS_TOKEN } from '../../../../../domain/business-contracts';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';

@Component({
    selector: 'app-recoverpwd',
    templateUrl: './recoverpwd.component.html',
    styleUrls: ['./recoverpwd.component.scss'],
    standalone: false
})

/**
 * Recover Password Component
 */
export class RecoverpwdComponent implements OnInit, OnDestroy {

  resetForm!: UntypedFormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;
    isDarkMode = localStorage.getItem('mode') === 'dark';
  regionBgImage: string = 'assets/images/auth-bg.jpg';
  regionImageLoaded: boolean = false;
  private destroy$ = new Subject<void>();

 /**
   * Custom email validator matching domain layer regex
   * Same pattern as AuthCredentials entity
   */
 emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { email: true };
  }
  // Carousel navigation arrow show
  showNavigationArrows: any;

  constructor(private formBuilder: UntypedFormBuilder, 
    private router: Router,
    private translate: TranslateService,
    private storageService: StorageService,
    private geolocationService: GeolocationService,
    @Inject(AUTH_BUSINESS_TOKEN) private authBusiness: IAuthBusiness
  ) { }

  ngOnInit(): void {
    /**
     * Form Validation
     */
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, this.emailValidator]],
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

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.success = '';
    this.submitted = true;
    // stop here if form is invalid
    if (this.resetForm.invalid) {
      console.log(this.resetForm.errors);
      return;
    }
    this.loading = true;

    // Call business contract instead of direct use case
    this.authBusiness.sendOtp(this.resetForm.value.email).subscribe({
      next: () => {
        this.loading = false;
        this.storageService.set('email', this.resetForm.value.email);
        this.router.navigate(['/account/auth/otp-verification']);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err|| this.translate.instant('RECOVERPWD.FAILED_TO_SEND_PASSWORD_RESET_EMAIL');
      }
    });
  }

}
