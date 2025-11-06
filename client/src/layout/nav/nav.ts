import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { LoginCredentials } from '../../types/user';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { themes } from '../themes';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive, UpperCasePipe],
  templateUrl: './nav.html'
})
export class Nav implements OnInit {
  protected readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly themes = themes;
  protected readonly selectedTheme = signal<string>(localStorage.getItem('theme') ?? 'light');
  protected credentials = {} as LoginCredentials;

  public ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  protected switchTheme(theme: string): void {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
    this.closeDropdown();
  }

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
    this.closeDropdown();
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  protected closeDropdown(): void {
    const elem = document.activeElement as HTMLDivElement;
    elem?.blur();
  }
}
