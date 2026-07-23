import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  authService = inject(AuthService);
  router = inject(Router);

  isMobileMenuOpen = signal(false);
  isUserDropdownOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen.update((v) => !v);
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
