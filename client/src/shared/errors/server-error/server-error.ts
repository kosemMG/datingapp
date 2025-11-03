import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../../../types/error';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.html'
})
export class ServerError {
  protected readonly error: ApiError;
  private readonly router = inject(Router);

  protected showDetails = false;

  constructor() {
    const navigation = this.router.currentNavigation();
    this.error = navigation?.extras?.state?.['error'];
  }

  protected toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
}
