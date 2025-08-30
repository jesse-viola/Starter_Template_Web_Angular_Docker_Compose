import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SearchBar, SearchSuggestion } from '../search-bar/search-bar';

@Component({
  selector: 'app-mobile-search',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, SearchBar],
  template: `
    <div class="mobile-search-sheet">
      <div class="search-sheet-header">
        <h3>Search</h3>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="search-sheet-content">
        <app-search-bar
          placeholder="Search patterns, yarns, and more..."
          appearance="outline"
          [debounceMs]="300"
          [showButton]="false"
          [suggestions]="data.suggestions"
          [enableSuggestions]="true"
          (searchChange)="onSearchChange($event)"
          (searchSubmit)="onSearchSubmit($event)"
          (suggestionSelected)="onSuggestionSelected($event)"
          class="mobile-search-input"
        >
        </app-search-bar>
      </div>
    </div>
  `,
  styles: [
    `
      .mobile-search-sheet {
        padding: 16px;
        min-height: 200px;
      }

      .search-sheet-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--mat-text-primary, #333);
        }
      }

      .search-sheet-content {
        .mobile-search-input {
          width: 100%;
        }
      }
    `,
  ],
})
export class MobileSearchSheet {
  private bottomSheetRef = inject(MatBottomSheetRef<MobileSearchSheet>);
  public data = inject(MAT_BOTTOM_SHEET_DATA) as { suggestions: SearchSuggestion[] };

  close() {
    this.bottomSheetRef.dismiss();
  }

  onSearchChange() {
    // Handle search change
  }

  onSearchSubmit(searchTerm: string) {
    // Handle search submit
    this.bottomSheetRef.dismiss({ searchTerm });
  }

  onSuggestionSelected(suggestion: SearchSuggestion) {
    // Handle suggestion selection
    this.bottomSheetRef.dismiss({ suggestion });
  }
}
