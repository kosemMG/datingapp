import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html'
})
export class TestErrors {
  protected readonly validationErrors = signal<string[]>([]);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:5001/api/';

  public get404Error(): void {
    this.http.get(`${this.baseUrl}buggy/not-found`).subscribe({
      error: err => console.log(err)
    });
  }

  public get401Error(): void {
    this.http.get(`${this.baseUrl}buggy/auth`).subscribe({
      error: err => console.log(err)
    });
  }

  public get400Error(): void {
    this.http.get(`${this.baseUrl}buggy/bad-request`).subscribe({
      error: err => console.log(err)
    });
  }

  public get400ValidationError(): void {
    this.http.post(`${this.baseUrl}account/register`, {}).subscribe({
      error: err => {
        console.log(err);
        this.validationErrors.set(err);
      }
    });
  }

  public get500Error(): void {
    this.http.get(`${this.baseUrl}buggy/server-error`).subscribe({
      error: err => console.log(err)
    });
  }
}
