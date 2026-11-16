export interface UserListRequestDto {
  page_no?: number|null;
  page_size?: number|null;
  role?: string|null;
  status?: string[]|null;
  category_id?: number|null;
  date_from?: string|null;
  date_to?: string|null;
  name?: string|null;
  username?: string|null;
  email?: string|null;
}
