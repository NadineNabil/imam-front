import { Component, OnInit } from '@angular/core';
import { ICourseBusiness } from 'src/app/domain/business-contracts/course-business.contract';
import { COURSE_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/course-business.contract';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AUTH_BUSINESS_TOKEN, IAuthBusiness } from 'src/app/domain/business-contracts';
import { LanguageService, UnsavedChangesService } from 'src/app/shared/services';
import { ToastService } from 'src/app/shared/services/toast-service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutConfirmationModalComponent } from 'src/app/shared/components/logout-confirmation-modal/logout-confirmation-modal.component';

export interface ExamJourneyItem {
  id: number;
  name: string;
  subtitle: string;
  examId:string;
  description: string;
  duration: string;
  completedDate?: string;
  icon: string;
  done: boolean;
  expanded: boolean;
  report?: any;
}

@Component({
  selector: 'app-exam-journey',
  templateUrl: './exam-journey.component.html',
  styleUrls: ['./exam-journey.component.scss'],
  standalone: false
})
export class ExamJourneyComponent implements OnInit {

  exams: ExamJourneyItem[] = [];
  Username!:any;

  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'العربية', flag: 'assets/images/ksa.png', lang: 'ar' },
  ];
   flagvalue: any;

  constructor(
    @Inject(COURSE_BUSINESS_TOKEN) private readonly courseBusiness: ICourseBusiness,
    private router: Router,
    private toaster:ToastService,
    private unsavedChangesService: UnsavedChangesService,
    @Inject(AUTH_BUSINESS_TOKEN) private authBusiness: IAuthBusiness,
     public languageService: LanguageService,
      private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getExamsData();
    this.Username = this.authBusiness.getCurrentUser()?.firstName;
  }

  get currentDirection(): string {
    return this.languageService.getLanguage() === 'ar' ? 'rtl' : 'ltr';
  }

//Language Value Set 
  
setLanguage(text: string, lang: string, flag: string) {
 
    this.languageService.setLanguage(lang);
    localStorage.setItem('lang',lang)
  }

  get completedCount(): number {
    return this.exams.filter(x => x.done).length;
  }

  get remainingCount(): number {
    return this.exams.length - this.completedCount;
  }

  get progressPercent(): number {
    return Math.round((this.completedCount / this.exams.length) * 100);
  }

  isLocked(exam: ExamJourneyItem): boolean {
    const index = this.exams.indexOf(exam);
    if (index === 0) {
      return false;
    }
    return !this.exams[index - 1].done;
  }

  startExam(exam: ExamJourneyItem): void {

    this.router.navigateByUrl('exam/'+ exam.examId);

 
    exam.completedDate = 'اكتمل في ١٢ يوليو ٢٠٢٥';
  }

  toggleReport(exam: ExamJourneyItem): void {
    exam.expanded = !exam.expanded;
  }

  getProgressLabel(): string {
    if (this.completedCount === 0) {
      return this.languageService.getLanguage() === 'ar'
        ? 'ابدأ رحلتك التقييمية'
        : 'Start your assessment journey';
    }
    if (this.completedCount === this.exams.length) {
      return this.languageService.getLanguage() === 'ar'
        ? 'تهانينا! اكتملت جميع التقييمات'
        : 'Congratulations! All assessments are complete';
    }
    if (this.completedCount === 1) {
      return this.languageService.getLanguage() === 'ar'
        ? 'تقدم جيد، اختباران متبقيان'
        : 'Good progress, two tests remaining';
    }
    return this.languageService.getLanguage() === 'ar'
      ? `تقدم ممتاز، ${this.remainingCount} متبقٍ`
      : `Excellent progress, ${this.remainingCount} remaining`;
  }

  setDemoState(completed: number, expandedReport: boolean = false): void {
    this.exams.forEach((ex, idx) => {
      ex.done = idx < completed;
      ex.expanded = idx === 0 && completed > 0 ? expandedReport : false;
    });
  }


  mapApiResponseToExams(payload: any[]): ExamJourneyItem[] {

   
    return payload.map((item, index) => ({
      id: item.course_id ,
      name: item.last_exam.name ,
      examId:item.last_exam.id,
      subtitle: item.course_name ,
      description: '',
      duration: '',
      completedDate: item.last_exam?.completed_at ? `اكتمل في ${item.last_exam.completed_at}` : undefined,
      icon: index === 0 ? 'pi pi-prime' : index === 1 ? 'pi pi-book' : 'pi pi-code',
      done: item.solved,
      expanded: item.solved ? true : false
    }));
  }

  getExamsData(): void {
   
    this.courseBusiness.getCoursesWithLastExam(225).subscribe({
      next: (response) => {
        console.log(response);
        this.exams = this.mapApiResponseToExams(response || []);

        this.exams
          .filter(x => x.done)
          .forEach(exam => {

            this.courseBusiness.getExamReport(exam.examId).subscribe((report:any) => {

              exam.report = report;
              exam.expanded = true;

            });

          });
        

          this.checkAllExamsCompleted();
          

      },
      error: (err) => {
        console.error('Exam journey API error', err);
        this.exams = [];
      }
    });
  }

  private checkAllExamsCompleted(): void {
    if (
      this.exams.length > 0 &&
      this.exams.every(exam => exam.done)
    ) {
      const messageKey = 'EXAM_JOURNEY.MESSAGES.COMPLETION_SUCCESS';
      this.languageService.translate.get(messageKey).subscribe((message: string) => {
         Swal.fire(message);
      });

          
    }
  }



    logout() {
      this.unsavedChangesService.canDeactivate().subscribe((canLeave) => {
        if (!canLeave) {
          return;
        }
        const modalRef = this.modalService.open(LogoutConfirmationModalComponent, { centered: true });
        modalRef.result.then((result) => {
          if (result === 'confirm') {
            this.authBusiness.logout().subscribe({
              complete: () => {
                this.router.navigate(['/account/auth/logout']);
              }
            });
          }
        }, () => { });
      });
    }

}