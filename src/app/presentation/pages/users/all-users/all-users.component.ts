import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, combineLatest, of, catchError, map, shareReplay, startWith, switchMap } from 'rxjs';
import { User } from 'src/app/domain/entities/user.entity';
import { UserListFilter } from 'src/app/domain/entities/user-list-filter.entity';
import { IUserBusiness, USER_BUSINESS_TOKEN } from 'src/app/domain/business-contracts/user-business.contract';
import { CATEGORY_BUSINESS_TOKEN, ICategoryBusiness } from 'src/app/domain/business-contracts/category-business.contract';
import { TableColumn } from 'src/app/presentation/models/table-column-ui-model';
import { DataTableService } from 'src/app/shared/services/data-table.service';

import { UserRole } from 'src/app/domain/enums/user-role.enum';
import { UserStatus } from 'src/app/domain/enums/user-status.enum';
import { PagedResult } from 'src/app/domain/entities/PagedResult.entity';
import { ToastService } from 'src/app/shared/services/toast-service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.scss',
  standalone: false,
})
export class AllUsersComponent implements OnInit {
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [
    { key: 'displayName', label: 'USERS.NAME', sortable: true },
    { key: 'username', label: 'USERS.USERNAME', sortable: true },
    { key: 'email', label: 'USERS.EMAIL', sortable: true },
    { key: 'roleLabel', label: 'USERS.ROLE', sortable: false },
    { key: 'statusLabel', label: 'USERS.STATUS', sortable: true },
    { key: 'joinedDate', label: 'USERS.JOINED_DATE', sortable: true },
    { key: 'actions', label: 'COMMON.ACTIONS', sortable: false }
  ];

  users$!: Observable<any[]>;
  totalUsers = 0;
  isLoading = false;
  tableService = new DataTableService();
  loading: boolean = false;
  roleFilter = new FormControl(null);
  statusFilter = new FormControl<string[]>([]);
  categoryFilter = new FormControl(null);
  dateFromFilter = new FormControl(null);
  dateToFilter = new FormControl(null);

  roleOptions = Object.values(UserRole).map(role => ({
    label: `ENUM.ROLES.${role.toUpperCase()}`,
    value: role
  }));

  statusOptions = Object.values(UserStatus).map(status => ({
    label: `ENUM.USER_STATUS.${status.toUpperCase()}`,
    value: status
  }));

  categoryOptions: { label: string; value: string | number }[] = [];

  constructor(
    @Inject(USER_BUSINESS_TOKEN) private readonly userBusiness: IUserBusiness,
    @Inject(CATEGORY_BUSINESS_TOKEN) private readonly categoryBusiness: ICategoryBusiness,
    private toastservice: ToastService
  ) { }

