import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginCredentials, RegisterCredentials, User } from '../../types/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public currentUser = signal<User | null>(null);

  public readonly baseUrl = 'https://localhost:5001/api/';
  private readonly http = inject(HttpClient);

  public register(credentials: RegisterCredentials): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}account/register`, credentials)
      .pipe(
        tap((user: User) => {
          if (user) {
            this.setCurrentUser(user);
          }
        })
      );
  }

  public login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}account/login`, credentials)
      .pipe(
        tap((user: User) => {
          if (user) {
            this.setCurrentUser(user);
          }
        })
      );
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }
}
