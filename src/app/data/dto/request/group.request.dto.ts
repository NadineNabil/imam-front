export interface CreateGroupRequestDto {
  name: string;
  description?: string;
}

export interface UpdateGroupRequestDto {
  id: number;
  name: string;
  description?: string;
}
