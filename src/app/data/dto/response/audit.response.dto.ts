export interface AuditLogDto {
  id: number;
  user_id: number;
  action: string;
  entity: string;
  entity_id: string;
  description: string;
  ip_address: string;
  organization_id: number;
  created_at: string;
  user_name: string;
}

export interface AuditLogResponseDto {
  items: AuditLogDto[];
  total_count: number;
}