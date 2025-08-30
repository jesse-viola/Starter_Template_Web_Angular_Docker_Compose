// 🎯 MODERNIZED ANGULAR COMPONENT: Following Angular v17+ Best Practices
// This component demonstrates modern Angular concepts:
// 1. Signal-based inputs/outputs instead of decorators
// 2. viewChild signals instead of @ViewChild
// 3. computed signals for derived state
// 4. OnPush change detection for performance
// 5. Signal-based reactive forms
// 6. Modern lifecycle hooks with effect()

import {
  Component,
  ElementRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  input,
  output,
  viewChild,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule, MatAutocomplete } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

export interface SearchSuggestion {
  id: string;
  text: string;
  category?: 'recent' | 'product' | 'user' | 'pattern';
  icon?: string;
  url?: string;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, // Basic Angular directives (@if, @for)
    ReactiveFormsModule, // For FormControl and reactive forms
    MatFormFieldModule, // Material form field wrapper
    MatInputModule, // Material input styling
    MatIconModule, // Material icons
    MatButtonModule, // Material button styling
    MatAutocompleteModule, // Material autocomplete for suggestions
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  // 🔽 SIGNAL-BASED VIEWCHILD: Modern way to get element references
  readonly inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
  readonly autoComplete = viewChild.required<MatAutocomplete>('auto');

  // 🔽 SIGNAL-BASED INPUTS: Data flows DOWN from parent to child
  readonly placeholder = input<string>('Search...'); // Customizable placeholder text
  readonly debounceMs = input<number>(300); // Delay before emitting search
  readonly appearance = input<'fill' | 'outline'>('outline'); // Material form field style
  readonly showButton = input<boolean>(true); // Whether to show the search button
  readonly suggestions = input<SearchSuggestion[]>([]); // Autocomplete suggestions
  readonly enableSuggestions = input<boolean>(true); // Enable/disable suggestions
  readonly maxLength = input<number>(15); // Maximum input length

  // 🔼 SIGNAL-BASED OUTPUTS: Events flow UP from child to parent
  readonly searchChange = output<string>(); // Emits on every change (debounced)
  readonly searchSubmit = output<string>(); // Emits when user submits
  readonly searchFocus = output<void>();
  readonly mouseEntered = output<void>();
  readonly mouseLeft = output<void>();
  readonly suggestionSelected = output<SearchSuggestion>();

  // 📊 COMPONENT STATE SIGNALS
  private readonly isHovered = signal(false);
  private readonly isFocused = signal(false);
  private readonly isTyping = signal(false);
  private readonly recentSearches = signal<SearchSuggestion[]>([]);

  // 🎛️ REACTIVE FORM CONTROL: Angular's way to handle form input
  readonly searchControl = new FormControl('');

