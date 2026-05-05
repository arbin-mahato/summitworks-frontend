import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Mail, Lock, LogIn, ShieldAlert } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="hero-section">
          <div class="hero-bg"></div>
          <lucide-icon name="log-in" size="48" class="hero-icon"></lucide-icon>
          <h1>Welcome Back</h1>
          <p>Sign in to continue to Cozy</p>
        </div>

        @if (isAdminRequired) {
          <div class="admin-notice">
            <lucide-icon name="shield-alert" size="18"></lucide-icon>
            <div>
              <strong>Admin Access Required</strong>
              <p>Please log in with an administrator account to access the panel.</p>
            </div>
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="auth-form">
          <div class="form-group">
            <label>Email Address</label>
            <div class="input-wrapper">
              <lucide-icon name="mail" size="18" class="input-icon"></lucide-icon>
              <input type="email" formControlName="email" placeholder="name@example.com">
            </div>
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="input-wrapper">
              <lucide-icon name="lock" size="18" class="input-icon"></lucide-icon>
              <input type="password" formControlName="password" placeholder="••••••••">
            </div>
          </div>

          @if (errorMessage) {
            <div class="error-message">
              {{ errorMessage }}
            </div>
          }

          <button type="submit" class="submit-btn">
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <div class="switch-auth">
          Don't have an account? <a routerLink="/signup">Sign up</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-gray-50);
      padding: var(--space-4);
    }

    .auth-container {
      width: 100%;
      max-width: 400px;
      background: var(--color-white);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      animation: slideUp var(--duration-moderate) var(--ease-out);
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .hero-section {
      text-align: center;
      margin-bottom: var(--space-8);
      position: relative;
    }

    .hero-bg {
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 120px;
      background: var(--gradient-ocean);
      border-radius: var(--radius-full);
      filter: blur(40px);
      opacity: 0.2;
      z-index: 0;
    }

    .hero-icon {
      color: var(--color-primary-600);
      margin-bottom: var(--space-4);
      position: relative;
      z-index: 1;
    }

    .hero-section h1 {
      font-size: var(--text-3xl);
      margin-bottom: var(--space-2);
    }

    .hero-section p {
      color: var(--color-gray-500);
      font-size: var(--text-sm);
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .form-group label {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--color-gray-700);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: var(--space-4);
      color: var(--color-gray-400);
    }

    input {
      width: 100%;
      height: 48px;
      padding: 0 var(--space-4) 0 48px;
      border: 1px solid var(--color-gray-300);
      border-radius: var(--radius-base);
      transition: var(--transition-base);
    }

    input:focus {
      outline: none;
      border-color: var(--color-primary-500);
      box-shadow: var(--shadow-colored);
    }

    .submit-btn {
      height: 48px;
      background: var(--gradient-primary);
      color: white;
      font-weight: var(--font-semibold);
      border-radius: var(--radius-base);
      transition: var(--transition-base);
      margin-top: var(--space-2);
    }
    
    .error-message {
      background: #fee2e2;
      color: #b91c1c;
      padding: var(--space-3);
      border-radius: var(--radius-base);
      font-size: var(--text-sm);
      text-align: center;
      margin-bottom: var(--space-2);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .submit-btn:hover:not(:disabled) {
      transform: scale(1.02);
      box-shadow: var(--shadow-lg);
    }

    .switch-auth {
      text-align: center;
      margin-top: var(--space-8);
      font-size: var(--text-sm);
      color: var(--color-gray-600);
    }

    .switch-auth a {
      color: var(--color-primary-600);
      font-weight: var(--font-semibold);
    }

    .switch-auth a:hover {
      text-decoration: underline;
    }
    .admin-notice {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-4);
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: var(--radius-base);
      color: #92400e;
      margin-bottom: var(--space-6);
    }

    .admin-notice strong {
      display: block;
      font-size: var(--text-sm);
      margin-bottom: 2px;
    }

    .admin-notice p {
      font-size: 12px;
      opacity: 0.8;
    }
  `]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  isAdminRequired = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage: string | null = null;
  isLoading = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['adminRequired']) {
        this.isAdminRequired = true;
      }
    });
  }

  onLogin() {
    if (this.isLoading) return;
    
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter a valid email and password (min. 6 characters).';
      return;
    }

    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
        }
      });
    }
  }
}
