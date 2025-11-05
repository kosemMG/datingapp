import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Member } from '../../types/member';
import { Photo } from '../../types/photo';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.baseUrl}members`);
  }

  public getMemberById(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.baseUrl}members/${id}`);
  }

  public getMemberPhotos(id: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}members/${id}/photos`);
  }
}
