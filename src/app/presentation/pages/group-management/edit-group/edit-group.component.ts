import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GROUP_BUSINESS_TOKEN, IGroupBusiness } from 'src/app/domain/business-contracts/group-business.contract';
import { Group } from 'src/app/domain/entities/group.entity';
import { studentStatus } from 'src/app/domain/enums/student-status.enum';
import { ConfirmationDialogService } from 'src/app/shared/services/confirmation-dialog.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-group',
  standalone:false,
  templateUrl: './edit-group.component.html',
  styleUrl: './edit-group.component.scss',
})
export class EditGroupComponent implements OnInit{
 group: any ;
  studentStatus=studentStatus
  GroupId:string=''
  isEditMode = false;
  editableGroup = {
    id:'',
  name: '',
  description: ''
};
selectedGroup: any;

constructor(private confirmationDialogService:ConfirmationDialogService,private translate:TranslateService,@Inject(GROUP_BUSINESS_TOKEN) private readonly groupBusiness: IGroupBusiness,
private activatedRoute:ActivatedRoute,
private router:Router
){

}
ngOnInit(): void {
  this.activatedRoute.paramMap.subscribe(params => {
    this.GroupId = params.get('id')||'';

    if (!this.GroupId) return;

    this.groupBusiness.getGroupById(Number(this.GroupId)).subscribe(res => {
      this.group=res;
    }, (error) => {
         Swal.fire({
        icon: 'error',
        text: error , 
      });
    });
  });
}



toggleEditMode() {
  this.isEditMode = !this.isEditMode;

  if (this.isEditMode) {
    this.editableGroup = {
      id:this.GroupId,
      name: this.group.name,
      description: this.group.description||''
    };
  }
}

saveGroup() {

  this.isEditMode = false;
    const groupPayload:Group={
          id:Number(this.GroupId),
          name:this.editableGroup.name,
          description:this.editableGroup.description
    }

  this.groupBusiness.updateGroup(groupPayload).subscribe({
    next:()=>{

        this.group.name = this.editableGroup.name;
        this.group.description = this.editableGroup.description;


      Swal.fire({
        icon: 'success',
        text: this.translate.instant('GROUP_MANAGEMENT.UPDATE_SUCCESS_MESSAGE'),
      });
    },
    error:(error)=>{
      Swal.fire({
        icon: 'error',
        text: error , 
      });
    }
      
  })

}
deleteGroup(gpId:number) {

  this.confirmationDialogService.showConfirmationDialog(
    'GROUP_MANAGEMENT.DELETE_GROUP_TITLE',
    'GROUP_MANAGEMENT.DELETE_GROUP_MESSAGE',
    'COMMON.DELETE'
  ).then((confirmed) => {
    if (confirmed) {
     this.groupBusiness.deleteGroup(gpId).subscribe({
      next:()=>{
        Swal.fire({
          icon: 'success',
          text: this.translate.instant('GROUP_MANAGEMENT.DELETE_SUCCESS_MESSAGE'),
        });

        //return back to group management page
        setTimeout(() => {
          this.router.navigate(['/group-management']);
        }, 1000);
      },
      error:(error)=>{
        Swal.fire({
          icon: 'error',
          text: error,
           });
      }
    });
}
});
}

removeMember(stdId:number,gpId:number) {
  this.confirmationDialogService.showConfirmationDialog(
    'GROUP_MANAGEMENT.REMOVE_MEMBER_TITLE',
    'GROUP_MANAGEMENT.REMOVE_MEMBER_MESSAGE',
    'GROUP_MANAGEMENT.REMOVE'
  ).then((confirmed) => {
    if (confirmed) {
      // remove logic here

      
      this.groupBusiness.Remove_Student_From_Group(gpId,stdId).subscribe({
        next:()=>{
          Swal.fire({
            icon: 'success',
            text: this.translate.instant('GROUP_MANAGEMENT.REMOVE_MEMBER_SUCCESS_MESSAGE'),
          });

          this.group.students = this.group.students.filter((student: any) => student.id !== stdId);
        },
        error:(error)=>{
          Swal.fire({
            icon: 'error',
            text: error,
          });
        }
      });
    }
  });
}

onStudentAdded(newStudents: any[]) {
  if (!this.group.students) {
    this.group.students = [];
  }
  this.group.students.push(...newStudents);
}

}