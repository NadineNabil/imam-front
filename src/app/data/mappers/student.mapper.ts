import { from } from "rxjs";
import { Student } from "src/app/domain/entities/student.entity";
import { CurrentStudentDto, StudentResponseDto } from "../dto/response/student.response.dto";
import { StudentRequestDto, UpdateStudentImageDto, UpdateStudentRequestDto } from "../dto/request/student.request.dto";
import { EnrollmentMapper } from "./EnrollmentMapper";
import { environment } from "src/environments/environment.prod";

export class StudentMapper {
  static fromResponseDto(dto: StudentResponseDto): Student {
    return new Student(
      dto.id,
      dto.firstName,
        dto.lastName,
        dto.email,
        dto.countryCode,
        dto.phoneNumber,
        dto.profilePictureUrl,
        dto.registrationDate,
        dto.lastLogin,
        dto.preferredLanguage,
        dto.enrollments?.map(e =>
        EnrollmentMapper.fromResponseDto(e)
      ) ?? [],
        dto.averageScore,
        dto.totalExams,
        dto.totalCertificates,
        []
    );
  }
  static toRequestDto(student: Student): StudentRequestDto {
    return {
      imageUrl: student.profilePictureUrl,
      phoneNumber: student.phoneNumber,
      countryCode: student.countryCode
    };
  }
    static toUpdateRequestDto(student: Student): UpdateStudentRequestDto {
      console.log(student,'student')
    return {
      country_code: student.countryCode||'',
      phone_number: student.phoneNumber||'',
      preferred_language: student.preferredLanguage||''
    };
  }
      static toUpdateImageDto(student: Student): UpdateStudentImageDto {
      console.log(student,'student')
    return {
      image: student.profilePictureUrl||'',
    };
  }
  static fromStudentProfileDto(dto: CurrentStudentDto): Student {
    const nameParts = dto.user.name.trim().split(/\s+/);
    return new Student(
      dto.id,
      nameParts[0],
      nameParts.slice(1).join(' ') || '',
      dto.user.email,
      dto.user.phone_country_code,
      dto.user.phone_number,
      dto.image,
      dto.registration_date,
      dto.last_login_date,
      dto.user.preferred_language,
      [],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      dto.course_count
    );
  }

  private static mapImageUrl(path?: string | null): string {

    return `${environment.apiUrl}/${path}`;
  }
}
