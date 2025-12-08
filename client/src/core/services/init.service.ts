import { inject, Injectable } from '@angular/core';
import { AccountService } from './account.service';
import { User } from '../../types/user';
import { Observable, of } from 'rxjs';
import { LikesService } from './likes.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private readonly accountService = inject(AccountService);
  private readonly likeService = inject(LikesService);

  public init(): Observable<null> {
    const user = localStorage.getItem('user');
    if (!user) return of(null);

    this.accountService.currentUser.set(JSON.parse(user) as User);
    this.likeService.getLikeIds();
    return of(null);
  }
}
