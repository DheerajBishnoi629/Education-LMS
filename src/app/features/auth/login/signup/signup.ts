import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, NgClass, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private authService = inject(AuthService);

  fullName = '';
  email = '';
  password = '';

  selectedRole: 'student' | 'teacher' = 'student';

  isPasswordVisible = false;
  passwordStrength = 0;
  passwordStrengthLabel = 'None';
  passwordStrengthClass = '';

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  setRole(role: 'student' | 'teacher'): void {
    this.selectedRole = role;
  }

  updatePasswordStrength(password: string): void {
    this.password = password;
    if (!password) {
      this.passwordStrength = 0;
      this.passwordStrengthLabel = 'None';
      this.passwordStrengthClass = '';
      return;
    }

    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[a-z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    this.passwordStrength = score;

    if (score < 40) {
      this.passwordStrengthLabel = 'Weak';
      this.passwordStrengthClass = 'weak';
    } else if (score < 75) {
      this.passwordStrengthLabel = 'Medium';
      this.passwordStrengthClass = 'medium';
    } else {
      this.passwordStrengthLabel = 'Strong';
      this.passwordStrengthClass = 'strong';
    }
  }

  async onSignUp(): Promise<void> {
    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Please fill out all fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const res = await this.authService.signUp(this.fullName, this.email, this.password, this.selectedRole);
      this.successMessage = res.message || 'Account created successfully!';
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/email-already-in-use') {
        this.errorMessage = 'This email is already registered. Please log in instead.';
      } else if (err?.code === 'auth/weak-password') {
        this.errorMessage = 'Password should be at least 6 characters long.';
      } else if (err?.code === 'auth/invalid-email') {
        this.errorMessage = 'Please provide a valid email address.';
      } else {
        this.errorMessage = err?.message || 'An error occurred during registration. Please try again.';
      }
    } finally {
      this.isLoading = false;
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
    } catch (err: any) {
      console.error(err);
      this.errorMessage = err?.message || 'Failed to sign in with Google.';
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


