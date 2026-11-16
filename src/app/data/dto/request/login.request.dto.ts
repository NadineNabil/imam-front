/**
 * Login Request DTO
 * Matches the FastAPI backend expected payload
 */
export interface LoginRequestDto {
  email: string;
  password: string;
}