  // 🔄 SIGNAL FROM OBSERVABLE: Convert form control value to signal
  readonly searchValue = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(value => value || ''),
      startWith('')
    ),
    { initialValue: '' }
  );

  // 🔍 COMPUTED FILTERED SUGGESTIONS: Reactive filtering based on input
  readonly filteredSuggestions = computed(() => {
    if (!this.enableSuggestions()) {
      return [];
    }

    const value = this.searchValue();

    // If no input, show recent searches
    if (!value.trim()) {
      return this.recentSearches();
    }

    const filterValue = value.toLowerCase();
    const filteredSuggestions = this.suggestions().filter(suggestion =>
      suggestion.text.toLowerCase().includes(filterValue)
    );

    // Combine recent searches that match with regular suggestions
    const matchingRecent = this.recentSearches().filter(recent =>
      recent.text.toLowerCase().includes(filterValue)
    );

    // Remove duplicates and prioritize recent searches
    const combined = [...matchingRecent, ...filteredSuggestions];
    const unique = combined.filter(
      (item, index, arr) => arr.findIndex(i => i.text === item.text) === index
    );

    return unique.slice(0, 8); // Limit to 8 suggestions
  });

  // 🧮 COMPUTED DERIVED STATE
  readonly isSearchEmpty = computed(() => !this.searchValue().trim());

  readonly currentValue = computed(() => this.searchControl.value || '');

  readonly canSubmit = computed(() => this.searchValue().trim().length > 0);

  // 🔧 CONSTANTS
  private readonly TYPE_TIMEOUT_MS = 1000;
  private readonly RECENT_SEARCHES_KEY = 'search-recent';
  private readonly MAX_RECENT_SEARCHES = 5;

  constructor() {
    // 🌊 REACTIVE EFFECT: Listen to search value changes and emit to parent
    effect(() => {
      const value = this.searchValue();
      this.searchChange.emit(value);
    });

    // 📝 LOAD RECENT SEARCHES ON INIT
    effect(
      () => {
        this.loadRecentSearches();
      },
      { allowSignalWrites: true }
    );
  }

  // 🧹 UTILITY METHOD: Clear the search and notify parent
  clearSearch(): void {
    this.searchControl.setValue('');
    this.searchChange.emit('');
  }

  onMouseEnter(): void {
    this.isHovered.set(true);
    this.inputRef().nativeElement.focus();
    this.mouseEntered.emit();
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
    this.mouseLeft.emit();
  }

  onFocus(): void {
    this.isFocused.set(true);
    this.searchFocus.emit();
  }

  onBlur(): void {
    this.isFocused.set(false);
  }

  onInput(): void {
    this.isTyping.set(true);
    // Reset typing state after timeout
    setTimeout(() => {
      this.isTyping.set(false);
    }, this.TYPE_TIMEOUT_MS);
  }

  // 🎯 SUGGESTION SELECTION: Handle when user selects a suggestion
  onSuggestionSelected(suggestion: SearchSuggestion): void {
    this.searchControl.setValue(suggestion.text);
    this.addToRecentSearches(suggestion.text);
    this.suggestionSelected.emit(suggestion);
    this.searchSubmit.emit(suggestion.text);
  }

  onSubmit(): void {
    const searchValue = this.currentValue();
    if (searchValue.trim()) {
      this.addToRecentSearches(searchValue);
      this.searchSubmit.emit(searchValue);
    }
  }

  // 📝 RECENT SEARCHES MANAGEMENT
  private loadRecentSearches(): void {
    try {
      const recent = localStorage.getItem(this.RECENT_SEARCHES_KEY);
      if (recent) {
        const searches = JSON.parse(recent) as string[];
        const recentSuggestions = searches.map((text, index) => ({
          id: `recent-${index}`,
          text,
          category: 'recent' as const,
          icon: 'history',
        }));
        this.recentSearches.set(recentSuggestions);
      }
    } catch (error) {
      console.warn('Error loading recent searches:', error);
      this.recentSearches.set([]);
    }
  }

  private addToRecentSearches(searchTerm: string): void {
    try {
      const current = this.recentSearches().map(s => s.text);
      const updated = [searchTerm, ...current.filter(term => term !== searchTerm)].slice(
        0,
        this.MAX_RECENT_SEARCHES
      );

      localStorage.setItem(this.RECENT_SEARCHES_KEY, JSON.stringify(updated));

      // Update signal with new recent searches
      const recentSuggestions = updated.map((text, index) => ({
        id: `recent-${index}`,
        text,
        category: 'recent' as const,
        icon: 'history',
      }));
      this.recentSearches.set(recentSuggestions);
    } catch (error) {
      console.warn('Error saving recent search:', error);
    }
  }

  // 🔧 UTILITY METHODS
  getCurrentValue(): string {
    return this.currentValue();
  }

  isSearchEmptyValue(): boolean {
    return this.isSearchEmpty();
  }

  clearRecentSearches(): void {
    try {
      localStorage.removeItem(this.RECENT_SEARCHES_KEY);
      this.recentSearches.set([]);
    } catch (error) {
      console.warn('Error clearing recent searches:', error);
    }
  }

  // 🎯 GETTERS FOR TEMPLATE ACCESS TO SIGNALS
  get showButtonValue(): boolean {
    return this.showButton();
  }

  get placeholderValue(): string {
    return this.placeholder();
  }

  get appearanceValue(): 'fill' | 'outline' {
    return this.appearance();
  }

  get enableSuggestionsValue(): boolean {
    return this.enableSuggestions();
  }

  get maxLengthValue(): number {
    return this.maxLength();
  }

  get filteredSuggestionsValue(): SearchSuggestion[] {
    return this.filteredSuggestions();
  }

  get canSubmitValue(): boolean {
    return this.canSubmit();
  }
}
