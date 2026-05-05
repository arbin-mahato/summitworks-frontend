import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // If on server, allow navigation to continue so hydration can happen on client
  if (isPlatformServer(platformId)) {
    return true;
  }

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.parseUrl('/login');
};

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // If on server, allow navigation to continue
  if (isPlatformServer(platformId)) {
    return true;
  }

  if (authService.isAdmin()) {
    return true;
  }

  return router.createUrlTree(['/login'], { queryParams: { adminRequired: 'true' } });
};
