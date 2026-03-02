import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  username = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.username() || !this.password()) {
      this.errorMessage.set('Por favor, rellena todos los campos.');
      return;
    }

    this.isLoading.set(true);
    this.authService.login(this.username(), this.password()).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        this.router.navigate(['/artists']);
      },
      error: () => {
        this.errorMessage.set('Credenciales incorrectas. Inténtalo de nuevo.');
        this.isLoading.set(false);
      }
    });
  }
}
