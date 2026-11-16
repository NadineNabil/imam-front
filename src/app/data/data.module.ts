import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AUTH_REPOSITORY_TOKEN } from '../domain/repository-contracts/auth-repository.contract';
import { USER_REPOSITORY_TOKEN } from '../domain/repository-contracts/user-repository.contract';
import { AuthRepositoryImpl } from './repositories/auth.repository.impl';
import { AuthRepositoryFake } from './repositories/auth.repository.fake';
import { UserRepositoryImpl } from './repositories/user.repository.impl';

// Interceptors
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

// Environment
import { environment } from '../../environments/environment';
import { KnowledgeSourceRepositoryImpl } from './repositories/KnowledgeSource.repository';
import { KnowledgeSource_REPOSITORY_TOKEN } from '../domain/repository-contracts/KnowledgeSource-repository.contract';
import { CourseRepositoryImpl } from './repositories/course.repository';
import { COURSE_REPOSITORY_TOKEN } from '../domain/repository-contracts/course-repository.contract';
import { CATEGORY_REPOSITORY_TOKEN } from '../domain/repository-contracts/category-repository.contract';
import { CategoryRepositoryImpl } from './repositories/category.repository';
import { SubCategoryRepositoryImpl } from './repositories/subCategory.repository';
import { SUBCATEGORY_REPOSITORY_TOKEN } from '../domain/repository-contracts/subCategory-repository.contract';
import { LearningUnitRepositoryImpl } from './repositories/learning-unit.repository';
import { LEARNING_UNIT_REPOSITORY_TOKEN } from '../domain/repository-contracts/learning-unit-repository.contract';
import { ObjectiveRepositoryImpl } from './repositories/objective.repository';
import { OBJECTIVE_REPOSITORY_TOKEN } from '../domain/repository-contracts/objective-repository.contract';
import { ExamRepositoryImpl } from './repositories/exam.repository';
import { EXAM_REPOSITORY_TOKEN } from '../domain/repository-contracts/exam-repository.contract';
import {  SettingsRepositoryImpl } from './repositories/settings.repository';
import { SETTINGS_REPOSITORY_TOKEN } from '../domain/repository-contracts/settings.repository.contract';
import { ScheduleRepositoryImpl } from './repositories/schedule.repository';
import { SCHEDULE_REPOSITORY_TOKEN } from '../domain/repository-contracts/schedule-repository-contract';
import { STUDENT_REPOSITORY_TOKEN } from '../domain/repository-contracts/student-repository.contract';
import { ADMIN_STUDENT_REPOSITORY_TOKEN } from '../domain/repository-contracts/admin-student-repository.contract';
import { StudentRepositoryImpl } from './repositories/student.repository';
import { AdminStudentRepositoryImpl } from './repositories/admin-student.repository';
import { Invitation_REPOSITORY_TOKEN } from '../domain/repository-contracts/invitations-repository.contract';
import { InvitationsRepositoryImpl } from './repositories/invitation.repository';
import { GROUP_REPOSITORY_TOKEN } from '../domain/repository-contracts/group-repository.contract';
import { GroupRepositoryImpl } from './repositories/group.repository';
import { IP_REPOSITORY_TOKEN } from '../domain/repository-contracts/ip-repository.contract';
import { IpRepository } from './repositories/ip.repository';
import { STUDENT_DASHBOARD_REPOSITORY_TOKEN } from '../domain/repository-contracts/student-dashboard.repository.contract';
import { StudentDashboardRepositoryImpl } from './repositories/student-dashboard.repository';
import { STUDENT_ASSESSMENT_REPOSITORY_TOKEN } from '../domain/repository-contracts/student-assessment.repository.contract';
import { StudentAssessmentRepository } from './repositories/student-assessment.repository';
import { STUDENT_EXAM_REPORT_REPOSITORY_TOKEN } from '../domain/repository-contracts/student-exam-report-repository.contract';
import { StudentExamReportRepository } from './repositories/student-exam-report.repository';
import { STUDENT_TRAINING_REPOSITORY_TOKEN } from '../domain/repository-contracts/student-training.repository.contract';
import { StudentTrainingRepository } from './repositories/student-training.repository';

