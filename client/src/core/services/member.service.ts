import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { EditableMember, Member } from '../../types/member';
import { Photo } from '../../types/photo';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  public readonly editMode = signal(false);
  public readonly member = signal<Member | null>(null);

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.baseUrl}members`);
  }

  public getMemberById(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.baseUrl}members/${id}`)
      .pipe(tap((member: Member): void => this.member.set(member)));
  }

  public getMemberPhotos(id: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}members/${id}/photos`);
  }

  public updateMember(member: EditableMember): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}members`, member);
  }
}
