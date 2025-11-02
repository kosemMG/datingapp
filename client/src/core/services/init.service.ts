import { inject, Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { User } from '../../types/user';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private readonly accountService = inject(AccountService);

  public init(): Observable<null> {
    const user = localStorage.getItem('user');
    if (!user) return of(null);

    this.accountService.currentUser.set(JSON.parse(user) as User);
    return of(null);
  }
}
