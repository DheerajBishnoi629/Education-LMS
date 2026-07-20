import { Component, ElementRef, ViewChildren, QueryList, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  imports: [RouterLink],
  templateUrl: './verify.html',
  styleUrl: './verify.scss',
})
export class Verify {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;
  router = inject(Router);
  verificationStatus = 'Verify';
  isVerifying = false;
  isSuccess = false;

  

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

      // Simulate a small delay for verification success animation
      setTimeout(() => {
        this.isVerifying = false;
        this.isSuccess = true;
        this.verificationStatus = 'Success!';

        // Redirect to homepage after 1 second
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      }, 1500);
    }
  }
}
