import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member.service';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../../../types/photo';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { AccountService } from '../../../core/services/account.service';
import { Member } from '../../../types/member';
import { StarButton } from '../../../shared/star-button/star-button';
import { DeleteButton } from '../../../shared/delete-button/delete-button';

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html'
})
export class MemberPhotos implements OnInit {
  protected readonly photos = signal<Photo[]>([]);
  protected readonly loading = signal<boolean>(false);

  protected readonly memberService = inject(MemberService);
  protected readonly accountService = inject(AccountService);
  private readonly route = inject(ActivatedRoute);

  public ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberPhotos(memberId)
        .subscribe((photos: Photo[]) => this.photos.set(photos));
    }
  }

  protected uploadPhoto(file: File): void {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: (photo: Photo) => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo]);
        if (!this.memberService.member()?.imageUrl) {
          this.setMainPhotoLocal(photo);
        }
      },
      error: (error: Error) => {
        console.error('Failed to upload photo:', error.message);
        this.loading.set(false);
      }
    });
  }

  protected setMainPhoto(photo: Photo): void {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => this.setMainPhotoLocal(photo),
      error: (error: Error) => console.error(error.message)
    });
  }

  protected deletePhoto(photo: Photo): void {
    this.memberService.deletePhoto(photo).subscribe({
      next: () => this.photos.update(photos => photos.filter(p => p.id !== photo.id)),
      error: (error: Error) => console.error(error.message)
    });
  }

  private setMainPhotoLocal(photo: Photo): void {
    const currentUser = this.accountService.currentUser();
    if (currentUser) {
      currentUser.imageUrl = photo.url;
      this.accountService.setCurrentUser(currentUser);
    }
    this.memberService.member.update((member: Member | null) => ({
      ...member,
      imageUrl: photo.url
    }) as Member);
  }
}
