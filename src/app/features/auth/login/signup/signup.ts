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
      const res = await this.authService.signUp(this.fullName, this.email, this.password);
      this.successMessage = res.message || 'Account created successfully! Please check your Gmail inbox to verify your email address before logging in.';
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

  async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      this.errorMessage = err?.message || 'Failed to sign in with Google.';
    }
  }
}

