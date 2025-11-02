import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { LoginCredentials } from '../../types/user';

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html'
})
export class Nav {
  protected readonly accountService = inject(AccountService);

  protected credentials = {} as LoginCredentials;

  protected login(): void {
    this.accountService.login(this.credentials).subscribe({
      next: (result) => {
        console.log(result);
        this.credentials = {} as LoginCredentials;
      },
      error: (error) => console.log(error.message)
    });
  }

  protected logout(): void {
    this.accountService.logout();
  }
}
