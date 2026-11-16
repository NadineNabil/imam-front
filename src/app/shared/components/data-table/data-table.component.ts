import { Component, Input, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataTableService } from '../../services/data-table.service';
import { TableColumn } from 'src/app/presentation/models/table-column-ui-model';
import { SortEvent } from '../../directives/datatable-sortable.directive';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  standalone:false
})
export class DataTableComponent<T> {
  @Input() actionsTemplate?: TemplateRef<any>;
  @Input() columns: TableColumn[] = [];
  @Input() data$!: Observable<T[]>;
  @Input() totalRecords = 0;
  @Input() tableService!: DataTableService;
  @Input() isLoading = false;
  @Input() showSearch = true;
  @Input() showPagination = true;
  @Input() statusOptions?: { value: string; label: string }[] = [];
  @Input() rowClass?: (row: T) => string | string[] | Set<string> | { [klass: string]: any };
  statusControl = new FormControl<string | null>(null);
  pageSizes = [10, 25, 50, 100];
selectedPageSize=10
  onSearch(term: string) {
    this.tableService.onSearch(term);
  }

onSort(event: SortEvent) {
  this.tableService.onSort(event.column, event.direction);
}
  onPageChange(page: number) {
    this.tableService.onPageChange(page);
  }

  onPageSizeChange(size: number) {
    this.tableService.onPageSizeChange(size);
  }

  onStatusChange(status:any) {
    
    this.tableService.onStatusChange(status.value ?? '');
  }

  getCellValue(row: T, key: string): any {
    return (row as any)?.[key];
  }


}
