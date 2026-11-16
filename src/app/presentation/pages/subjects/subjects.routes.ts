import { Routes } from '@angular/router';
import { AddSubjectComponent } from './add-subject/add-subject.component';
import { AllSubjectsComponent } from './all-subjects/all-subjects.component';

export const SUBJECT_ROUTES: Routes = [
/*   { path: '', component: SubjectListComponent },
 */  { path: '', component: AllSubjectsComponent },
 { path: 'all-subjects', component: AllSubjectsComponent },
 { path: 'add', component: AddSubjectComponent }
];
