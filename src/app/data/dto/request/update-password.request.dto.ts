/**
 * Update Password Request DTO
 */
export interface UpdatePasswordRequestDto {
  email?: string;
  new_password?: string;
  comfirm_password: string;
  reset_token: string;
}

