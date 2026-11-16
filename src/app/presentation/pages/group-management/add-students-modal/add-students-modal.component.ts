import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ADMIN_STUDENT_BUSINESS_TOKEN, IAdminStudentBusiness } from 'src/app/domain/business-contracts/admin-student-business.contract';
import { GROUP_BUSINESS_TOKEN, IGroupBusiness } from 'src/app/domain/business-contracts/group-business.contract';
import { INVITATION_BUSINESS_TOKEN, InvitationBusiness } from 'src/app/domain/business-contracts/invitations-business.contract';
import { Student } from 'src/app/domain/entities/student.entity';
import { ToastService } from 'src/app/shared/services/toast-service';

@Component({
  selector: 'app-add-students-modal',
  standalone: false,
  templateUrl: './add-students-modal.component.html',
  styleUrl: './add-students-modal.component.scss',
})
export class AddStudentsModalComponent {


 private modal: any;

 constructor(@Inject(ADMIN_STUDENT_BUSINESS_TOKEN) private readonly studentBusiness: IAdminStudentBusiness,
             @Inject(GROUP_BUSINESS_TOKEN) private readonly groupBusiness: IGroupBusiness,
              @Inject(INVITATION_BUSINESS_TOKEN) private readonly InvitationBusiness: InvitationBusiness,

            private toastService: ToastService,
private translate: TranslateService) {}

ngAfterViewInit(): void {
  const element = document.getElementById('AddStudentsGroupModal');
  if (element) {
    this.modal = (window as any).bootstrap?.Modal?.getOrCreateInstance(element);
  }
}

students: Student[] = [];
selectedStudents: number[] = [];
@Output() studentAdded = new EventEmitter<Student[]>();

@Input()
set group(value: any) {
  this._group = value;

  if (value?.id) {
    this.loadStudents(value.id);
  }
}

get group(): any {
  return this._group;
}

private _group: any;

searchTerm: string = '';


private loadStudents(groupId: number): void {


  this.studentBusiness.getStudents(groupId, '').subscribe({
    next: (students) => {
      this.students = students;
      console.log('Students loaded:', students);
      this.selectedStudents = [];
    }
  });
}

onHideModal(): void {
  (document.activeElement as HTMLElement)?.blur();
   this.selectedStudents = [];
}
onStudentSelectionChange(studentId: number, event: Event): void {
  const isChecked = (event.target as HTMLInputElement).checked;

  if (isChecked) {
    this.selectedStudents.push(studentId);
  } else {
    this.selectedStudents = this.selectedStudents.filter(
      (id) => id !== studentId
    );
  }
}

addStudentsToGroup(): void {

  if (this.selectedStudents.length > 0) {

    //get student that have ids in selectedStudents
    const selectedStudentObjects = this.students.filter(student => this.selectedStudents.includes(student.id));

    this.groupBusiness.Add_Students_To_Group(this.group.id, this.selectedStudents).subscribe({
      next: () => {
        this.toastService.showSuccess(this.translate.instant('GROUP_MANAGEMENT.ADD_STUDENTS_SUCCESS_MESSAGE'));
        this.modal.hide(selectedStudentObjects);
        this.studentAdded.emit(selectedStudentObjects);
      },
      error: (error) => {
        this.toastService.showError(this.translate.instant('GROUP_MANAGEMENT.ADD_STUDENTS_ERROR_MESSAGE'));
      }
    });
  }
}

newStudentEmail: string = '';

addNewStudent():void
{
}

}
