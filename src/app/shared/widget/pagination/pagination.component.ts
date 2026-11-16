import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  standalone: false,
})
export class PaginationComponent {
  @Input() collectionSize!: number;
  @Input() page!: number;

  @Input() pageSize: number = 10;
  @Input() maxSize: number = 5;
  @Input() rotate: boolean = true;
  @Input() ellipses: boolean = true;
  @Input() boundaryLinks: boolean = true;

  @Output() pageChange = new EventEmitter<number>();
}
