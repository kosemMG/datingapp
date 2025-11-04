import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Member } from '../../types/member';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly account = inject(AccountService);
  private readonly baseUrl = environment.apiUrl;

  public getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.baseUrl}members`, this.getHttpOptions());
  }

  public getMemberById(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.baseUrl}members/${id}`, this.getHttpOptions());
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.account.currentUser()?.token}`
      })
    };
  }
}
