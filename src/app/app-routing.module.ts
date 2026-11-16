import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import layout from PRESENTATION layer
import { LayoutComponent } from './presentation/layouts/layout.component';

// Import guard from PRESENTATION layer
import { AuthGuard } from './presentation/guards/auth.guard';
import { examStatusGuard } from './presentation/guards/exam-status.guard';
import { InvitationexpireComponent } from './presentation/pages/extrapages/invitationexpire/invitationexpire.component';
import { RoleGuard } from './presentation/guards/role.guard';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./presentation/pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./presentation/pages/extrapages/extrapages.module').then(
            (m) => m.ExtrapagesModule
          ),
      },
        {
        path: 'categories',
                        canActivate: [RoleGuard],
                  data: {
         roles: ['organization_admin']
       },
        loadChildren: () =>
          import('./presentation/pages/categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
      },
        {
          path: 'subcategories',
                          canActivate: [RoleGuard],
                  data: {
         roles: ['organization_admin']
       },
          loadChildren: () =>
            import('./presentation/pages/subcategories/subcategories.module').then(
              (m) => m.SubcategoriesModule
            ),
        },
      {
        path: 'courses',

        loadChildren: () =>
          import('./presentation/pages/courses/courses.module').then(
            (m) => m.CoursesModule
          ),
      },
      {
        path: 'student-assessments',
        canActivate: [RoleGuard],
        data: {
          roles: ['student']
        },
        loadChildren: () =>
          import('./presentation/pages/student-assessments/student-assessments.module').then(
            (m) => m.StudentAssessmentsModule
          ),
      },
      {
        path: 'student-trainings',
        canActivate: [RoleGuard],
        data: {
          roles: ['student']
        },
        loadChildren: () =>
          import('./presentation/pages/student-trainings/student-trainings.module').then(
            (m) => m.StudentTrainingsModule
          ),
      },
      {
        path: 'students',
                        canActivate: [RoleGuard],
                  data: {
         roles: ['organization_admin']
       },
        loadChildren: () =>
          import('./presentation/pages/view-students/view-students.module').then(
            (m) => m.ViewStudentsModule
          ),
      },
      {
        path: 'learningUnits',
                        canActivate: [RoleGuard],
                  data: {
         roles: ['organization_admin']
       },
        loadChildren: () =>
          import('./presentation/pages/learningUnit/learningUnits.module').then(
            (m) => m.LearningUnitsModule
          ),
      },
      {
        path: 'exams',
                        canActivate: [RoleGuard],
                  data: {
         roles: ['organization_admin']
       },
        loadChildren: () =>
          import('./presentation/pages/create-exam/create-exam.module').then(
            (m) => m.CreateExamModule
          ),
      },
      {
        path: 'view-exams',
                        canActivate: [RoleGuard],
                  data: {
         roles: ['organization_admin']
       },
        loadChildren: () =>
          import('./presentation/pages/view-exams/view-exams.module').then(
            (m) => m.ViewExamsModule
          ),
      },
       {
        path: 'exam-details/:id',
                  data: {
         roles: ['organization_admin']
       },
        loadChildren: () =>
          import('./presentation/pages/exam-details/exam-details.module').then(
            (m) => m.ExamDetailsModule
          ),
           canActivate: [examStatusGuard,RoleGuard]
          },
      {
        path: 'exam-report/:id',
        canActivate: [RoleGuard],
        data: {
          roles: ['student', 'organization_admin'],
          reportType: 'exam'
        },
        loadChildren: () =>
          import('./presentation/pages/student-exam-report/student-exam-report.module').then(
            (m) => m.StudentExamReportModule
          )
      },
      {
        path: 'training-report/:id',
        canActivate: [RoleGuard],
        data: {
          roles: ['student', 'organization_admin'],
          reportType: 'training'
        },
        loadChildren: () =>
          import('./presentation/pages/student-exam-report/student-exam-report.module').then(
            (m) => m.StudentExamReportModule
          )
      },
      {
        path: 'profile-student',
        canActivate: [RoleGuard],
        data: {
        roles: ['student']
       },
        loadChildren: () =>
          import('./presentation/pages/profile-student/profile-student.module').then(
            (m) => m.ProfileStudentModule
          ),
      },
            {
        path: 'student-management',
                        canActivate: [RoleGuard],
                  data: {
         roles: ['organization_admin']
       },
        loadChildren: () =>
          import('./presentation/pages/student-directory-management/student-directory-management.module').then(
            (m) => m.StudentDirectoryManagementModule
          ),
      },
                  {
        path: 'group-management',
                        canActivate: [RoleGuard],
                  data: {
         roles: ['organization_admin']
       },
        loadChildren: () =>
          import('./presentation/pages/group-management/group-management.module').then(
            (m) => m.GroupManagementModule
          ),
      },
                        {
        path: 'chat',
        canActivate: [RoleGuard],
                  data: {
         roles: ['student']
       },
        loadChildren: () =>
          import('./presentation/pages/chatbot/chatbot.module').then(
            (m) => m.ChatbotModule
          ),
      },

      {
        path:'view-invitations',
                canActivate: [RoleGuard],
                  data: {
         roles: ['organization_admin']
       },
        loadChildren: () =>
          import('./presentation/pages/view-invitations/view-invitations.module').then(
            (m) => m.ViewInvitationsModule
          ),
      },
      {
        path:'users',
                canActivate: [RoleGuard],
                  data: {
         roles: ['organization_admin']
       },
        loadChildren: () =>
          import('./presentation/pages/users/users.module').then(
            (m) => m.UsersModule
          ),
      },


      // ── DEV / TEST ONLY ──────────────────────────────────────────────────
      {
        path: 'ws-test',
        loadChildren: () =>
          import('./presentation/pages/ws-test/ws-test.module').then(
            (m) => m.WsTestModule
          ),
      }
    ],
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./presentation/pages/account/account.module').then(
        (m) => m.AccountModule
      ),
  },
     {
        path: 'exam',
          canActivate: [RoleGuard],
          data: {
       roles: ['student']
     },
        loadChildren: () =>
          import('./presentation/pages/exam/exam.module').then(
            (m) => m.ExamModule
          ),
      },
           {
        path: 'training',
          canActivate: [RoleGuard],
          data: {
         roles: ['student']
       },
        loadChildren: () =>
          import('./presentation/pages/training/training.module').then(
            (m) => m.TrainingModule
          ),
      },
      {
        path: 'exam-journey',
          canActivate: [RoleGuard],
          data: {
            roles: ['student']
          },
        loadChildren: () =>
          import('./presentation/pages/exam-journey/exam-journey.module').then(
            (m) => m.ExamJourneyModule
          ),
      },
  {
    path: 'invitation-expire',
                    canActivate: [RoleGuard],
                  data: {
         roles: ['organization_admin']
       },
    component: InvitationexpireComponent
  },
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
