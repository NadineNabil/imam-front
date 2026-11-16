import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Exam } from 'src/app/domain/entities/exam.entity';

@Injectable({
  providedIn: 'root',
})
export class ExamStateService {
  private examsSubject=new BehaviorSubject<Exam[]>([]);
  exams$=this.examsSubject.asObservable();
  setExams(exams:Exam[]){
    this.examsSubject.next(exams)
  }
  getExamStatus(id: string | number): string | undefined{
    const exam=this.examsSubject.value.find(e => e.id === id)
    return exam?.examStatus
  }
}
