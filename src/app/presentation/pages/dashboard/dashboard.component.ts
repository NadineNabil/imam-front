import { Component, OnInit, Inject } from '@angular/core';
import { IAuthBusiness, AUTH_BUSINESS_TOKEN } from '../../../domain/business-contracts/auth-business.contract';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  breadCrumbItems!: Array<{ label: string; active?: boolean }>;
  isStudent = false;

  constructor(
    @Inject(AUTH_BUSINESS_TOKEN) private readonly authBusiness: IAuthBusiness
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Admin Overview', active: true }
    ];

    const roles = this.authBusiness.getCurrentUser()?.roles || [];
    this.isStudent = roles.includes('student');
  }
}
