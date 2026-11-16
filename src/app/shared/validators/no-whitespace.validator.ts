import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validator that rejects strings which are only whitespace.
 * Usage: control.setValidators([noWhitespaceValidator]);
 */
export function noWhitespaceValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  if (typeof value === 'string' && value.trim().length === 0) {
    return { whitespace: true };
  }

  return null;
}

export default noWhitespaceValidator;
