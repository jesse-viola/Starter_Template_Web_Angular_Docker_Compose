import { Component, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-login-button',
  standalone: true,
  imports: [CustomButtonComponent],
  templateUrl: './login-button.html',
  styleUrl: './login-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginButton {
  private dialog = inject(MatDialog);

  readonly isLoading = input(false);
  readonly disabled = input(false);
  readonly fullWidth = input(false);

  // TODO: Define proper type for login result
  loginResult = output<{ provider: string; success: boolean; data?: unknown }>();

  handleLogin(): void {
    console.log('Login button clicked!');
    if (!this.isLoading() && !this.disabled()) {
      console.log('Opening login modal...');
      this.openLoginModal();
    } else {
      console.log('Login button disabled or loading:', {
        loading: this.isLoading(),
        disabled: this.disabled(),
      });
    }
  }

  private openLoginModal(): void {
    const dialogRef = this.dialog.open(LoginModalComponent, {
      panelClass: 'login-modal-panel',
      autoFocus: true,
      restoreFocus: true,
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'login-modal-backdrop',
      width: 'auto',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.loginResult.emit(result);
      } else if (result && result.action === 'signup') {
        // Handle signup redirect
        console.log('User wants to sign up');
      }
    });
  }
}
