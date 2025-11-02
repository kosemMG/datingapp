import { Component, signal } from '@angular/core';
import { Register } from '../account/register/register';

@Component({
  selector: 'app-home',
  imports: [
    Register
  ],
  templateUrl: './home.html'
})
export class Home {
  protected readonly registerMode = signal(false);

  protected showRegister(value: boolean): void {
    this.registerMode.set(value);
  }
}
