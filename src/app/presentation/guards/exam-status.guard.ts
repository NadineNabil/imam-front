import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ExamStatusEnum } from 'src/app/domain/enums/exam-status.enum';
import { ExamStateService } from 'src/app/shared/services/exam-state.service';

export const examStatusGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const examState = inject(ExamStateService);
    const examId = Number(route.paramMap.get('id'));
  if (!examId) {
    router.navigate(['/view-exams']);
    return false;
  }
  const status=examState.getExamStatus(examId)
  if(!status || status=== ExamStatusEnum.FAILED){
      router.navigate(['/view-exams']);
    return false
  }
  return true;
};
