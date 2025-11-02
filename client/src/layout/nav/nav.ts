import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { LoginCredentials } from '../../types/user';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html'
})
export class Nav {
  protected readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected credentials = {} as LoginCredentials;

  protected login(): void {
    this.accountService.login(this.credentials).subscribe({
      next: () => {
        this.toast.success('Logged in successfully');
        this.router.navigateByUrl('/members');
        this.credentials = {} as LoginCredentials;
      },
      error: (error) => this.toast.error(error.error)
    });
  }

  protected logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
