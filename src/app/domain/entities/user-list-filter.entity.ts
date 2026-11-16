export interface UserListFilter {
  pageNo?: number|null;
  pageSize?: number|null;
  role?: string|null;
  status?: string[]|null;
  categoryId?: number|null;
  dateFrom?: string|null;
  dateTo?: string|null;
  name?: string|null;
  username?: string|null;
  email?: string|null;
}
