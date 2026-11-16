import { Course } from "src/app/domain/entities/course.entity";
import { AllCoursesResponseDto, CourseDto, CourseResponseDto } from "../dto/response/course.response.dto";
import { CourseRequestDto } from "../dto/request/course.request.dto";

export class CourseMapper {

  
  // API → Entity
  static fromResponseDto(dto: CourseResponseDto,baseUrl:string): Course {
    return new Course(
      dto.id,
      dto.name,
      dto.collection_id,
      dto.description??'',
      dto.image ? `${baseUrl}/${dto.image}`:dto.image||'',
      dto.category_id,
      dto.parent_category_id,
      dto.learning_units??[]
    );
  }
    // Entity → API (for create/update)
  static toRequestDto(course: Course) : CourseRequestDto{
    return {
      id: course.id,
      name: course.name,
      description: course.description??'',
      image: course.image??'',
      category_id: course.category_id,
    };
  }

 static fromResponseDtoList(dtos: CourseResponseDto[], baseUrl: string): Course[] {
    return dtos.map(dto => this.fromResponseDto(dto, baseUrl));
  }
   static fromAllCoursesResponseDtoList(dtos: AllCoursesResponseDto[], baseUrl: string): Course[] {
    return dtos.map(dto => this.fromResponseDto(dto, baseUrl));
  }

   static fromResponseList(dtos: CourseResponseDto[],baseUrl: string): Course[] {
      return dtos.map(dto=>this.fromResponseDto(dto,baseUrl));
    }
  
  static fromCourseDto(dto: CourseDto): Course {
    return new Course(dto.id, dto.name, dto.description ?? "", dto.image ?? "");
  }
  
  static mapCourses(
      courses: Array<CourseDto | null> | undefined
    ): Course[] {
      if (!courses) {
        return [];
      }
      return courses
        .filter((course): course is CourseDto => !!course)
        .map((course) => this.fromCourseDto(course));
    }
}