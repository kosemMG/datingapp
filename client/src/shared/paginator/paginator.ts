import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.html'
})
export class Paginator {
  public readonly pageNumber = model(1);
  public readonly pageSize = model(10);
  public readonly totalCount = input(0);
  public readonly totalPages = input(0);
  public readonly pageSizeOptions = input([5, 10, 20, 50]);
  public readonly lastItemIndex = computed(
    () => Math.min(this.pageNumber() * this.pageSize(), this.totalCount())
  );
  public readonly pageChange = output<{ pageNumber: number; pageSize: number }>();

  protected onPageChange(newPage?: number, pageSize?: EventTarget | null): void {
    if (newPage) {
      this.pageNumber.set(newPage);
    }
    if (pageSize) {
      const size = +(pageSize as HTMLSelectElement).value;
      this.pageSize.set(size);
    }

    this.pageChange.emit({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize()
    });
  }
}
