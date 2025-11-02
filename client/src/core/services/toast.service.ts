import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastContainerId = 'toast-container';

  private _toastContainer?: HTMLElement | null;

  private get toastContainer(): HTMLElement | null {
    if (!this._toastContainer) {
      this._toastContainer = document.getElementById(this.toastContainerId);
    }
    return this._toastContainer;
  }

  constructor() {
    this.createToastContainer();
  }

  public success(message: string, duration?: number): void {
    this.createToastElement(message, 'alert-success', duration);
  }

  public error(message: string, duration?: number): void {
    this.createToastElement(message, 'alert-error', duration);
  }

  public warning(message: string, duration?: number): void {
    this.createToastElement(message, 'alert-warning', duration);
  }

  public info(message: string, duration?: number): void {
    this.createToastElement(message, 'alert-info', duration);
  }

  private createToastContainer(): void {
    if (this.toastContainer) return;

    const container = document.createElement('div');
    container.id = this.toastContainerId;
    container.className = 'toast toast-bottom toast-end';
    document.body.appendChild(container);
  }

  private createToastElement(message: string, alertClass: string, duration = 5000): void {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass, 'shadow-lg');
    toast.innerHTML = `
      <span>${message}</span>
      <button type="button" class="ml-4 btn btn-sm btn-ghost">x</button>
    `;
    toast.querySelector('button')
      ?.addEventListener('click', () => this.toastContainer?.removeChild(toast));

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (this.toastContainer!.contains(toast)) {
        this.toastContainer!.removeChild(toast);
      }
    }, duration);
  }
}
