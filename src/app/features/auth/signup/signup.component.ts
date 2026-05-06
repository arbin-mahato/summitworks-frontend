import { Component, inject, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { LucideAngularModule, User, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).+$/;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
            <div class="input-wrapper" [class.input-error]="hasError('fullName')">
              <lucide-icon name="user" size="18" class="input-icon"></lucide-icon>
              <input type="text" formControlName="fullName" placeholder="John Doe">
            </div>
            @if (hasError('fullName')) {
              <div class="error-text">
                @if (signupForm.get('fullName')?.errors?.['required']) {
                  <span>Full name is required</span>
                } @else if (signupForm.get('fullName')?.errors?.['minlength']) {
                  <span>Full name must be at least 3 characters</span>
                } @else if (signupForm.get('fullName')?.errors?.['maxlength']) {
                  <span>Full name must not exceed 80 characters</span>
                }
              </div>
            }
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <div class="input-wrapper" [class.input-error]="hasError('email')">
              <lucide-icon name="mail" size="18" class="input-icon"></lucide-icon>
              <input type="email" formControlName="email" placeholder="name@example.com">
            </div>
            @if (hasError('email')) {
              <div class="error-text">
                @if (signupForm.get('email')?.errors?.['required']) {
                  <span>Email is required</span>
                } @else if (signupForm.get('email')?.errors?.['email']) {
                  <span>Please enter a valid email address</span>
                } @else if (signupForm.get('email')?.errors?.['maxlength']) {
                  <span>Email must not exceed 120 characters</span>
                }
              </div>
            }
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="input-wrapper" [class.input-error]="hasError('password')">
              <lucide-icon name="lock" size="18" class="input-icon"></lucide-icon>
              <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" placeholder="••••••••">
              <button type="button" class="password-toggle" (click)="togglePasswordVisibility()" tabindex="-1">
                @if (showPassword()) {
                  <lucide-icon name="eye-off" size="18"></lucide-icon>
                } @else {
                  <lucide-icon name="eye" size="18"></lucide-icon>
                }
              </button>
            </div>
            <div class="validation-hints">
              <span class="hint" [class.valid]="hasMinLength()">
                <span class="hint-dot">○</span>
                At least 6 characters
              </span>
              <span class="hint" [class.valid]="hasMaxLength()">
                <span class="hint-dot">○</span>
                Maximum 100 characters
              </span>
              <span class="hint" [class.valid]="hasLetter()">
                <span class="hint-dot">○</span>
                Contains a letter
              </span>
              <span class="hint" [class.valid]="hasNumber()">
                <span class="hint-dot">○</span>
                Contains a number
              </span>
            </div>
            @if (hasError('password')) {
              <div class="error-text">
                @if (signupForm.get('password')?.errors?.['required']) {
                  <span>Password is required</span>
                } @else if (signupForm.get('password')?.errors?.['minlength']) {
                  <span>Password must be at least 6 characters</span>
                } @else if (signupForm.get('password')?.errors?.['maxlength']) {
                  <span>Password must not exceed 100 characters</span>
                } @else if (signupForm.get('password')?.errors?.['pattern']) {
                  <span>Password must contain at least one letter and one number</span>
                }
              </div>
            }
          </div>

          @if (errorMessage) {
            <div class="error-message">
              {{ errorMessage }}
            </div>
          }

          <button type="submit" [disabled]="signupForm.invalid || isLoading" class="submit-btn">
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
      border-radius: var(--radius-base);
      transition: all var(--transition-base);
    }

    .input-wrapper.input-error input {
      border-color: #dc2626;
      background-color: #fef2f2;
    }

    .input-wrapper.input-error input:focus {
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    .input-wrapper.input-error .input-icon {
      color: #dc2626;
    }

    .input-icon {
      position: absolute;
      left: var(--space-4);
      color: var(--color-gray-400);
      transition: color var(--transition-base);
    }

    input {
      width: 100%;
      height: 48px;
      padding: 0 48px 0 48px;
      border: 1px solid var(--color-gray-300);
      border-radius: var(--radius-base);
      transition: var(--transition-base);
    }

    input:focus {
      outline: none;
      border-color: var(--color-primary-500);
      box-shadow: var(--shadow-colored);
    }

    .password-toggle {
      position: absolute;
      right: var(--space-4);
      background: none;
      border: none;
      color: var(--color-gray-400);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      width: 24px;
      height: 24px;
      transition: color var(--transition-base);
    }

    .password-toggle:hover {
      color: var(--color-gray-600);
    }

    .password-toggle lucide-icon {
      width: 18px;
      height: 18px;
    }

    .error-text {
      font-size: 12px;
      color: #dc2626;
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .validation-hints {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 8px;
    }

    .hint {
      font-size: 12px;
      color: var(--color-gray-500);
      display: flex;
      align-items: center;
      gap: 6px;
      transition: color var(--transition-base);
    }

    .hint-dot {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      font-size: 10px;
    }

    .hint.valid {
      color: var(--color-success-600);
    }

    .submit-btn {
      height: 48px;
      background: var(--gradient-primary);
      color: white;
      font-weight: var(--font-semibold);
      border-radius: var(--radius-base);
      transition: var(--transition-base);
      margin-top: var(--space-2);
      border: none;
      cursor: pointer;
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

  showPassword = signal(false);
  passwordValue = signal('');

  signupForm: FormGroup = this.fb.group({
    fullName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(80)
      ]
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(120)
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        Validators.pattern(PASSWORD_PATTERN)
      ]
    ]
  });

  // Computed signals for password validation hints
  hasMinLength = computed(() => this.passwordValue().length >= 6);
  hasMaxLength = computed(() => this.passwordValue().length > 0 && this.passwordValue().length <= 100);
  hasLetter = computed(() => /[A-Za-z]/.test(this.passwordValue()));
  hasNumber = computed(() => /\d/.test(this.passwordValue()));

  errorMessage: string | null = null;
  isLoading = false;

  constructor() {
    // Subscribe to password changes to update the signal
    this.signupForm.get('password')?.valueChanges.subscribe(value => {
      this.passwordValue.set(value || '');
    });
  }

  get passwordControl(): AbstractControl | null {
    return this.signupForm.get('password');
  }

  hasError(fieldName: string): boolean {
    const control = this.signupForm.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  onSignup() {
    if (this.isLoading) return;

    if (this.signupForm.invalid) {
      this.errorMessage = 'Please fix the validation errors above';
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
