import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Business contracts (interfaces)
import { AUTH_BUSINESS_TOKEN } from './business-contracts/auth-business.contract';
import { USER_BUSINESS_TOKEN } from './business-contracts/user-business.contract';

// Business implementations
import { AuthBusiness } from './business/auth.business';
import { UserBusiness } from './business/user.business';
import { KnowledgeSourceBusiness } from './business/KnowledgeSource.business';
import { KnowledgeSource_business_TOKEN } from './business-contracts/KnowledgeSource.business.contract';
import { CourseBusiness } from './business/course.business';
import { COURSE_BUSINESS_TOKEN } from './business-contracts/course-business.contract';
import { CategoryBusiness } from './business/category.business';
import { CATEGORY_BUSINESS_TOKEN } from './business-contracts/category-business.contract';
import { SubCategoryBusiness } from './business/subCategory.business';
import { SUBCATEGORY_BUSINESS_TOKEN } from './business-contracts/subCategory-business.contract';
import { LearningUnitBusiness } from './business/learning-unit.business';
import { LEARNING_UNIT_BUSINESS_TOKEN } from './business-contracts/learning-unit-business.contract';
import { ObjectiveBusiness } from './business/objective.business';
import { OBJECTIVE_BUSINESS_TOKEN } from './business-contracts/objective-business.contract';
import { ExamBusiness } from './business/exam.business';
import { EXAM_BUSINESS_TOKEN } from './business-contracts/exam-business.contract';
import { SETTINGS_BUSINESS_TOKEN } from './business-contracts/settings-business.contract';
import { SettingsBusiness } from './business/settings.business';
import { ScheduleBusiness } from './business/schedule-business';
import { SCHEDULE_BUSINESS_TOKEN } from './business-contracts/schedule.business.contract';
import { StudentBusiness } from './business/student.business';
import { STUDENT_BUSINESS_TOKEN } from './business-contracts/student-business.contract';
import { AdminStudentBusiness } from './business/admin-student.business';
import { ADMIN_STUDENT_BUSINESS_TOKEN } from './business-contracts/admin-student-business.contract';
import { INVITATION_BUSINESS_TOKEN } from './business-contracts/invitations-business.contract';
import { InvitationBusiness } from './business/invitations.business';
import { GROUP_BUSINESS_TOKEN } from './business-contracts/group-business.contract';
import { GroupBusiness } from './business/group.business';
import { IP_BUSINESS_TOKEN } from './business-contracts/ip-business.contract';
import { ipBusiness } from './business/ip.business';
import { STUDENT_DASHBOARD_BUSINESS_TOKEN } from './business-contracts/student-dashboard.business.contract';
import { StudentDashboardBusiness } from './business/student-dashboard.business';
import { STUDENT_ASSESSMENT_BUSINESS_TOKEN } from './business-contracts/student-assessment.business.contract';
import { StudentAssessmentBusiness } from './business/student-assessment.business';
import { STUDENT_EXAM_REPORT_BUSINESS_TOKEN } from './business-contracts/student-exam-report-business.contract';
import { StudentExamReportBusiness } from './business/student-exam-report.business';
import { STUDENT_TRAINING_BUSINESS_TOKEN } from './business-contracts/student-training.business.contract';
import { ADMIN_DASHBOARD_BUSINESS_TOKEN } from './business-contracts/admin-dashboard.business.contract';
import { AdminDashboardBusiness } from './business/admin-dashboard.business';
import { ACTIVITY_FEED_BUSINESS_TOKEN } from './business-contracts/activity-feed.business.contract';
import { ActivityFeedBusiness } from './business/activity-feed.business';
import { StudentTrainingBusiness } from './business/student-training.business';
import { AuditLogBusiness } from './business/audit-logs.business';
import { AUDIT_BUSINESS_TOKEN } from './business-contracts/audit-log.business.contract';

/**
 * Domain Module
 * 
 * Contains domain entities, repository contracts, and business logic.
 * This module has NO dependencies on Angular HTTP or external libraries.
 * 
 * STRUCTURE:
 * - entities/            → Domain models (pure TypeScript classes)
 * - repository-contracts/ → Repository interfaces (abstractions)
 * - business-contracts/  → Business interfaces (used by presentation layer)
 * - business/            → Business logic implementations
 */
@NgModule({
  imports: [CommonModule],
  providers: [
    // Provide business implementations for contracts
    { provide: AUTH_BUSINESS_TOKEN, useClass: AuthBusiness },
    { provide: USER_BUSINESS_TOKEN, useClass: UserBusiness },
    { provide: KnowledgeSource_business_TOKEN, useClass: KnowledgeSourceBusiness },
    { provide: COURSE_BUSINESS_TOKEN, useClass: CourseBusiness },
    { provide: CATEGORY_BUSINESS_TOKEN, useClass: CategoryBusiness },
    { provide: SUBCATEGORY_BUSINESS_TOKEN, useClass: SubCategoryBusiness },
    { provide: LEARNING_UNIT_BUSINESS_TOKEN, useClass: LearningUnitBusiness },
    { provide: OBJECTIVE_BUSINESS_TOKEN, useClass: ObjectiveBusiness },
    { provide: EXAM_BUSINESS_TOKEN, useClass: ExamBusiness },
    { provide: SETTINGS_BUSINESS_TOKEN, useClass: SettingsBusiness },
    { provide: SCHEDULE_BUSINESS_TOKEN, useClass: ScheduleBusiness },
    { provide: STUDENT_BUSINESS_TOKEN, useClass: StudentBusiness },
    { provide: ADMIN_STUDENT_BUSINESS_TOKEN, useClass: AdminStudentBusiness },
    { provide: IP_BUSINESS_TOKEN, useClass: ipBusiness },

    { provide: INVITATION_BUSINESS_TOKEN, useClass: InvitationBusiness },
    { provide: GROUP_BUSINESS_TOKEN, useClass: GroupBusiness },
    { provide: STUDENT_DASHBOARD_BUSINESS_TOKEN, useClass: StudentDashboardBusiness },
    { provide: STUDENT_ASSESSMENT_BUSINESS_TOKEN, useClass: StudentAssessmentBusiness },
    { provide: STUDENT_EXAM_REPORT_BUSINESS_TOKEN, useClass: StudentExamReportBusiness },
    { provide: STUDENT_TRAINING_BUSINESS_TOKEN, useClass: StudentTrainingBusiness },
    { provide: ADMIN_DASHBOARD_BUSINESS_TOKEN, useClass: AdminDashboardBusiness },
    { provide: ACTIVITY_FEED_BUSINESS_TOKEN, useClass: ActivityFeedBusiness },
    { provide: AUDIT_BUSINESS_TOKEN, useClass: AuditLogBusiness },

  ]
})
export class DomainModule { }

