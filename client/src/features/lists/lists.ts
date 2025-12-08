import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes.service';
import { Member } from '../../types/member';
import { LikePredicate } from '../../types/like-predicate';
import { MemberCard } from '../members/member-card/member-card';
import { PaginatedResult } from '../../types/pagination';
import { Paginator } from '../../shared/paginator/paginator';

@Component({
  selector: 'app-lists',
  imports: [MemberCard, Paginator],
  templateUrl: './lists.html'
})
export class Lists implements OnInit {
  protected readonly paginatedResult = signal<PaginatedResult<Member> | null>(null);
  private readonly likesService = inject(LikesService);

  protected readonly tabs: { label: string; value: LikePredicate }[] = [
    { label: 'Liked', value: 'liked' },
    { label: 'Liked me', value: 'likedBy' },
    { label: 'Mutual', value: 'mutual' }
  ];

  protected predicate: LikePredicate = 'liked';
  protected pageNumber = 1;
  protected pageSize = 5;

  public ngOnInit(): void {
    this.loadLikes();
  }

  protected setPredicate(predicate: LikePredicate): void {
    if (this.predicate === predicate) return;
    this.predicate = predicate;
    this.pageNumber = 1;
    this.loadLikes();
  }

  protected onPageChange({ pageNumber, pageSize }: { pageNumber: number; pageSize: number }): void {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.loadLikes();
  }

  private loadLikes(): void {
    this.likesService.getLikes(this.predicate, this.pageNumber, this.pageSize)
      .subscribe((result: PaginatedResult<Member>) => this.paginatedResult.set(result));
  }
}
