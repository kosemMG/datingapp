import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.html'
})
export class DeleteButton {
  public readonly disabled = input<boolean>(false);
  public readonly clickEvent = output<Event>();

  protected onClick(event: Event): void {
    this.clickEvent.emit(event);
  }
}
