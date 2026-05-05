import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Heart } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-main">
          <div class="footer-brand">
            <a routerLink="/app/hotels" class="logo">Cozy</a>
            <p class="quote">"Modern hospitality for the modern traveler."</p>
          </div>
          
          <nav class="footer-nav">
            <a routerLink="/app/hotels">Hotels</a>
            <a routerLink="/app/bookings">My Bookings</a>
          </nav>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2026 Cozy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-white);
      border-top: 1px solid var(--color-gray-100);
      padding: var(--space-6) 0 var(--space-4);
      margin-top: auto;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--space-8);
    }

    .footer-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .logo {
      font-family: var(--font-display);
      font-size: var(--text-2xl);
      font-weight: var(--font-bold);
      color: var(--color-primary-600);
      text-decoration: none;
    }

    .quote {
      font-style: italic;
      color: var(--color-gray-500);
      font-size: var(--text-sm);
    }

    .footer-nav {
      display: flex;
      gap: var(--space-8);
    }

    .footer-nav a {
      color: var(--color-gray-600);
      text-decoration: none;
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      transition: color 0.2s;
    }

    .footer-nav a:hover {
      color: var(--color-primary-600);
    }

    .footer-bottom {
      border-top: 1px solid var(--color-gray-50);
      padding-top: var(--space-4);
      text-align: center;
      color: var(--color-gray-400);
      font-size: var(--text-xs);
    }

    @media (max-width: 640px) {
      .footer-main {
        flex-direction: column;
        gap: var(--space-8);
        text-align: center;
      }
      
      .footer-nav {
        gap: var(--space-6);
      }
    }
  `]
})
export class FooterComponent {}
