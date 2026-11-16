export interface CreateUserPayloadRequest {
  name: string;
  email: string;
  categories: number[];
  role?: string;
  password?: string;
  can_create_exams?: boolean;
}
export interface updateUserStatusRequest{
  user_id:number;
  role:string;
}