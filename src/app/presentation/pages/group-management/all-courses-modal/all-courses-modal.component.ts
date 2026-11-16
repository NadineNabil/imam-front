import { Component, Inject, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { COURSE_BUSINESS_TOKEN, ICourseBusiness } from 'src/app/domain/business-contracts/course-business.contract';
import { Course } from 'src/app/domain/entities/course.entity';
import { SharedPagination } from 'src/app/domain/entities/shared-pagination.entity';
import { ToastService } from 'src/app/shared/services/toast-service';

@Component({
  selector: 'app-all-courses-modal',
  standalone: false,
  templateUrl: './all-courses-modal.component.html',
  styleUrl: './all-courses-modal.component.scss',
})
export class AllCoursesModalComponent implements OnInit {
selectedCourses: number[] = [];
courses: Course[] = [];
searchTerm: string = '';
@Input() group: any;
 private modal: any;

constructor(@Inject(COURSE_BUSINESS_TOKEN) private readonly COURSE_BUSINESS: ICourseBusiness,
private toastService: ToastService,
private translate: TranslateService) {}

ngAfterViewInit(): void {
  const element = document.getElementById('AllCoursesGroupModal');
  if (element) {
    this.modal = (window as any).bootstrap?.Modal?.getOrCreateInstance(element);
  }
}



onCourseSelectionChange(courseId: number, event: any) {
  if (event.target.checked) {
    if (!this.selectedCourses.includes(courseId)) {
      this.selectedCourses.push(courseId);
    }
  } else {
    this.selectedCourses = this.selectedCourses.filter(id => id !== courseId);
  }
}


assignGroupToCourse() {
  if (this.selectedCourses.length > 0) {
    console.log(`Assigning group to courses with IDs: ${this.selectedCourses.join(', ')}`);
    
    this.selectedCourses.forEach(courseId => {
     
       this.COURSE_BUSINESS.inviteGroupToCourse(courseId, this.group.id).subscribe({
      next: () => {
        this.toastService.showSuccess(this.translate.instant('GROUP_MANAGEMENT.ASSIGN_SUCCESS_MESSAGE'));
        this.modal.hide();
        console.log('Group assigned to course successfully');
      },
      error: (error) => {
        this.toastService.showError(this.translate.instant('GROUP_MANAGEMENT.ASSIGN_ERROR_MESSAGE'));
      }
    });   
    

    });

   
  } else {
    console.log('No courses selected');
  }
}


ngOnInit() {

        
  this.COURSE_BUSINESS.getAll().subscribe(courses => {
    this.courses = courses;
  });
}
}
