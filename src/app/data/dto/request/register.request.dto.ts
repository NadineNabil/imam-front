/**
 * Register Request DTO
 * Matches the FastAPI backend expected payload
 */
export interface RegisterRequestDto {
  email: string;
  password: string;
  name: string;

}

