/**
 * Login Response DTO
 * Matches the FastAPI backend response shape
 */
export interface LoginResponseDto {
  user_id: number;
  organization_id: number;
  username: string;
  name:string;
  access_token: string;
  token_type: string;
  refresh_token: string;
  access_token_expires_at: string;
  refresh_token_expires_at: string;
  roles: string[];
}

