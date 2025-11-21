import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { EditableMember, Member, MemberParams } from '../../types/member';
import { Photo } from '../../types/photo';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  public readonly editMode = signal(false);
  public readonly member = signal<Member | null>(null);

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public getMembers(memberParams: MemberParams): Observable<PaginatedResult<Member>> {
    const { pageNumber, pageSize, minAge, maxAge, gender, orderBy } = memberParams;
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('minAge', minAge);
    params = params.append('maxAge', maxAge);
    params = params.append('orderBy', orderBy);
    if (gender) {
      params = params.append('gender', gender);
    }

    return this.http.get<PaginatedResult<Member>>(`${this.baseUrl}members`, { params })
      .pipe(tap(() => localStorage.setItem('filters', JSON.stringify(memberParams))));
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
  
  public uploadPhoto(photo: File): Observable<Photo> {
    const formData = new FormData();
    formData.append('file', photo);
    return this.http.post<Photo>(`${this.baseUrl}members/upload-photo`, formData);
  }

  public setMainPhoto(photo: Photo): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}members/set-main-photo/${photo.id}`, {});
  }

  public deletePhoto(photo: Photo): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}members/delete-photo/ ${photo.id}`);
  }
}
