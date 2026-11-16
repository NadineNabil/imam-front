import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, Observable, of } from 'rxjs';
import { ICourseBusiness, COURSE_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/course-business.contract';
import { SharedPagination } from 'src/app/domain/entities/shared-pagination.entity';
import { Course } from 'src/app/domain/entities/course.entity';
import { ToastService } from 'src/app/shared/services/toast-service';

@Component({
  selector: 'app-all-courses',
  standalone:false,
  templateUrl: './all-courses.component.html',
  styleUrl: './all-courses.component.scss',
})
export class AllCoursesComponent {
isLoading = true;
  page = 1;
allCourses:Course[]=[];
totalCourses:number=10;
pageSize:number=12
constructor(private router:Router ,private translate:TranslateService,@Inject(COURSE_BUSINESS_TOKEN) private readonly courseBusiness: ICourseBusiness,private toastService:ToastService){}
  ngOnInit(): void {
    this.getAllCourses();
  }
  onPageChange(event:number) {
    this.page = event;
    this.getAllCourses();
  }


  trackByCourseId(index: number, course: Course): number {
    return course.id;
  }
  getAllCourses(){
    const payload:SharedPagination={
      page:this.page,
      pageSize:this.pageSize
    }
  this.courseBusiness.getAllCourses(payload).pipe(
    catchError(error => {
      this.toastService.showError(
        this.translate.instant('COURSE.FETCH_ERROR_MESSAGE')
      );
      // Return empty result so component can continue
       this.isLoading = false;
      return of({ items: [], totalItems: 0 });
     
    })
  ).subscribe(result=>{
    this.allCourses = result.items;       // assign actual Subject[]
    this.totalCourses = result.totalItems; // total for paginator
    this.isLoading = false;
  })
  }
  onImageError(event:any) {
    event.target.src = 'assets/images/default-subject.jpg';
  }
  navigateToAddSubject(){
    this.router.navigate(['/courses/add-course']);
  }
  viewLearingUnit(course:Course){
    this.router.navigate(['/learningUnits/AlllearningUnits', course.id], { queryParams: { courseName: course.name } });
  }
}
