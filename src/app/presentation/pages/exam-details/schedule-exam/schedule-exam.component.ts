import { ToastService } from './../../../../shared/services/toast-service';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-schedule-exam',
  templateUrl: './schedule-exam.component.html',
  styleUrl: './schedule-exam.component.scss',
  standalone: false
})
export class ScheduleExamComponent implements OnInit{

  @Input() scheduleForm!: FormGroup;
  hoveredDate: NgbDate | null = null;
  fromNGDate: NgbDate | null = null;
  toNGDate: NgbDate | null = null;
/*     inlineDatePicker: Date = new Date();
 */  inlineDatePicker: string = '';
  timePicker: Date | undefined;
  minDate: Date = new Date(new Date().setHours(0, 0, 0, 0));
  constructor(private toastr: ToastService, private translate: TranslateService) { }
  ngOnInit(): void {
    // if picked the time first then date , then i have to validate the time in this case
  this.scheduleForm.get('scheduleDate')?.valueChanges
    .subscribe(() => this.onStartTimeChange());

  this.scheduleForm.get('scheduleTime')?.valueChanges
    .subscribe(() => this.onStartTimeChange());
    }
  onDateChange(Event: any) {
    this.inlineDatePicker = (Event.dateString.toString());
    this.scheduleForm.patchValue({ scheduleDate: this.inlineDatePicker });
  }
  onEndDateChange(event: any) {
    const endDate = event.dateString;
    const startDate = this.scheduleForm.get('scheduleDate')?.value;

    if (startDate && new Date(endDate) < new Date(startDate)) {
      // reset end date
      this.scheduleForm.patchValue({ endDate: null });

      this.toastr.showError(this.translate.instant('EXAMS.END_DATE_SHOULD'));

      return;
    }

    this.scheduleForm.patchValue({ endDate });
  }
  onStartTimeChange() {
 this.validateTimes()
  }
  onEndTimeChange() {
  this.validateTimes();
    }

  validateTimes() {
  const startDate = new Date(this.scheduleForm.get('scheduleDate')?.value);
  const endDate = new Date(this.scheduleForm.get('endDate')?.value);

  const startTime = this.scheduleForm.get('scheduleTime')?.value;
  const endTime = this.scheduleForm.get('endTime')?.value;

  const now = new Date();

  // reset errors first
  this.scheduleForm.get('scheduleTime')?.setErrors(null);
  this.scheduleForm.get('endTime')?.setErrors(null);

  // START validation
  if (startDate && startTime) {
    const [h, m] = startTime.split(':').map(Number);
    const start = new Date(startDate);
    start.setHours(h, m, 0, 0);

    if (start < now) {
      this.scheduleForm.get('scheduleTime')?.setErrors({ pastTime: true });
    }
  }

  // END validation
  if (endDate && endTime) {
    const [h, m] = endTime.split(':').map(Number);
    const end = new Date(endDate);
    end.setHours(h, m, 0, 0);

    if (end < now) {
      this.scheduleForm.get('endTime')?.setErrors({ pastTime: true });
    }
  }
}
}
