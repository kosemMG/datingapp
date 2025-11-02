import { Component, inject } from '@angular/core';
import { Nav } from '../layout/nav/nav';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    Nav,
    RouterOutlet
  ]
})
export class App {
  protected readonly router = inject(Router);
}
