import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SharedPagination } from "src/app/domain/entities/shared-pagination.entity";

@Injectable()
export class DataTableService {

  private _query$ = new BehaviorSubject<SharedPagination>({
    page: 1,
    pageSize: 10
  });

  private _search$ = new Subject<string>();

  query$ = this._query$.asObservable();

  // UI state
  page = 1;
  pageSize = 10;
  searchTerm = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' | '' = '';
  status = '';

  update() {
    this._query$.next({
      page: this.page,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      sortColumn: this.sortColumn || undefined,
      sortDirection: this.sortDirection || undefined,
      status: this.status || undefined
    });
  }

  constructor() {
    this._search$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.page = 1;
      this.searchTerm = term;
      this.update();
    });
  }

  onSearch(term: string) {
    // push into debounced search stream
    this._search$.next((term || '').trim());
  }

  onSort(column: string, direction :'asc' | 'desc' | '') {
    this.sortColumn = column;
    this.sortDirection = direction;
    this.update();
  }

  onPageChange(page: number) {
    this.page = page;
    this.update();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.page = 1;
    this.update();
  }

  onStatusChange(status: string) {
    this.status = status;
    this.page = 1;
    this.update();
  }

  refresh() {
    this.update();
  }
}
