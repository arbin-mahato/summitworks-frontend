import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LogOut, Hotel, Calendar, User, Shield } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <header class="header">
      <div class="header-container">
        <a routerLink="/app/hotels" class="logo">
          <lucide-icon name="hotel" class="logo-icon"></lucide-icon>
          <span>Cozy</span>
        </a>

        <nav class="nav">
          <a routerLink="/app/hotels" routerLinkActive="active" class="nav-link">Hotels</a>
          <a routerLink="/app/bookings" routerLinkActive="active" class="nav-link">My Bookings</a>
          <a routerLink="/app/admin/dashboard" routerLinkActive="active" class="nav-link admin-link">
            <lucide-icon name="shield" size="16"></lucide-icon>
            Admin Panel
          </a>
        </nav>

        <div class="user-actions">
          <div class="user-badge" *ngIf="authService.currentUser() as user">
            <div class="avatar">{{ user.name.substring(0, 2).toUpperCase() }}</div>
            <div class="user-info">
              <span class="username">{{ user.name }}</span>
              <span class="role-badge" [class.admin]="authService.isAdmin()">
                {{ authService.isAdmin() ? 'ADMIN' : 'USER' }}
              </span>
            </div>
          </div>
          <button class="logout-btn" (click)="onLogout()" title="Logout">
            <lucide-icon name="log-out" size="20"></lucide-icon>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 64px;
      background: var(--color-white);
      box-shadow: var(--shadow-sm);
      border-bottom: 1px solid var(--color-gray-200);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header-container {
      max-width: 1280px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-8);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-family: var(--font-display);
      font-size: var(--text-2xl);
      font-weight: var(--font-bold);
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .logo-icon {
      color: var(--color-primary-600);
      -webkit-text-fill-color: var(--color-primary-600);
    }

    .nav {
      display: flex;
      gap: var(--space-4);
    }

    .nav-link {
      font-family: var(--font-heading);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--color-gray-700);
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-base);
      transition: var(--transition-base);
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .nav-link:hover {
      background: var(--color-primary-50);
      color: var(--color-primary-600);
      transform: scale(1.02);
    }

    .nav-link.active {
      color: var(--color-primary-600);
      background: var(--color-primary-50);
      box-shadow: inset 0 -2px 0 var(--color-primary-500);
    }

    .admin-link {
      color: var(--color-accent-600);
    }

    .admin-link:hover {
      background: var(--color-accent-50);
      color: var(--color-accent-700);
      transform: scale(1.02);
    }

    .admin-link.active {
      color: var(--color-accent-700);
      background: var(--color-accent-50);
      box-shadow: inset 0 -2px 0 var(--color-accent-500);
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .user-badge {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      background: var(--color-gray-50);
      border: 1px solid var(--color-gray-200);
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: var(--gradient-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--text-xs);
      font-weight: var(--font-bold);
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .username {
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      color: var(--color-gray-900);
    }

    .role-badge {
      font-size: 10px;
      font-weight: var(--font-bold);
      padding: 0 var(--space-2);
      border-radius: var(--radius-full);
      width: fit-content;
      background: var(--color-primary-100);
      color: var(--color-primary-700);
    }

    .role-badge.admin {
      background: var(--color-accent-100);
      color: var(--color-accent-700);
    }

    .logout-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-base);
      color: var(--color-gray-500);
      transition: var(--transition-base);
    }

    .logout-btn:hover {
      background: var(--color-error-50);
      color: var(--color-error-600);
    }

    @media (max-width: 640px) {
      .nav {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);

  onLogout() {
    this.authService.logout();
  }
}
