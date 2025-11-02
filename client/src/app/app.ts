import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Nav } from '../layout/nav/nav';
import { AccountService } from '../core/services/account.service';
import { User } from '../types/user';
import { Home } from '../features/home/home';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    Nav,
    Home
  ]
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly accountService = inject(AccountService);

  protected readonly members = signal<User[]>([]);

  public ngOnInit(): void {
    this.http.get<User[]>(`${this.accountService.baseUrl}members`).subscribe({
      next: response => this.members.set(response),
      error: error => console.log(error),
      complete: () => console.log('Successfully connected to the server')
    });

    this.setCurrentUser();
  }

  private setCurrentUser(): void {
    const user = localStorage.getItem('user');
    if (!user) return;

    this.accountService.currentUser.set(JSON.parse(user) as User);
  }
}
