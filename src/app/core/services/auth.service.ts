import { Injectable, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of } from 'rxjs';
import { User } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSignal = signal<User | null>(null);
  private apiUrl = `${environment.apiUrl}/api/v1/auth`;
  
  currentUser = computed(() => this.userSignal());
  isLoggedIn = computed(() => !!this.userSignal());
  isAdmin = computed(() => this.userSignal()?.role === 'admin');

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUser();
  }

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        const data = response.data || response;
        const token = data.token || data.accessToken;
        
        // Construct user object if not provided in response
        const user = data.user || {
          id: 'session',
          email: credentials.email,
          name: credentials.email.split('@')[0],
          role: data.role?.toLowerCase() === 'admin' ? 'admin' : 'user'
        };

        if (token) {
          this.userSignal.set(user);
          if (isPlatformBrowser(this.platformId)) {
            this.setCookie('token', token, 7);
            localStorage.setItem('user', JSON.stringify(user));
          }
          
          if (user.role === 'admin') {
            this.router.navigate(['/app/admin/dashboard']);
          } else {
            this.router.navigate(['/app/hotels']);
          }
        }
      })
    );
  }

  signup(data: any) {
    return this.http.post<any>(`${this.apiUrl}/signup`, data).pipe(
      tap(response => {
        const resData = response.data || response;
        const token = resData.token || resData.accessToken;
        
        const user = resData.user || {
          id: 'session',
          email: data.email,
          name: data.fullName || data.email.split('@')[0],
          role: resData.role?.toLowerCase() === 'admin' ? 'admin' : 'user'
        };

        if (token) {
          this.userSignal.set(user);
          if (isPlatformBrowser(this.platformId)) {
            this.setCookie('token', token, 7);
            localStorage.setItem('user', JSON.stringify(user));
          }
          
          if (user.role === 'admin') {
            this.router.navigate(['/app/admin/dashboard']);
          } else {
            this.router.navigate(['/app/hotels']);
          }
        }
      })
    );
  }

  logout() {
    this.userSignal.set(null);
    if (isPlatformBrowser(this.platformId)) {
      this.deleteCookie('token');
      localStorage.removeItem('user');
    }
    this.router.navigate(['/login']);
  }

  private loadUser() {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      const token = this.getCookie('token');
      
      if (savedUser && savedUser !== 'undefined' && token) {
        try {
          this.userSignal.set(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error parsing user from localStorage', e);
          localStorage.removeItem('user');
        }
      }
    }
  }

  private setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  private getCookie(name: string) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private deleteCookie(name: string) {
    document.cookie = name + '=; Max-Age=-99999999;';
  }
}
