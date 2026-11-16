import { Group } from "src/app/domain/entities/group.entity";
import { GroupResponseDto, GroupsApiResponseDto } from "../dto/response/group.response.dto";
import { CreateGroupRequestDto, UpdateGroupRequestDto } from "../dto/request/group.request.dto";
import { PagedResult } from "src/app/domain/entities/PagedResult.entity";

export class GroupMapper {
  // API → Entity
  static fromResponseDto(dto: GroupResponseDto): Group {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      students: dto.students,
      studentsCount: dto.students_count,
      CreatedDate:dto.created_at,
      createdBy:dto.created_by_user_name,
      pendingStudentsCount:dto.pending_students_count,
      activeStudentsCount:dto.active_students_count
    };
  }

  static fromResponseDtoList(dtos: GroupResponseDto[]): Group[] {
    return dtos.map(dto => this.fromResponseDto(dto));
  }

  static fromApiResponse(response: GroupsApiResponseDto): PagedResult<Group> {
    return {
      items: this.fromResponseDtoList(response.items),
      totalItems: response.total_count,
    };
  }

  // Entity → API (for create/update)
  static toCreateRequestDto(group: Group): CreateGroupRequestDto {
    return {
      name: group.name,
      description: group.description,
    };
  }

  static toUpdateRequestDto(group: Group): UpdateGroupRequestDto {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
    };
  }

/*   static toResponseDto(group: Group): GroupResponseDto {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      students: [],
      studentsCount: group.studentsCount,
    };
  } */
}