  ngOnInit(): void {
    this.tableService.pageSize = 10;
    this.tableService.page = 1;
    this.tableService.update();

    this.categoryBusiness.getAllCategories().subscribe(categories => {
      if (categories && Array.isArray(categories)) {
        this.categoryOptions = categories.map(c => ({
          label: c.categoryName,
          value: c.id
        }));
      }
    });

    this.isLoading = true;

    this.users$ = combineLatest([
      this.tableService.query$,
      this.roleFilter.valueChanges.pipe(startWith(this.roleFilter.value)),
      this.statusFilter.valueChanges.pipe(startWith(this.statusFilter.value)),
      this.categoryFilter.valueChanges.pipe(startWith(this.categoryFilter.value)),
      this.dateFromFilter.valueChanges.pipe(startWith(this.dateFromFilter.value)),
      this.dateToFilter.valueChanges.pipe(startWith(this.dateToFilter.value))
    ]).pipe(
      switchMap(([query, role, status, category, dateFrom, dateTo]) => {
        const payload: UserListFilter = {
          pageNo: query.page,
          pageSize: query.pageSize,
          role: role && role !== '' ? role : null,
          status: (status as string[] | null)?.map(status=>status.toLowerCase()) ?? null,
          categoryId: category ? Number(category) : null,
          dateFrom: dateFrom ?? null,
          dateTo: dateTo ?? null,
          name: query.search ?? null,
          username: query.search ?? null,
          email: query.search ?? null
        };

        return this.userBusiness.getUserList(payload).pipe(
          map((result: PagedResult<User>) => {
            const users = result.items;
            const filteredUsers = this.applyFilters(
              users,
              query.search ?? null,
              role && role !== '' ? role : null,
              status || [],
              category ?? undefined,
              dateFrom ?? null,
              dateTo ?? null
            );

            this.totalUsers = result.totalItems;;
            this.isLoading = false;
            return users.map(user => ({
              ...user,
              displayName: user.firstName,
              username: user.username || '—',
              roleLabel: this.getRoleLabel(user),
              joinedDate: this.getJoinedDate(user),
              actions: null,
              status: user.status,
              statusLabel: user.status ? `ENUM.USER_STATUS.${user.status.toUpperCase()}` : '—'
            }));
          }),
          catchError(error => {
            this.isLoading = false;
            this.totalUsers = 0;
            return of([]);
          })
        );
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  resetFilters(): void {
    this.roleFilter.reset(null);
    this.statusFilter.reset([]);
    this.categoryFilter.reset(null);
    this.dateFromFilter.reset(null);
    this.dateToFilter.reset(null);
    this.tableService.page = 1;
    this.tableService.refresh();
  }

  private applyFilters(
    users: User[],
    search?: string | null,
    role?: string | null,
    statuses: string[] = [],
    category?: string,
    dateFrom?: string | null,
    dateTo?: string | null
  ): User[] {
    const normalizedSearch = (search || '').trim().toLowerCase();

    return users.filter(user => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();
      const matchesSearch = !normalizedSearch || [
        fullName,
        user.username,
        user.email,
        user.roles?.join(' ')
      ].some(value => (value || '').toLowerCase().includes(normalizedSearch));

      const roleValue = (this.getRoleLabel(user) || '').toLowerCase();
      const matchesRole = !role || roleValue.includes(role.toLowerCase());

      const normalizedStatus = (user.status || '').toString().toLowerCase();
      const matchesStatus = !statuses.length || statuses.some(status => normalizedStatus === status.toLowerCase());

      const categoryValue = (user as any).categoryId?.toString() || '';
      const matchesCategory = !category || categoryValue === category;

      const joinedAt = this.getJoinedDate(user);
      const matchesDateRange = this.matchesDateRange(joinedAt, dateFrom, dateTo);

      return matchesSearch && matchesRole && matchesStatus && matchesCategory && matchesDateRange;
    });
  }

  private matchesDateRange(joinedAt: string, dateFrom?: string | null, dateTo?: string | null): boolean {
    if (!dateFrom && !dateTo) {
      return true;
    }

    const targetDate = joinedAt === '—' ? null : new Date(joinedAt);
    if (!targetDate || Number.isNaN(targetDate.getTime())) {
      return false;
    }

    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;

    if (from && targetDate < from) {
      return false;
    }

    if (to) {
      const inclusiveEnd = new Date(to);
      inclusiveEnd.setHours(23, 59, 59, 999);
      if (targetDate > inclusiveEnd) {
        return false;
      }
    }

    return true;
  }


  private getRoleLabel(user: User): string {
    const roles = user.roles?.filter(Boolean) ?? [];
    if (!roles.length) {
      return 'ENUM.ROLES.STUDENT';
    }
    return `ENUM.ROLES.${roles[0].toUpperCase()}`
  }

  private getJoinedDate(user: User): string {
    const joinedAt = (user as any).joinedAt;
    if (!joinedAt) {
      return '—';
    }

    const date = new Date(joinedAt);
    return Number.isNaN(date.getTime()) ? '—' : date.toISOString().split('T')[0];
  }

  viewUser(user: User): void {
    console.log('View user', user.id);
  }

  toggleUserStatus(user: User): void {
    this.loading = true
    if (this.isLoading) return;
    this.userBusiness.updateUserStatus(user).subscribe({
      next: (response) => {
        this.loading = false
        this.toastservice.showSuccess(response.message);
        this.tableService.refresh();
      },
      error: (error) => {
        this.loading = false
        this.toastservice.showError(error);
      }
    });
  }
  clearDate(control: FormControl): void {
  control.reset();
}
}
