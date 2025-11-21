import { Component, ElementRef, model, output, ViewChild } from '@angular/core';
import { MemberParams } from '../../../types/member';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.html'
})
export class FilterModal {
  @ViewChild('filterModal') modalRef!: ElementRef<HTMLDialogElement>;
  public readonly closeModal = output();
  public readonly submitData = output<MemberParams>();
  public readonly params = model(new MemberParams());

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.params.set(JSON.parse(filters));
    }
  }


  public open(): void {
    this.modalRef.nativeElement.showModal();
  }

  protected close(): void {
    this.modalRef.nativeElement.close();
    this.closeModal.emit();
  }

  protected submit(): void {
    this.submitData.emit(this.params());
    this.close();
  }

  protected onMinAgeChange(): void {
    if (this.params().minAge < 18) {
      this.params().minAge = 18;
    }
  }

  protected onMaxAgeChange(): void {
    if (this.params().maxAge < this.params().minAge) {
      this.params().maxAge = this.params().minAge;
    }
  }
}
