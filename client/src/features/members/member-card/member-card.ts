import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../types/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { LikesService } from '../../../core/services/likes.service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './member-card.html'
})
export class MemberCard {
  public readonly member = input.required<Member>();
  protected readonly hasLiked = computed(() => this.likesService.likeIds().includes(this.member().id));

  private readonly likesService = inject(LikesService);

  protected toggleLike(event: Event): void {
    event.stopPropagation();
    this.likesService.toggleLike(this.member().id).subscribe(() => {
      const updateFunc: (ids: string[]) => string[] = this.hasLiked()
        ? (ids: string[]) => ids.filter(id => id !== this.member().id)
        : (ids: string[]) => [...ids, this.member().id];

      this.likesService.likeIds.update(updateFunc);
    });
  }
}
