import { ScheduleDateRequestDto } from "../dto/request/schedule-date.request.dto";

export class ScheduleDateMapper {

  // Converts front-end date + time to backend DTO
  static toRequestDto(
  scheduleDate: string | Date,
  scheduleTime: string,
  endDate: string | Date,
  endTime: string
): ScheduleDateRequestDto {
  // Parse start date
  let start: Date = typeof scheduleDate === 'string' ? new Date(scheduleDate) : scheduleDate;
  if (scheduleTime) {
    const [hours, minutes] = scheduleTime.split(':').map(Number);
    start.setHours(hours, minutes, 0, 0);
  }

  // Parse end date
  let end: Date = typeof endDate === 'string' ? new Date(endDate) : endDate;
  if (endTime) {
    const [hours, minutes] = endTime.split(':').map(Number);
    end.setHours(hours, minutes, 0, 0);
  }

  return {
    scheduled_date: start.toISOString(),
    end_date: end.toISOString(),
  };
}

  // Converts backend ISO string back to front-end model
static fromResponseDto(
  scheduledDate: string | Date | null | undefined,
  endDate?: string | Date | null | undefined
): { scheduleDate: string; scheduleTime: string; endDate: string; endTime: string } {

  const formatDateTime = (dateInput: string | Date | null | undefined) => {
    if (!dateInput) return { date: '', time: '' };

    let date: Date;

    if (typeof dateInput === 'string') {
      //i will remove this when back adding the missing z of UTC
      date = new Date(dateInput.endsWith('Z') ? dateInput : dateInput + 'Z');
    } else {
      date = dateInput;
    }

    const dateStr =
      date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');

    const timeStr =
      String(date.getHours()).padStart(2, '0') + ':' +
      String(date.getMinutes()).padStart(2, '0');

    return { date: dateStr, time: timeStr };
  };

  const start = formatDateTime(scheduledDate);
  const end = formatDateTime(endDate);

  return {
    scheduleDate: start.date,
    scheduleTime: start.time,
    endDate: end.date,
    endTime: end.time,
  };
}
}