import { ADMIN_DASHBOARD_REPOSITORY_TOKEN } from '../domain/repository-contracts/admin-dashboard.repository.contract';
import { ACTIVITY_FEED_REPOSITORY_TOKEN } from '../domain/repository-contracts/activity-feed.repository.contract';
import { ActivityFeedRepositoryImpl } from './repositories/activity-feed.repository';
import { AdminDashboardRepositoryImpl } from './repositories/admin-dashboard.repository';
import { AuditLogRepositoryImpl } from './repositories/audit-logs.repository';
import { AUDIT_REPOSITORY_TOKEN } from '../domain/repository-contracts/audit-log.repository.contract';

/**
 * Data Module
 * 
 * Provides the concrete implementations of repository interfaces.
 * Also provides HTTP interceptors for API communication.
 */
@NgModule({
  imports: [CommonModule],
  providers: [
    // Bind repository interfaces to their implementations
    // Use fake implementation if fakeapi is enabled in environment
    { 
      provide: AUTH_REPOSITORY_TOKEN, 
      useClass: environment.fakeapi ? AuthRepositoryFake : AuthRepositoryImpl 
    },
    { provide: USER_REPOSITORY_TOKEN, useClass: UserRepositoryImpl },
    { provide:  KnowledgeSource_REPOSITORY_TOKEN, useClass: KnowledgeSourceRepositoryImpl },
    { provide: COURSE_REPOSITORY_TOKEN, useClass: CourseRepositoryImpl },
    { provide: CATEGORY_REPOSITORY_TOKEN, useClass: CategoryRepositoryImpl },
    { provide: SUBCATEGORY_REPOSITORY_TOKEN, useClass: SubCategoryRepositoryImpl },
    { provide: LEARNING_UNIT_REPOSITORY_TOKEN, useClass: LearningUnitRepositoryImpl },
    { provide: OBJECTIVE_REPOSITORY_TOKEN, useClass: ObjectiveRepositoryImpl },
    { provide: EXAM_REPOSITORY_TOKEN, useClass: ExamRepositoryImpl },
    { provide: SETTINGS_REPOSITORY_TOKEN, useClass: SettingsRepositoryImpl },
    { provide: SCHEDULE_REPOSITORY_TOKEN, useClass: ScheduleRepositoryImpl },
    { provide: STUDENT_REPOSITORY_TOKEN, useClass: StudentRepositoryImpl },
    { provide: ADMIN_STUDENT_REPOSITORY_TOKEN, useClass: AdminStudentRepositoryImpl },
    { provide: Invitation_REPOSITORY_TOKEN, useClass: InvitationsRepositoryImpl },
    { provide: GROUP_REPOSITORY_TOKEN, useClass: GroupRepositoryImpl },
    { provide: IP_REPOSITORY_TOKEN, useClass: IpRepository },
    { provide: STUDENT_DASHBOARD_REPOSITORY_TOKEN, useClass: StudentDashboardRepositoryImpl },
    { provide: STUDENT_ASSESSMENT_REPOSITORY_TOKEN, useClass: StudentAssessmentRepository },
    { provide: STUDENT_EXAM_REPORT_REPOSITORY_TOKEN, useClass: StudentExamReportRepository },
    { provide: STUDENT_TRAINING_REPOSITORY_TOKEN, useClass: StudentTrainingRepository },
    { provide: ADMIN_DASHBOARD_REPOSITORY_TOKEN, useClass: AdminDashboardRepositoryImpl },
    { provide: ACTIVITY_FEED_REPOSITORY_TOKEN, useClass: ActivityFeedRepositoryImpl },
    { provide: AUDIT_REPOSITORY_TOKEN, useClass: AuditLogRepositoryImpl },






    
    // HTTP Interceptors
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class DataModule {}
