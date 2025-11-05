import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Member } from '../../../types/member';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-member-profile',
  imports: [
    DatePipe
  ],
  templateUrl: './member-profile.html'
})
export class MemberProfile implements OnInit {
  protected readonly member = signal<Member | undefined>(undefined);
  private readonly route = inject(ActivatedRoute);

  public ngOnInit(): void {
    this.route.parent?.data.subscribe(
      ({ member }: Data): void => this.member.set(member as Member)
    );
  }
}
