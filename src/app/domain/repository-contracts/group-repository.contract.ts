import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { Group } from "../entities/group.entity";
import { PagedResult } from "../entities/PagedResult.entity";
import { SharedPagination } from "../entities/shared-pagination.entity";
import { ApiResponse } from "../entities/api-response.entity";

export interface IGroupRepository {
  getAllGroups(pagination: SharedPagination): Observable<PagedResult<Group>>;
  getGroupById(id: number): Observable<Group>;
  createGroup(group: Group): Observable<ApiResponse>;
  updateGroup(group: Group): Observable<ApiResponse>;
  deleteGroup(id: number): Observable<ApiResponse>;
  Add_Students_To_Group(group_id: number, studentIds: number[]): Observable<ApiResponse>;
  Remove_Student_From_Group(group_id: number, student_id: number): Observable<ApiResponse>;
}

export const GROUP_REPOSITORY_TOKEN = new InjectionToken<IGroupRepository>('IGroupRepository');
