import { AuditLog } from "src/app/domain/entities/AuditLog.entity";
import { AuditLogDto, AuditLogResponseDto } from "../dto/response/audit.response.dto";
import { AuditAction, AuditEntity } from "src/app/domain/enums/audit.enums";
import { PagedResult } from "src/app/domain/entities/PagedResult.entity";

export class AuditLogMapper {
  static toDomain(dto: AuditLogDto): AuditLog {
    return new AuditLog(
      dto.id,
      dto.user_id,
      dto.action as AuditAction,
      dto.entity as AuditEntity,
      dto.entity_id,
      dto.description,
      dto.ip_address,
      dto.organization_id,
      dto.created_at,
      dto.user_name
    );
  }

  static toPagedDomain(
    response: AuditLogResponseDto
  ): PagedResult<AuditLog> {
    return {
      items: response.items.map(item => this.toDomain(item)),
      totalItems: response.total_count
    };
  }
}