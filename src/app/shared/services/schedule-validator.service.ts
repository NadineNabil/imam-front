import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const scheduleValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {

  const startDate: Date = form.get('scheduleDate')?.value;
  const startTime: string = form.get('scheduleTime')?.value;
  const endDate: Date = form.get('endDate')?.value;
  const endTime: string = form.get('endTime')?.value;

  if (!startDate || !startTime || !endDate || !endTime) {
    return { requiredFields: true };
  }

  // Clone dates so we don't modify the form values
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Split "HH:mm" into numbers
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  // Set the hours and minutes
  start.setHours(startHour, startMinute, 0, 0);
  end.setHours(endHour, endMinute, 0, 0);

  console.log(start, end, 'parsed dates');

  if (end <= start) {
    return { invalidSchedule: true };
  }

  return null;
};