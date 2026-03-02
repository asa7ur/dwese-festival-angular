import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario ya está logueado (tiene token)
  if (authService.getToken()) {
    // Redirigir a la lista de artistas o a la home
    router.navigate(['/artists']);
    return false;
  }

  // Si no está logueado, permitir el acceso al login
  return true;
};
