import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Member } from '../../types/member';
import { LikePredicate } from '../../types/like-predicate';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  public readonly likeIds = signal<string[]>([]);

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public toggleLike(targetMemberId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}likes/${targetMemberId}`, {});
  }

  public getLikes(predicate: LikePredicate, pageNumber: number, pageSize: number): Observable<PaginatedResult<Member>> {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('predicate', predicate);

    return this.http.get<PaginatedResult<Member>>(`${this.baseUrl}likes`, { params });
  }

  public getLikeIds(): void {
    this.http.get<string[]>(`${this.baseUrl}likes/list`)
      .subscribe((ids: string[]) => this.likeIds.set(ids));
  }

  public clearLikeIds(): void {
    this.likeIds.set([]);
  }
}
