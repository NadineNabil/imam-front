import { Student } from "src/app/domain/entities/student.entity";
import { AdminStudentListResponseDto, AdminStudentListUserResponseDto, AdminStudentProfileResponseDto, StudentResponseDto } from "../dto/response/student.response.dto";

export class AdminStudentMapper {
    static fromAdminStudentProfileResponseDto(dto: AdminStudentProfileResponseDto): Student {
        const nameParts = dto.full_name.trim().split(/\s+/);
    return new Student(
        dto.student_id,
        nameParts[0],
        nameParts.slice(1).join(' ') || '',
        dto.email,
        '',
        '',
        '',
        new Date(dto.activated_date),
        new Date(dto.activated_date),
        '',
        dto.enrolled_courses?.map(c => ({
            course: {
                id: c.course_id,
                name: c.course_name,
            },
            enrolledAt: new Date(c.enrolled_date),
            studentCourseStatus:c.status as string
        })) || [],
        0,
        0,
        0,
        [],
        dto.status as string,
        dto.total_courses,
        new Date(dto.activated_date)
    );
    }
    
   static fromAdminStudentListResponseDto(
  dtos: AdminStudentListResponseDto[]
): Student[] {
  return dtos.map(dto => this.fromAdminStudentListItemResponseDto(dto));
}

static fromAdminStudentListItemResponseDto(
  dto: AdminStudentListResponseDto
): Student {
  const nameParts = dto.user.name.trim().split(/\s+/);

  return new Student(
    dto.id,
    nameParts[0],
    nameParts.slice(1).join(' ') || '',
    dto.user.email,
    dto.user.phone_country_code ?? '',
    dto.user.phone_number ?? '',
    dto.image ?? '',
    new Date(dto.registration_date),
    dto.last_login_date ? new Date(dto.last_login_date) : new Date(),
    dto.user.preferred_language ?? '',
    [],
    0,
    0,
    0,
    [],
    dto.status,
    dto.course_count,
    new Date(dto.created_at)
  );
}

}