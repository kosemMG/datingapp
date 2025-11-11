import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-star-button',
  templateUrl: './star-button.html'
})
export class StarButton {
  public readonly disabled = input<boolean>(false);
  public readonly selected = input<boolean>(false);
  public readonly clickEvent = output<Event>();

  protected onClick(event: Event): void {
    this.clickEvent.emit(event);
  }
}
