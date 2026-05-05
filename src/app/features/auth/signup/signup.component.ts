import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, User, Mail, Lock, UserPlus } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="hero-section">
          <div class="hero-bg"></div>
          <lucide-icon name="user-plus" size="48" class="hero-icon"></lucide-icon>
          <h1>Create Account</h1>
          <p>Join Cozy and start your journey</p>
        </div>

        <form [formGroup]="signupForm" (ngSubmit)="onSignup()" class="auth-form">
          <div class="form-group">
            <label>Full Name</label>
            <div class="input-wrapper">
              <lucide-icon name="user" size="18" class="input-icon"></lucide-icon>
              <input type="text" formControlName="fullName" placeholder="John Doe">
            </div>
          </div>

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
            <div class="validation-hints">
              <span class="hint" [class.valid]="signupForm.get('password')?.valid">At least 6 characters</span>
            </div>
          </div>

          @if (errorMessage) {
            <div class="error-message">
              {{ errorMessage }}
            </div>
          }

          <button type="submit" class="submit-btn">
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <div class="switch-auth">
          Already have an account? <a routerLink="/login">Sign in</a>
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
      background: var(--gradient-sunset);
      border-radius: var(--radius-full);
      filter: blur(40px);
      opacity: 0.2;
      z-index: 0;
    }

    .hero-icon {
      color: var(--color-accent-600);
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
      gap: var(--space-5);
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

    .validation-hints {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 4px;
    }

    .hint {
      font-size: 11px;
      color: var(--color-gray-500);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .hint::before {
      content: '○';
    }

    .hint.valid {
      color: var(--color-success-600);
    }

    .hint.valid::before {
      content: '✓';
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
  `]
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  signupForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage: string | null = null;
  isLoading = false;

  onSignup() {
    if (this.isLoading) return;

    if (this.signupForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly. Password must be at least 6 characters.';
      return;
    }

    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.authService.signup(this.signupForm.value).subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Signup failed. Please try again.';
        }
      });
    }
  }
}
