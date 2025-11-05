import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ActivatedRoute,
  Data,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
import { filter } from 'rxjs';
import { Member } from '../../../types/member';
import { AgePipe } from '../../../core/pipes/age-pipe';

@Component({
  selector: 'app-member-details',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-details.html'
})
export class MemberDetails implements OnInit {
  protected readonly member = signal<Member | undefined>(undefined);
  protected readonly title = signal<string | undefined>('Profile');

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public ngOnInit(): void {
    this.route.data.subscribe(({ member }: Data): void => this.member.set(member as Member));

    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.title.set(this.route.firstChild?.snapshot?.title));
  }
}
