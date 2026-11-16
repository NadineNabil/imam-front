import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Group } from "src/app/domain/entities/group.entity";
import { GroupApiService } from "../api/group-api.service";
import { IGroupRepository } from "src/app/domain/repository-contracts/group-repository.contract";
import { GroupMapper } from "../mappers/group.mapper";
import { PagedResult } from "src/app/domain/entities/PagedResult.entity";
import { SharedPagination } from "src/app/domain/entities/shared-pagination.entity";
import { PaginationRequestDto } from "../dto/request/pagination.request.dto";
import { ApiResponse } from "src/app/domain/entities/api-response.entity";

@Injectable({ providedIn: 'root' })
export class GroupRepositoryImpl implements IGroupRepository {
  constructor(private groupApiService: GroupApiService) {}

  getAllGroups(pagination: SharedPagination): Observable<PagedResult<Group>> {
    const paginationDto: PaginationRequestDto = {
      page_no: pagination.page,
      page_size: pagination.pageSize,
      search_term:pagination.search||''
    };

    return this.groupApiService.getAllGroups(paginationDto).pipe(
      map(response => GroupMapper.fromApiResponse(response))
    );
  }

  getGroupById(id: number): Observable<Group> {
    return this.groupApiService.getGroupById(id).pipe(
      map(dto => GroupMapper.fromResponseDto(dto))
    );
  }

  createGroup(group: Group): Observable<ApiResponse> {
    const groupDto = GroupMapper.toCreateRequestDto(group);
    return this.groupApiService.createGroup(groupDto);
  }
//should return api response after update to check status success or failed.
  updateGroup(group: Group): Observable<ApiResponse> {
    const groupDto = GroupMapper.toUpdateRequestDto(group);
    return this.groupApiService.updateGroup(groupDto);
  }

  deleteGroup(id: number): Observable<ApiResponse> {
    return this.groupApiService.deleteGroup(id);
  }


  Add_Students_To_Group(group_id: number, studentIds: number[]): Observable<ApiResponse> {        
    return this.groupApiService.Add_Students_To_Group(group_id, studentIds);
  }

  Remove_Student_From_Group(group_id: number, student_id: number): Observable<ApiResponse> {
    return this.groupApiService.Remove_Student_From_Group(group_id, student_id);
  }
}
