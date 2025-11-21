import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginCredentials, RegisterCredentials, User } from '../../types/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public currentUser = signal<User | null>(null);

  public readonly baseUrl = environment.apiUrl;
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
    localStorage.removeItem('filters');
    this.currentUser.set(null);
  }

  public setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }
}
