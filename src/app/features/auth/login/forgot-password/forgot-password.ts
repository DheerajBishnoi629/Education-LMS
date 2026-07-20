import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private authService = inject(AuthService);

  email = '';
  statusMessage = 'Send Recovery Link';
  isSending = false;
  isSent = false;
  errorMessage = '';

  async onSubmit(): Promise<void> {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    this.isSending = true;
    this.statusMessage = 'Sending...';
    this.errorMessage = '';

    try {
      await this.authService.sendPasswordReset(this.email);
      this.isSent = true;
      this.statusMessage = 'Link Sent!';
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/user-not-found') {
        this.errorMessage = 'No user account found with this email address.';
      } else if (err?.code === 'auth/invalid-email') {
        this.errorMessage = 'Please enter a valid email address.';
      } else {
        this.errorMessage = err?.message || 'Failed to send password reset email. Please try again.';
      }
      this.statusMessage = 'Send Recovery Link';
    } finally {
      this.isSending = false;
    }
  }
}

