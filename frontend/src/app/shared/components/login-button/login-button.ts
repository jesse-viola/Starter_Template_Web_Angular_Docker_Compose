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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginButton {
  private dialog = inject(MatDialog);
  
  readonly isLoading = input(false);
  readonly disabled = input(false);
  readonly fullWidth = input(false);
  
  onLogin = output<{ provider: string; success: boolean; data?: any }>();

  handleLogin(): void {
    if (!this.isLoading() && !this.disabled()) {
      this.openLoginModal();
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
      position: {
        top: '0',
        left: '0'
      },
      width: '100vw',
      height: '100vh',
      maxWidth: 'none',
      maxHeight: 'none'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.onLogin.emit(result);
      } else if (result && result.action === 'signup') {
        // Handle signup redirect
        console.log('User wants to sign up');
      }
    });
  }
}
