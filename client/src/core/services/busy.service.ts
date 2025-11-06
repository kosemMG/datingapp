import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  public readonly busyRequestCount = signal(0);

  public busy(): void {
    this.busyRequestCount.update(current => current + 1);
  }

  public idle(): void {
    this.busyRequestCount.update(current => Math.max(0, current - 1));
  }
}
