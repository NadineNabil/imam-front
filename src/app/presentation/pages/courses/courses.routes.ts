import { Routes } from '@angular/router';
import { AddCourseComponent } from './add-course/add-course.component';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { StudentCoursesComponent } from './student-courses/student-courses.component';
import { StudentCourseDetailsComponent } from './student-course-details/student-course-details.component';
import { RoleGuard } from '../../guards/role.guard';
export const COURSE_ROUTES: Routes = [
  { path: '', component: AllCoursesComponent },
  {
    path: 'all-courses', component: AllCoursesComponent,
    canActivate: [RoleGuard],
    data: {
      roles: ['organization_admin']
    },
  },
  {
    path: 'add-course', component: AddCourseComponent,
    canActivate: [RoleGuard],
    data: {
      roles: ['organization_admin']
    },
  },
  {
    path: 'edit-course/:id', component: EditCourseComponent,
    canActivate: [RoleGuard],
    data: {
      roles: ['organization_admin']
    },
  },
  {
    path: 'my-courses', component: StudentCoursesComponent,
    canActivate: [RoleGuard],
    data: {
      roles: ['student']
    },
  },
  {
    path: 'my-courses/:id', component: StudentCourseDetailsComponent,
    canActivate: [RoleGuard],
    data: {
      roles: ['student']
    },
  }
];
