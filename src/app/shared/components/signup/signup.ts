import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, NgClass],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  isPasswordVisible = false;
  passwordStrength = 0;
  passwordStrengthLabel = 'None';
  passwordStrengthClass = '';

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  updatePasswordStrength(password: string): void {
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
}
