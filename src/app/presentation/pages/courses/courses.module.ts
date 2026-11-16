import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "src/app/shared/shared.module";
import { COURSE_ROUTES } from '../courses/courses.routes';
import { AddCourseComponent } from './add-course/add-course.component';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { StudentCoursesComponent } from './student-courses/student-courses.component';
import { StudentCourseDetailsComponent } from './student-course-details/student-course-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from "angular-feather";
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    AddCourseComponent,
    AllCoursesComponent,
    EditCourseComponent,
    StudentCoursesComponent,
    StudentCourseDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(COURSE_ROUTES),
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgSelectModule,
    FeatherModule,
    NgApexchartsModule,
    NgxEchartsModule
]
})

export class CoursesModule {}
