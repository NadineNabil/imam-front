import { Component, OnInit } from '@angular/core';
import { IUserBusiness, USER_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/user-business.contract';
import { Inject } from '@angular/core';
import { User } from 'src/app/domain/entities/user.entity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type StudentView = {
  id: number;
  email: string;
  fullName: string;
  status: 'Active' | 'Pending' | 'Revoked';
  enrollmentCount: number;
};

@Component({
  selector: 'app-view-students',
  templateUrl: './view-students.component.html',
  styleUrls: ['./view-students.component.scss'],
  standalone:false
})
export class ViewStudentsComponent implements OnInit {
  users: StudentView[] = [];
  filtered: StudentView[] = [];
  query = '';
  statusFilter: 'All' | 'Active' | 'Pending' | 'Revoked' = 'All';

  constructor(@Inject(USER_BUSINESS_TOKEN) private userBusiness: IUserBusiness) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers() {
    this.userBusiness.getAll().subscribe(users => {
      this.users = users.map(u => this.toStudentView(u));
      this.applyFilters();
    });
  }

  private toStudentView(u: User): StudentView {
    const id = typeof u.id === 'number' ? u.id : -1;
    const isActive = !!(u.token);
    return {
      id,
      email: u.email,
      fullName: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
      status: (isActive ? 'Active' : 'Pending') as StudentView['status'],
      enrollmentCount: 0 // TODO: backend not exposing enrollment count yet
    };
  }

  applyFilters() {
    const q = this.query.trim().toLowerCase();
    this.filtered = this.users.filter(u => {
      if (this.statusFilter !== 'All' && u.status !== this.statusFilter) return false;
      if (!q) return true;
      return u.email.toLowerCase().includes(q) || u.fullName.toLowerCase().includes(q);
    });
  }

  onSearchChange() { this.applyFilters(); }

  clearSearch() {
    this.query = '';
    this.applyFilters();
  }

  goToProfile(u: StudentView) {
    // navigate to user profile - route may not exist yet; using /users/:id as convention
    window.location.href = `/users/${u.id}`;
  }
}
