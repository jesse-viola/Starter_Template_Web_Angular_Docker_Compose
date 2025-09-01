import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard to protect routes that require authentication
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return checkAuth(route, state.url, authService, router);
};

/**
 * Guard to protect child routes that require authentication
 */
export const authChildGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return checkAuth(route, state.url, authService, router);
};

/**
 * Guard to prevent authenticated users from accessing auth pages (login, register, etc.)
 */
export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};

/**
 * Guard for role-based access control
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRoles = route.data?.['requiredRoles'] as string[];
  const requireAllRoles = route.data?.['requireAllRoles'] as boolean;

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const hasAccess = requireAllRoles
    ? authService.hasAllRoles(requiredRoles)
    : authService.hasAnyRole(requiredRoles);

  if (!hasAccess) {
    router.navigate(['/unauthorized']);
  }

  return hasAccess;
};

/**
 * Guard for premium feature access
 */
export const premiumGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (!authService.hasPremiumAccess()) {
    router.navigate(['/upgrade']);
    return false;
  }

  return true;
};

/**
 * Combined guard that checks authentication, roles, and premium access
 */
export const combinedAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check authentication first
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  // Check for role-based access
  const requiredRoles = route.data?.['requiredRoles'] as string[];
  if (requiredRoles && requiredRoles.length > 0) {
    const requireAllRoles = route.data?.['requireAllRoles'] as boolean;
    const hasRequiredRole = requireAllRoles
      ? authService.hasAllRoles(requiredRoles)
      : authService.hasAnyRole(requiredRoles);

    if (!hasRequiredRole) {
      router.navigate(['/unauthorized']);
      return false;
    }
  }

  // Check for premium access
  const requiresPremium = route.data?.['requiresPremium'] as boolean;
  if (requiresPremium && !authService.hasPremiumAccess()) {
    router.navigate(['/upgrade']);
    return false;
  }

  return true;
};

/**
 * Helper function for authentication checking
 */
function checkAuth(
  route: ActivatedRouteSnapshot,
  url: string,
  authService: AuthService,
  router: Router
): boolean {
  if (authService.isAuthenticated()) {
    // Check for role-based access
    const requiredRoles = route.data?.['requiredRoles'] as string[];
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = authService.hasAnyRole(requiredRoles);
      if (!hasRequiredRole) {
        router.navigate(['/unauthorized']);
        return false;
      }
    }

    // Check for premium access
    const requiresPremium = route.data?.['requiresPremium'] as boolean;
    if (requiresPremium && !authService.hasPremiumAccess()) {
      router.navigate(['/upgrade']);
      return false;
    }

    return true;
  } else {
    // Store the attempted URL for redirecting after login
    router.navigate(['/login'], {
      queryParams: { returnUrl: url },
    });
    return false;
  }
}
