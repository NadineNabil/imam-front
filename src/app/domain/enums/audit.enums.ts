export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  ASSIGN_ROLE = 'assign_role',
  INVITE_STUDENT = 'invite_student',
  INVITE_GROUP = 'invite_group',
  INVITE_CANCLED = 'invite_cancled'
}

export enum AuditEntity {
  CATEGORY = 'Category',
  COURSE = 'Course',
  EXAM = 'Exam',
  QUESTION = 'Question',
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  ORGANIZATION = 'Organization',
  USER = 'User',
  INVITATION = 'Invitation'
}