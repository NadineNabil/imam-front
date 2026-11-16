export interface CreateUserPayload {
  fullName: string;
  email: string;
  role: string;
  password?: string;
  assignedCategories?: number[];
  canCreateExams?: boolean;
}
