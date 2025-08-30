import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { RouterLink } from '@angular/router';
import { SearchBar, SearchSuggestion } from '../search-bar/search-bar';
import { LoginButton } from '../login-button/login-button';
import { MobileMenu } from '../mobile-menu/mobile-menu';
import { MobileSearchSheet } from '../mobile-search/mobile-search';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    RouterLink,
    SearchBar,
    LoginButton,
    MobileMenu,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private bottomSheet = inject(MatBottomSheet);

  // 🔍 SAMPLE SUGGESTIONS: Mock data for demonstration
  searchSuggestions: SearchSuggestion[] = [
    {
      id: '1',
      text: 'Cable knit sweater pattern',
      category: 'pattern',
      icon: 'description',
    },
    {
      id: '2',
      text: 'Merino wool yarn',
      category: 'product',
      icon: 'shopping_cart',
    },
    {
      id: '3',
      text: 'Circular knitting needles',
      category: 'product',
      icon: 'build',
    },
    {
      id: '4',
      text: 'Beginner scarf tutorial',
      category: 'pattern',
      icon: 'school',
    },
    {
      id: '5',
      text: 'Alpaca blend yarn',
      category: 'product',
      icon: 'shopping_cart',
    },
    {
      id: '6',
      text: 'Fair isle techniques',
      category: 'pattern',
      icon: 'palette',
    },
    {
      id: '7',
      text: 'Baby blanket patterns',
      category: 'pattern',
      icon: 'child_friendly',
    },
    {
      id: '8',
      text: 'Cotton yarn for summer',
      category: 'product',
      icon: 'wb_sunny',
    },
  ];

  // todo add the auth service
  public isLoggedIn = false;
  public isMobileMenuOpen = false;

  onSearchChange(searchTerm: string) {
    console.log('Search changed:', searchTerm);
    // Implement your search logic here
  }

  onSearchSubmit(searchTerm: string) {
    console.log('Search submitted:', searchTerm);
    // Implement your search submission logic here
  }

  onSearchFocus() {
    // console.log('Search focused');
  }

  onMouseEntered() {
    // console.log('Mouse entered search');
  }

  onMouseLeft() {
    // console.log('Mouse left search');
  }

  onSuggestionSelected(suggestion: SearchSuggestion) {
    console.log('Suggestion selected:', suggestion);
    // Handle suggestion selection - navigate, filter, etc.
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleSearch() {
    this.bottomSheet.open(MobileSearchSheet, {
      data: { suggestions: this.searchSuggestions },
      panelClass: 'mobile-search-bottom-sheet',
    });
  }

  // TODO: Define proper type for login result
  handleLogin(result: { provider: string; success: boolean; data?: unknown }) {
    console.log('Login successful:', result);

    if (result.success) {
      // Update login state
      this.isLoggedIn = true;

      // Here you would typically call your auth service
      // this.authService.setUser(result.data);
      // this.router.navigate(['/dashboard']);
    }
  }
}
