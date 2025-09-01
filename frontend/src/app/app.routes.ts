import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () =>
      import('./features/home/homepage/homepage.component').then(m => m.HomepageComponent),
    title: 'Home',
  },

  // Protected routes
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites.component').then(m => m.FavoritesComponent),
    canActivate: [authGuard],
    title: 'My Favorites',
  },

  // Placeholder routes for future implementation
  // These will show a "Coming Soon" message until components are created
  {
    path: 'login',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'register',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    redirectTo: '',
    pathMatch: 'prefix',
  },
  {
    path: 'premium',
    redirectTo: '',
    pathMatch: 'prefix',
  },
  {
    path: 'unauthorized',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'upgrade',
    redirectTo: '',
    pathMatch: 'full',
  },

  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
