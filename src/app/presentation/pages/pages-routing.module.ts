import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { FoldersTreeComponent } from './folders-tree/folders-tree.component';
import { StudentDashboardComponent } from './dashboard/student-dashboard/student-dashboard.component';
import { roleRedirectGuard } from '../guards/role-redirect.guard';
import { RoleGuard } from '../guards/role.guard';
import { WsTestComponent } from './ws-test/ws-test.component';
import { ReportComponent } from './report/report.component';
import { LogsComponent } from './logs/logs.component';

const routes: Routes = [
  {
    // Empty path — redirect based on role
    path: '',
    canActivate: [roleRedirectGuard],
    // This component will never render; the guard always redirects
    component: DashboardComponent
  },
  {
    // Admin dashboard landing page
    path: 'dashboard',
    canActivate: [RoleGuard],
    data: {
      roles: ['organization_admin', 'teacher']
    },
    component: DashboardComponent
  },
  {
    // System structure tree
    path: 'tree',
    component: FoldersTreeComponent
  },
    {
    // Admin / teacher default landing — folders tree
    path: 'logs',
    component: LogsComponent,
         canActivate: [RoleGuard],
         data: {
         roles: ['organization_admin']
       },
  },
    {
    // Admin / teacher default landing — folders tree
    path: 'report',
    component: ReportComponent,
          canActivate: [RoleGuard],
           data: {
         roles: ['organization_admin']
       },
  },
/*    {
    // Student landing page
    path: 'examJourney',
         canActivate: [RoleGuard],
           data: {
         roles: ['student']
       },
    component: ExamJourneyComponent
  }, */
  {
    // WS test page
    path: 'ws',
    component: WsTestComponent
  },
  {
    // Student landing page
    path: 'student-dashboard',
    canActivate: [RoleGuard],
    data: {
      roles: ['student']
    },
    component: StudentDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
