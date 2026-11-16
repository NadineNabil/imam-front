import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ILearningUnitBusiness, LEARNING_UNIT_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/learning-unit-business.contract';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddStudentModalComponent } from '../add-student-modal/add-student-modal.component';
import { COURSE_BUSINESS_TOKEN, ICourseBusiness } from 'src/app/domain/business-contracts/course-business.contract';
import { ToastService } from 'src/app/shared/services/toast-service';
import { LearningUnits } from 'src/app/domain/entities/learningUnits.entity';
  
@Component({
  selector: 'app-view-learningUnits',
  templateUrl: './view-learningUnits.component.html',
  styleUrl: './view-learningUnits.component.scss',
  standalone: false
})
export class ViewLearningUnitsComponent implements OnInit {

   learningUnits:LearningUnits[]=[];
   loading: boolean = false;
   courseId: number | null = null;
   courseName: any;
  // invitations are displayed on the dedicated Invitations page now

  constructor(
    @Inject(LEARNING_UNIT_BUSINESS_TOKEN) private LearningUnitBusiness: ILearningUnitBusiness,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private modalService: NgbModal,
    @Inject(COURSE_BUSINESS_TOKEN) private courseBusiness: ICourseBusiness,
    private toastService: ToastService
  ) {}

  // open modal to add student, then call course business enrollStudent
  openAddStudent() {
    if (!this.courseId) return;
   
      const modalRef = (this as any).modalService.open(AddStudentModalComponent, { centered: true });
     
      (modalRef.componentInstance as any).courseId = Number(this.courseId);
      
      modalRef.result.then((response: any) => {
      
         
            if(response.result) {
              
              this.toastService.showSuccess(this.translate.instant( 'COURSE.ADD_STUDENT.'+response.message));
            }
            else
            {
              this.toastService.showError(this.translate.instant('COURSE.ADD_STUDENT.ERROR_NO_IMPL'));
            }
          });
        }



    ngOnInit() {


      this.courseId = this.route.snapshot.paramMap.get('id') as unknown as number;
      this.courseName = this.route.snapshot.queryParamMap.get('courseName') || (this.route.snapshot.paramMap.get('courseName') as unknown as string);
     
    
    this.loading = true;


    this.LearningUnitBusiness.getAll(this.courseId).subscribe({
      next: (data:any) => {

        this.learningUnits = data;
      
        this.loading = false;
      },
      error: (error) => {
        
        this.loading = false;
      }
    });  
}


  viewlearningUnitDetails(learningUnitId:number|undefined) {
    if (learningUnitId) {
      this.router.navigate(['learningUnits/learningUnit-details/', learningUnitId]);
    }
    
  }

  addNewlearningUnit() {
    this.router.navigate(['learningUnits/addlearningUnit/', this.courseId], { queryParams: { courseName: this.courseName } });
  }
  editCourse(){
    this.router.navigate(['courses/edit-course/', this.courseId]);
  }
}

