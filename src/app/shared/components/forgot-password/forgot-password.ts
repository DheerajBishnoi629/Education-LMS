import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  statusMessage = 'Send Recovery Link';
  isSending = false;
  isSent = false;

  onSubmit(): void {
    this.isSending = true;
    this.statusMessage = 'Sending...';

    // Simulate sending recovery email
    setTimeout(() => {
      this.isSending = false;
      this.isSent = true;
      this.statusMessage = 'Link Sent!';
    }, 1500);
  }
}
