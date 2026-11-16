export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  comfirm_password: string;
}