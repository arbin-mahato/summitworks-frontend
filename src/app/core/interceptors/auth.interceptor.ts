import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  
  // Skip cookie access if not in browser
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  // Get the token from cookies (same way AuthService does)
  const nameEQ = "token=";
  const ca = document.cookie.split(';');
  let token = null;
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) {
      token = c.substring(nameEQ.length, c.length);
      break;
    }
  }

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
