import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.html'
})
export class NotFound {
  private readonly location = inject(Location);

  public goBack(): void {
    this.location.back();
  }
}
