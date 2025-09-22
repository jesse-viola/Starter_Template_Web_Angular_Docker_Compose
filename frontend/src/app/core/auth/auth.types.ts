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

export interface LoginRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
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
