import { Enrollment } from "src/app/domain/entities/Enrollment.entity";
import { CourseMapper } from "./course.mapper";

export class EnrollmentMapper {
  static fromResponseDto(dto: any): Enrollment {
    return new Enrollment(
      CourseMapper.fromCourseDto(dto.course),
      dto.enrolledAt
    );
  }
}