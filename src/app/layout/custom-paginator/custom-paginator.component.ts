import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.css']
})
export class CustomPaginatorComponent implements OnInit {
  @Input() length!: number;
  @Input() pageSize!: number;
  @Input() pageSizeOptions: (number | 'all')[] = [5, 10, 50, 'all'];
  @Output() pageChange = new EventEmitter<{ pageIndex: number, pageSize: number }>();

  currentPageIndex: number = 0;
  

  ngOnInit(): void {
    if (!this.pageSizeOptions.includes('all')) {
      this.pageSizeOptions.push('all');
    }
  }

  onPageSizeChange(event: any) {
    const newSize = event.target.value === 'all' ? this.length : +event.target.value;
    this.pageSize = newSize;
    this.currentPageIndex = 0;
    this.pageChange.emit({ pageIndex: this.currentPageIndex, pageSize: newSize });
  }

  nextPage() {
    if ((this.currentPageIndex + 1) * this.pageSize < this.length) {
      this.currentPageIndex++;
      this.emitChange();
    }
  }

  prevPage() {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.emitChange();
    }
  }

  private emitChange() {
    this.pageChange.emit({ pageIndex: this.currentPageIndex, pageSize: this.pageSize });
  }

  getRangeLabel(): string {
    const start = this.currentPageIndex * this.pageSize + 1;
    const end = Math.min((this.currentPageIndex + 1) * this.pageSize, this.length);
    return `${start} – ${end} of ${this.length}`;
  }
}
