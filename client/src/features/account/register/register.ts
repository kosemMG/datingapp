import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCredentials, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styles: ``
})
export class Register {
  public readonly cancelRegister = output<boolean>();
  protected readonly credentials = {} as RegisterCredentials;

  private readonly accountService = inject(AccountService);

  protected register(): void {
    this.accountService.register(this.credentials).subscribe({
      next: (response: User) => {
        console.log(response);
        this.cancel();
      },
      error: (error: Error) => console.log(error)
    });
  }

  protected cancel(): void {
    this.cancelRegister.emit(false);
  }
}
