import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { HomepageComponent } from './app/features/home/homepage/homepage.component';
import { FavoritesComponent } from './app/features/favorites/favorites.component';

const routes = [
  { path: '', component: HomepageComponent },
  { path: 'favorites', component: FavoritesComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes), // Add your routes here
  ],
}).catch(err => console.error(err));
