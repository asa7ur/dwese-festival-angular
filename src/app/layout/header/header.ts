import {Component, inject} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {AuthService} from '../../core/services/auth';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './header.html',
})
export class HeaderComponent {
  private authService = inject(AuthService);

  isLoggedIn$ = this.authService.isLoggedIn();
  userName$ = this.authService.userName$;

  logout(): void {
    this.authService.logout();
  }
}
