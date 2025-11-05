import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../../../core/services/member.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Photo } from '../../../types/photo';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-photos',
  imports: [AsyncPipe],
  templateUrl: './member-photos.html'
})
export class MemberPhotos implements OnInit {
  private readonly memberService = inject(MemberService);
  private readonly route = inject(ActivatedRoute);

  protected photos$?: Observable<Photo[]>;

  public ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.photos$ = this.memberService.getMemberPhotos(memberId);
    }
  }
}
