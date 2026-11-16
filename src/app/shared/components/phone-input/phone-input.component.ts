import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  ViewChild
} from '@angular/core';

import intlTelInput from 'intl-tel-input';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'app-phone-input',
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss'],
  standalone:false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true
    }
  ]
})
export class PhoneInputComponent implements AfterViewInit, ControlValueAccessor {

  @ViewChild('phoneInput') phoneInput!: ElementRef;

  iti: any;

  value: { phoneNumber: string; countryCode: string ,isValid: boolean} = { phoneNumber: '', countryCode: '', isValid: false };

  onChange = (value: any) => {};
  onTouched = () => {};

  ngAfterViewInit(): void {

this.iti = intlTelInput(this.phoneInput.nativeElement, {
  separateDialCode: true,

  loadUtils: () =>
    import('intl-tel-input/utils')
});

    // Set the stored value after intlTelInput is initialized
if (this.value?.phoneNumber) {
  const dial = this.value.countryCode.startsWith('+')
    ? this.value.countryCode
    : `+${this.value.countryCode}`;

  this.iti.setNumber(dial + this.value.phoneNumber);
}
    // when user types
    this.phoneInput.nativeElement.addEventListener('input', () => {
  this.sendPhoneNumber()
  });
  }

  // ✔ Reactive Forms → set value from parent
writeValue(value: any): void {
  this.value = value || {
    phoneNumber: '',
    countryCode: '',
    isValid: false
  };

  if (!this.iti) {
    return;
  }

  const dial = this.value.countryCode.startsWith('+')
    ? this.value.countryCode
    : `+${this.value.countryCode}`;

  this.iti.setNumber(dial + this.value.phoneNumber);
}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  sendPhoneNumber() {
    const number = this.iti.getNumber();
    const dialCode =
      this.iti.getSelectedCountryData().dialCode;
       const country = this.iti.getSelectedCountryData().iso2;
     let isValid = this.iti.isValidNumber();
     
   if (country === 'eg') {
    // Remove +20
    const local = number.replace(/^\+20/, '');

    isValid = /^1[0125]\d{8}$/.test(local);
  }
this.value = {
  phoneNumber: number,
  countryCode: dialCode ? `+${dialCode}` : '',
  isValid
};
  this.onChange(this.value);
}
}