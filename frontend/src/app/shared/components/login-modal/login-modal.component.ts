import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  template: `
    <div class="login-modal-container">
      <!-- Header -->
      <div class="modal-header">
        <div class="modal-title-section">
          <h1 class="modal-title">Welcome Back</h1>
          <p class="modal-subtitle">Sign in to your account</p>
        </div>
        <button
          mat-icon-button
          class="close-button"
          (click)="onClose()"
          aria-label="Close login modal">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <!-- Social Login Buttons -->
        <div class="social-login-section">
          <button 
            class="social-login-button google-button"
            [disabled]="isLoading()"
            (click)="onGoogleLogin()">
            <div class="button-content">
              @if (isGoogleLoading()) {
                <div class="spinner"></div>
              } @else {
                <svg class="social-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              }
              <span>Continue with Google</span>
            </div>
          </button>

          <button 
            class="social-login-button facebook-button"
            [disabled]="isLoading()"
            (click)="onFacebookLogin()">
            <div class="button-content">
              @if (isFacebookLoading()) {
                <div class="spinner"></div>
              } @else {
                <svg class="social-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              }
              <span>Continue with Facebook</span>
            </div>
          </button>
        </div>

        <!-- Divider -->
        <div class="divider-section">
          <div class="divider-line"></div>
          <span class="divider-text">or</span>
          <div class="divider-line"></div>
        </div>

        <!-- Email Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onEmailLogin()" class="email-form">
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <div class="input-container">
              <input 
                id="email"
                class="form-input"
                type="email" 
                formControlName="email"
                placeholder="Enter your email address"
                autocomplete="email">
              <mat-icon class="input-icon">email</mat-icon>
            </div>
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <div class="error-message">
                @if (loginForm.get('email')?.errors?.['required']) {
                  Email is required
                }
                @if (loginForm.get('email')?.errors?.['email']) {
                  Please enter a valid email address
                }
              </div>
            }
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="input-container">
              <input 
                id="password"
                class="form-input"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="Enter your password"
                autocomplete="current-password">
              <button
                type="button"
                class="password-toggle"
                (click)="togglePasswordVisibility()"
                [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'">
                <mat-icon>{{showPassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </div>
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <div class="error-message">
                @if (loginForm.get('password')?.errors?.['required']) {
                  Password is required
                }
                @if (loginForm.get('password')?.errors?.['minlength']) {
                  Password must be at least 6 characters
                }
              </div>
            }
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button
              type="submit"
              class="primary-button"
              [disabled]="loginForm.invalid || isLoading()">
              @if (isEmailLoading()) {
                <div class="spinner"></div>
                <span>Signing In...</span>
              } @else {
                <span>Sign In</span>
              }
            </button>

            <button
              type="button"
              class="forgot-password-button"
              (click)="onForgotPassword()">
              Forgot your password?
            </button>
          </div>
        </form>

        <!-- Sign Up Section -->
        <div class="signup-section">
          <p class="signup-text">
            Don't have an account? 
            <button 
              type="button"
              class="signup-button"
              (click)="onSignUp()">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './login-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginModalComponent {
  private dialogRef = inject(MatDialogRef<LoginModalComponent>);
  private fb = inject(FormBuilder);

  // Signals for loading states
  readonly isGoogleLoading = signal(false);
  readonly isFacebookLoading = signal(false);
  readonly isEmailLoading = signal(false);
  readonly showPassword = signal(false);

  // Computed loading state
  readonly isLoading = computed(() => 
    this.isGoogleLoading() || this.isFacebookLoading() || this.isEmailLoading()
  );

  // Reactive form
  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onClose(): void {
    this.dialogRef.close();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  async onGoogleLogin(): Promise<void> {
    this.isGoogleLoading.set(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Google login successful!');
      this.dialogRef.close({ provider: 'google', success: true });
    } catch (error) {
      console.error('Google login failed:', error);
    } finally {
      this.isGoogleLoading.set(false);
    }
  }

  async onFacebookLogin(): Promise<void> {
    this.isFacebookLoading.set(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Facebook login successful!');
      this.dialogRef.close({ provider: 'facebook', success: true });
    } catch (error) {
      console.error('Facebook login failed:', error);
    } finally {
      this.isFacebookLoading.set(false);
    }
  }

  async onEmailLogin(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.isEmailLoading.set(true);
    try {
      const formValue = this.loginForm.getRawValue();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Email login successful!');
      this.dialogRef.close({ 
        provider: 'email', 
        success: true, 
        data: formValue 
      });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      this.isEmailLoading.set(false);
    }
  }

  onForgotPassword(): void {
    console.log('Forgot password clicked');
    // Implement forgot password logic here
  }

  onSignUp(): void {
    this.dialogRef.close({ action: 'signup' });
  }
}