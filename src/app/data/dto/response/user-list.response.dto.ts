export interface UserListResponseDto {
  items?: UserListItemResponseDto[];
  total_count?: number;
}

export interface UserListItemResponseDto {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  status?: string;
  category_ids?: number[];
  joined_date?: string;
}
