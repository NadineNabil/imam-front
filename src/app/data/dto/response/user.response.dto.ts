/**
 * User Response DTO
 * Matches the FastAPI backend user response
 */
export interface UserResponseDto {
  id: number;
  email: string;
  username?: string;
  first_name?: string;  // snake_case from FastAPI
  last_name?: string;   // snake_case from FastAPI
}

/**
 * User List Response DTO (if paginated)
 */
export interface UserListResponseDto {
  items: UserResponseDto[];
  total: number;
  page: number;
  size: number;
}

