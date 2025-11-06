import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html'
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm;

  protected readonly member = signal<Member | undefined>(undefined);
  protected readonly memberService = inject(MemberService);
  protected readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: ''
  };

  public ngOnInit(): void {
    this.route.parent?.data.subscribe(
      ({ member }: Data): void => this.member.set(member as Member)
    );
    const { displayName = '', description = '', city = '', country = '' } = this.member() ?? {};
    this.editableMember = { displayName, description, city, country };
  }

  public ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  protected notify($event: BeforeUnloadEvent): void {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }

  protected updateProfile(): void {
    if (!this.member()) return;

    const updatedMember: Partial<Member> = { ...this.member(), ...this.editableMember };
    console.log(updatedMember);
    this.toast.success('Profile updated!');
    this.memberService.editMode.set(false);
  }
}
