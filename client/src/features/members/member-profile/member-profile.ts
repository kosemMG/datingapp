import { Component, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html'
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm;

  protected readonly memberService = inject(MemberService);
  protected readonly accountService = inject(AccountService);
  protected readonly toast = inject(ToastService);

  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: ''
  };

  public ngOnInit(): void {
    const { displayName = '', description = '', city = '', country = '' } = this.memberService.member() ?? {};
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
    if (!this.memberService.member()) return;

    const updatedMember: Partial<Member> = { ...this.memberService.member(), ...this.editableMember };
    this.memberService.updateMember(this.editableMember).subscribe(() => {
      const currentUser = this.accountService.currentUser();
      if (currentUser && updatedMember.displayName !== currentUser.displayName) {
        currentUser.displayName = updatedMember.displayName as string;
        this.accountService.setCurrentUser(currentUser);
      }
      this.toast.success('Profile updated!');
      this.memberService.editMode.set(false);
      this.memberService.member.set(updatedMember as Member);
      this.editForm?.reset(updatedMember);
    });
  }
}
