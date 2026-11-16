import { AuditAction,AuditEntity } from "../enums/audit.enums";

export class AuditLog {
  constructor(
    public id: number,
    public userId: number,
    public action: AuditAction,
    public entity: AuditEntity,
    public entityId: string,
    public description: string,
    public ipAddress: string,
    public organizationId: number,
    public createdAt: string,
    public userName: string
  ) {}
}