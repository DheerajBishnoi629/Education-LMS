import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);

  email = '';
  password = '';
  isPasswordVisible = false;

  isLoading = false;
  errorMessage = '';
  warningMessage = '';
  isUnverified = false;
  resendMessage = '';
  isResending = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async onLogin(): Promise<void> {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.warningMessage = '';
    this.resendMessage = '';
    this.isUnverified = false;

    try {
      const res = await this.authService.login(this.email, this.password);
      if (!res.emailVerified) {
        this.isUnverified = true;
        this.warningMessage = res.message || 'Your email is not verified yet. Please check your inbox.';
      } else if (res.user) {
        this.authService.redirectBasedOnRole(res.user.role);
      }
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password') {
        this.errorMessage = 'Invalid email or password. Please try again.';
      } else if (err?.code === 'auth/too-many-requests') {
        this.errorMessage = 'Too many failed login attempts. Please try again later.';
      } else {
        this.errorMessage = err?.message || 'Failed to sign in. Please try again.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  async resendVerification(): Promise<void> {
    this.isResending = true;
    this.resendMessage = '';
    try {
      await this.authService.resendVerificationEmail();
      this.resendMessage = 'Verification email sent! Please check your Gmail inbox.';
    } catch (err: any) {
      console.error(err);
      this.resendMessage = 'Unable to resend email. Please try signing up again or check credentials.';
    } finally {
      this.isResending = false;
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.loginWithGoogle();
    } catch (error: any) {
      console.error(error);
      this.errorMessage = error?.message || 'Failed to sign in with Google.';
    }
  }
}

