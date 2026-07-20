import { Component, ElementRef, ViewChildren, QueryList, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-verify',
  imports: [RouterLink],
  templateUrl: './verify.html',
  styleUrl: './verify.scss',
})
export class Verify {
  private authService = inject(AuthService);
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;
  router = inject(Router);

  verificationStatus = 'Verify';
  isVerifying = false;
  isSuccess = false;
  resendNotice = '';
  isResending = false;

  onInput(event: Event, index: number): void {
    const inputEl = event.target as HTMLInputElement;
    const value = inputEl.value;

    // Allow only numeric digits
    if (!/^[0-9]$/.test(value)) {
      inputEl.value = '';
      return;
    }

    // Auto-focus next input field
    if (value && index < this.otpInputs.length - 1) {
      const nextInput = this.otpInputs.toArray()[index + 1].nativeElement;
      nextInput.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const inputEl = event.target as HTMLInputElement;

    // Auto-focus previous input field on backspace
    if (event.key === 'Backspace' && !inputEl.value && index > 0) {
      const prevInput = this.otpInputs.toArray()[index - 1].nativeElement;
      prevInput.focus();
    }
  }

  onVerify(): void {
    const code = this.otpInputs.map(input => input.nativeElement.value).join('');
    if (code.length === 6) {
      this.isVerifying = true;
      this.verificationStatus = 'Verifying...';

      setTimeout(() => {
        this.isVerifying = false;
        this.isSuccess = true;
        this.verificationStatus = 'Success!';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      }, 1500);
    }
  }

  async resendEmail(): Promise<void> {
    this.isResending = true;
    this.resendNotice = '';
    try {
      await this.authService.resendVerificationEmail();
      this.resendNotice = 'A new verification link has been sent to your Gmail address!';
    } catch {
      this.resendNotice = 'Unable to resend email. Please check your account or try logging in.';
    } finally {
      this.isResending = false;
    }
  }
}

