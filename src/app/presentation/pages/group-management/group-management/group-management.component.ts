import { ToastService } from 'src/app/shared/services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { GROUP_BUSINESS_TOKEN, IGroupBusiness } from './../../../../domain/business-contracts/group-business.contract';
import { Component, Inject, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Group } from 'src/app/domain/entities/group.entity';
import { SharedPagination } from 'src/app/domain/entities/shared-pagination.entity';
import { CreateGroupModalComponent } from '../create-group-modal/create-group-modal.component';
import { Router } from '@angular/router';
import { studentStatus } from 'src/app/domain/enums/student-status.enum';
import { group } from 'node_modules/@angular/animations/types/_animation_player-chunk';

@Component({
  selector: 'app-group-management',
  standalone:false,
  templateUrl: './group-management.component.html',
  styleUrl: './group-management.component.scss',
})
export class GroupManagementComponent implements OnInit {
  
allGroups:Group[]=[];
studentStatus=studentStatus
totalGroups:number=0;
pendingExist:boolean=false
activeExist:boolean=false
isLoading:boolean=false
pageSize=6
page=1

constructor(
  private toastService: ToastService,
  private translate: TranslateService,
  private router:Router,
  @Inject(GROUP_BUSINESS_TOKEN) private readonly groupBusiness: IGroupBusiness,
){}
  ngOnInit(): void {
    this.getAllGroups();
  }
  onPageChange(event:number) {
    this.page = event;
    this.getAllGroups();
  }
  getAllGroups(){

    const payload:SharedPagination={
        page:this.page,
        pageSize:this.pageSize
      }

      this.isLoading = true;

      this.groupBusiness.getAllGroups(payload).pipe(
      catchError(error => {

        this.toastService.showError(
         error
        );
        // Return empty result so component can continue
         this.isLoading = false;
        return of({ items: [], totalItems: 0 });
       
      })
    ).subscribe(result=>{


      this.allGroups = result.items;    
      this.totalGroups = result.totalItems; 
      this.isLoading = false;
    })
    
    }
  getStudentStatus(groupId:number){
  const group = this.allGroups.find(g => g.id === groupId);

  if(!group) {
    return { Active: 0, Pending: 0 };
  }

  const Active = group.activeStudentsCount || 0;
  const Pending = group.pendingStudentsCount || 0;


  return { Active, Pending };
  }

  viewGroup(groupId:number){
     this.router.navigate(['group-management/view-group', groupId]);
  }



  onGroupCreated(groupCreated:any) {

     const mappedGroup = {
    id: groupCreated.id,
    name: groupCreated.name,
    description: groupCreated.description,
    CreatedDate: groupCreated.created_at,
    studentsCount: groupCreated.students_count,
    studentStatus: {
      Active: groupCreated.active_students_count,
      Pending: groupCreated.pending_students_count
    }
  };

      this.allGroups.push(mappedGroup);
      this.totalGroups++;
  }
}
