import { Injectable, inject, computed, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, EMPTY } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: string[];
  plan?: 'Free' | 'Premium' | 'Pro';
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // API endpoints - configure these based on your backend
  private readonly API_BASE = '/api/auth';
  private readonly ENDPOINTS = {
    login: `${this.API_BASE}/login`,
    register: `${this.API_BASE}/register`,
    logout: `${this.API_BASE}/logout`,
    refresh: `${this.API_BASE}/refresh`,
    profile: `${this.API_BASE}/profile`,
    forgotPassword: `${this.API_BASE}/forgot-password`,
    resetPassword: `${this.API_BASE}/reset-password`,
    verifyEmail: `${this.API_BASE}/verify-email`,
  };

  // Storage keys
  private readonly STORAGE_KEYS = {
    accessToken: 'knitcraft_access_token',
    refreshToken: 'knitcraft_refresh_token',
    user: 'knitcraft_user',
    rememberMe: 'knitcraft_remember_me',
  };

  // Angular Signals for reactive state management (Angular 16+)
  private readonly _authState = signal<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Computed signals for easy access
  public readonly authState = this._authState.asReadonly();
  public readonly user = computed(() => this._authState().user);
  public readonly isAuthenticated = computed(() => this._authState().isAuthenticated);
  public readonly isLoading = computed(() => this._authState().isLoading);
  public readonly error = computed(() => this._authState().error);

  // Token refresh timer
  private refreshTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state on service creation
   */
  private initializeAuth(): void {
    try {
      const storedUser = this.getStoredUser();
      const accessToken = this.getStoredToken();

      if (storedUser && accessToken) {
        // Validate token and get fresh user data
        this.validateAndRefreshAuth().subscribe({
          next: isValid => {
            if (!isValid) {
              this.clearAuthData();
            }
            this.updateLoadingState(false);
          },
          error: () => {
            this.clearAuthData();
            this.updateLoadingState(false);
          },
        });
      } else {
        this.updateLoadingState(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.clearAuthData();
      this.updateLoadingState(false);
    }
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginCredentials): Observable<User> {
    this.updateLoadingState(true);
    this.clearError();

    return this.http
      .post<{ user: User; tokens: AuthTokens }>(this.ENDPOINTS.login, credentials)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response.user, response.tokens, credentials.rememberMe);
        }),
        map(response => response.user),
        catchError(error => this.handleAuthError(error)),
        tap(() => this.updateLoadingState(false))
      );
  }

  /**
   * Register new user
   */
  register(data: RegisterData): Observable<User> {
    this.updateLoadingState(true);
    this.clearError();

    return this.http.post<{ user: User; tokens: AuthTokens }>(this.ENDPOINTS.register, data).pipe(
      tap(response => {
        this.handleAuthSuccess(response.user, response.tokens, false);
      }),
      map(response => response.user),
      catchError(error => this.handleAuthError(error)),
      tap(() => this.updateLoadingState(false))
    );
  }

  /**
   * Logout user
   */
  logout(): Observable<void> {
    const refreshToken = this.getStoredRefreshToken();

    // Clear local data immediately for better UX
    this.clearAuthData();

    // Call backend to invalidate tokens (fire-and-forget)
    if (refreshToken) {
      this.http.post(this.ENDPOINTS.logout, { refreshToken }).subscribe(); // Don't wait for response
    }

    this.router.navigate(['/']);
    return EMPTY;
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<AuthTokens> {
    const refreshToken = this.getStoredRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{ tokens: AuthTokens }>(this.ENDPOINTS.refresh, { refreshToken }).pipe(
      tap(response => {
        this.storeTokens(response.tokens);
        this.scheduleTokenRefresh(response.tokens.expiresIn);
      }),
      map(response => response.tokens),
      catchError(error => {
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  /**
   * Get current user profile from server
   */
  getCurrentUserProfile(): Observable<User> {
    return this.http.get<User>(this.ENDPOINTS.profile).pipe(
      tap(user => {
        this.updateUserState(user);
      }),
      catchError(error => this.handleAuthError(error))
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.ENDPOINTS.forgotPassword, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.ENDPOINTS.resetPassword, {
      token,
      password: newPassword,
    });
  }

  verifyEmail(token: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.ENDPOINTS.verifyEmail, { token });
  }

  hasRole(role: string): boolean {
    const user = this.user();
    return user?.roles?.includes(role) ?? false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.user();
    return roles.some(role => user?.roles?.includes(role)) ?? false;
  }

  hasAllRoles(roles: string[]): boolean {
    const user = this.user();
    return roles.every(role => user?.roles?.includes(role)) ?? false;
  }

  hasPremiumAccess(): boolean {
    const user = this.user();
    return user?.plan === 'Premium' || user?.plan === 'Pro';
  }

  getAccessToken(): string | null {
    return this.getStoredToken();
  }

  private validateAndRefreshAuth(): Observable<boolean> {
    const user = this.getStoredUser();
    const token = this.getStoredToken();

    if (!user || !token) {
      return throwError(() => new Error('No stored auth data'));
    }

    // First, try to get current user profile to validate token
    return this.getCurrentUserProfile().pipe(
      map(() => {
        this.updateUserState(user);
        return true;
      }),
      catchError(() => {
        // If profile fetch fails, try to refresh token
        return this.refreshToken().pipe(
          switchMap(() => this.getCurrentUserProfile()),
          map(freshUser => {
            this.updateUserState(freshUser);
            return true;
          }),
          catchError(() => {
            return throwError(() => new Error('Token refresh failed'));
          })
        );
      })
    );
  }

  private handleAuthSuccess(user: User, tokens: AuthTokens, rememberMe = false): void {
    this.storeAuthData(user, tokens, rememberMe);
    this.updateUserState(user);
    this.scheduleTokenRefresh(tokens.expiresIn);
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred during authentication';

    if (error.status === 401) {
      errorMessage = 'Invalid credentials';
    } else if (error.status === 403) {
      errorMessage = 'Account is not verified or suspended';
    } else if (error.status === 429) {
      errorMessage = 'Too many attempts. Please try again later';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    this.updateErrorState(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private storeAuthData(user: User, tokens: AuthTokens, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.STORAGE_KEYS.user, JSON.stringify(user));
    storage.setItem(this.STORAGE_KEYS.accessToken, tokens.accessToken);
    storage.setItem(this.STORAGE_KEYS.refreshToken, tokens.refreshToken);
    storage.setItem(this.STORAGE_KEYS.rememberMe, rememberMe.toString());
  }

  /**
   * Store tokens only
   */
  private storeTokens(tokens: AuthTokens): void {
    const isRemembered = this.isRememberMeEnabled();
    const storage = isRemembered ? localStorage : sessionStorage;

    storage.setItem(this.STORAGE_KEYS.accessToken, tokens.accessToken);
    storage.setItem(this.STORAGE_KEYS.refreshToken, tokens.refreshToken);
  }

  private getStoredUser(): User | null {
    try {
      const userData =
        localStorage.getItem(this.STORAGE_KEYS.user) ||
        sessionStorage.getItem(this.STORAGE_KEYS.user);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  private getStoredToken(): string | null {
    return (
      localStorage.getItem(this.STORAGE_KEYS.accessToken) ||
      sessionStorage.getItem(this.STORAGE_KEYS.accessToken)
    );
  }

  private getStoredRefreshToken(): string | null {
    return (
      localStorage.getItem(this.STORAGE_KEYS.refreshToken) ||
      sessionStorage.getItem(this.STORAGE_KEYS.refreshToken)
    );
  }

  private isRememberMeEnabled(): boolean {
    const rememberMe =
      localStorage.getItem(this.STORAGE_KEYS.rememberMe) ||
      sessionStorage.getItem(this.STORAGE_KEYS.rememberMe);
    return rememberMe === 'true';
  }

  private clearAuthData(): void {
    // Clear from both storages
    [localStorage, sessionStorage].forEach(storage => {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        storage.removeItem(key);
      });
    });

    // Clear timers
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = undefined;
    }

    // Update state
    this.updateUserState(null);
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh(expiresIn: number): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Refresh token 5 minutes before expiry
    const refreshTime = (expiresIn - 300) * 1000;

    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshToken().subscribe({
          error: () => {
            // If refresh fails, logout user
            this.logout();
          },
        });
      }, refreshTime);
    }
  }

  /**
   * Update user state across all reactive sources
   */
  private updateUserState(user: User | null): void {
    const isAuthenticated = !!user;

    // Update signals
    this._authState.update(state => ({
      ...state,
      user,
      isAuthenticated,
      error: null,
    }));
  }

  /**
   * Update loading state
   */
  private updateLoadingState(isLoading: boolean): void {
    this._authState.update(state => ({ ...state, isLoading }));
  }

  /**
   * Update error state
   */
  private updateErrorState(error: string | null): void {
    this._authState.update(state => ({ ...state, error }));
  }

  /**
   * Clear error state
   */
  private clearError(): void {
    this.updateErrorState(null);
  }
}
