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
      if (res.pendingApproval) {
        this.warningMessage = res.message || 'Your teacher registration is currently pending administrator approval. An admin will review and approve your account soon.';
      } else if (res.isRejected) {
        this.errorMessage = res.message || 'Your teacher account request was declined by an administrator.';
      } else if (!res.emailVerified) {
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

  showGooglePasswordModal = false;
  googleFirebaseUser: any = null;
  newGooglePassword = '';
  confirmGooglePassword = '';
  isSettingPassword = false;
  googlePasswordError = '';
  isGooglePasswordVisible = false;
  isGoogleConfirmPasswordVisible = false;

  toggleGooglePasswordVisibility(): void {
    this.isGooglePasswordVisible = !this.isGooglePasswordVisible;
  }

  toggleGoogleConfirmPasswordVisibility(): void {
    this.isGoogleConfirmPasswordVisible = !this.isGoogleConfirmPasswordVisible;
  }

  async loginWithGoogle(): Promise<void> {
    try {
      this.errorMessage = '';
      const res = await this.authService.loginWithGoogle();
      if (res.requiresPasswordCreation && res.firebaseUser) {
        this.googleFirebaseUser = res.firebaseUser;
        this.showGooglePasswordModal = true;
      }
    } catch (error: any) {
      console.error(error);
      this.errorMessage = error?.message || 'Failed to sign in with Google.';
    }
  }

  async onSubmitGooglePassword(): Promise<void> {
    if (!this.newGooglePassword || !this.confirmGooglePassword) {
      this.googlePasswordError = 'Please enter and confirm your password.';
      return;
    }

    if (this.newGooglePassword.length < 6) {
      this.googlePasswordError = 'Password must be at least 6 characters long.';
      return;
    }

    if (this.newGooglePassword !== this.confirmGooglePassword) {
      this.googlePasswordError = 'Passwords do not match.';
      return;
    }

    try {
      this.isSettingPassword = true;
      this.googlePasswordError = '';
      await this.authService.setPasswordForGoogleUser(this.googleFirebaseUser, this.newGooglePassword);
      this.showGooglePasswordModal = false;
    } catch (err: any) {
      console.error(err);
      this.googlePasswordError = err?.message || 'Failed to set password. Please try again.';
    } finally {
      this.isSettingPassword = false;
    }
  }

  async skipGooglePassword(): Promise<void> {
    if (!this.googleFirebaseUser) return;
    try {
      this.isSettingPassword = true;
      const token = await this.googleFirebaseUser.getIdToken();
      const syncRes = await this.authService.syncWithBackend(token, this.googleFirebaseUser.displayName || undefined);
      if (!syncRes.pendingApproval && !syncRes.isRejected) {
        this.authService.currentUser.set(syncRes.user);
        this.showGooglePasswordModal = false;
        this.authService.isGoogleAuthInProgress = false;
        this.authService.redirectBasedOnRole(syncRes.user.role);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      this.isSettingPassword = false;
      this.authService.isGoogleAuthInProgress = false;
    }
  }
}


