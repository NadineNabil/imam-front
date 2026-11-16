import { Observable, throwError } from "rxjs";
import { Inject, Injectable } from "@angular/core";
import { GROUP_REPOSITORY_TOKEN, IGroupRepository } from "../repository-contracts/group-repository.contract";
import { Group } from "../entities/group.entity";
import { IGroupBusiness } from "../business-contracts/group-business.contract";
import { PagedResult } from "../entities/PagedResult.entity";
import { SharedPagination } from "../entities/shared-pagination.entity";
import { ApiResponse } from "../entities/api-response.entity";

@Injectable({ providedIn: 'root' })
export class GroupBusiness implements IGroupBusiness {
  constructor(@Inject(GROUP_REPOSITORY_TOKEN) private readonly groupRepository: IGroupRepository) {}

  getAllGroups(pagination: SharedPagination): Observable<PagedResult<Group>> {
    return this.groupRepository.getAllGroups(pagination);
  }

  getGroupById(id: number): Observable<Group> {
    return this.groupRepository.getGroupById(id);
  }

  createGroup(group: Group): Observable<ApiResponse> {
    // Example business validation
    if (!group.name || group.name.trim() === '') {
      throw new Error('Group name is required');
    }

    return this.groupRepository.createGroup(group)
  }

  updateGroup(group: Group): Observable<ApiResponse> {
    if (!group.id) {
      throw new Error('Group id is required');
    }
    if (!group.name || group.name.trim() === '') {
      throw new Error('Group name is required');
    }

    return this.groupRepository.updateGroup(group);
  }

  deleteGroup(id: number): Observable<ApiResponse> {
    if (!id) {
      throw new Error('Group id is required');
    }

    return this.groupRepository.deleteGroup(id);
  }

  Add_Students_To_Group(group_id: number, studentIds: number[]): Observable<ApiResponse> {
    return this.groupRepository.Add_Students_To_Group(group_id, studentIds);
  }

  Remove_Student_From_Group(group_id: number, student_id: number): Observable<ApiResponse> {  
  return this.groupRepository.Remove_Student_From_Group(group_id, student_id);
  }
}
