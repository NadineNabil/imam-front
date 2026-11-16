import { LearningUnitResponseDto,LearningUnitListResponseDto } from "../dto/response/learning-unit.response.dto";
import { LearningUnits } from "src/app/domain/entities/learningUnits.entity";

export class LearningUnitMapper {
 static fromCreateLearningUnitResponse(dto: LearningUnitResponseDto): LearningUnits {
     return new LearningUnits(
       dto.id,
       dto.name ,
       dto.course_Id,
     );
   }
 
   static fromLearningUnitResponse(dto: LearningUnitResponseDto): LearningUnits {
     return new LearningUnits(
       dto.id,
       dto.name ,
       dto.course_Id// name maps to title
     );
   }
 
   /**
    * Map learning unit list response DTO to array of learningUnits entities
    */
    static fromLearningUnitListResponse(dto: LearningUnitListResponseDto): LearningUnits[] {
      if (!dto || dto.learning_units?.length === 0) {
        return [];
      }
      return dto.learning_units.map(learningUnitDto => this.fromLearningUnitResponse(learningUnitDto));
   
     } 
     
      static fromResponseDto(dto: LearningUnitResponseDto): LearningUnits {
    return new LearningUnits(
      dto.id,
       dto.name,
       dto.course_Id, 
      dto.learningUnitDescription,
      dto.learningUnitImage,
      
    );
  }
  static fromResponseDtoList(dtos: LearningUnitResponseDto[]): LearningUnits[] {
    return dtos.map(dto => this.fromResponseDto(dto));

    
    }
    // Entity → API (for create/update)
  static toRequestDto(learningUnit: LearningUnits) : LearningUnitResponseDto{
    return {
      id: learningUnit.id,
      course_Id: learningUnit.courseId,
      name: learningUnit.learningUnitName,
      learningUnitDescription: learningUnit.learningUnitDescription,
      learningUnitImage: learningUnit.learningUnitImage,
    };
  }
}
