import { Component, input } from '@angular/core';
import { Member } from '../../../types/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';

@Component({
  selector: 'app-member-card',
  imports: [
    RouterLink,
    AgePipe
  ],
  templateUrl: './member-card.html'
})
export class MemberCard {
  public readonly member = input.required<Member>();
}
