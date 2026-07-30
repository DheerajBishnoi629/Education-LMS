import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { PermissionService } from '../../../core/services/permission.service';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.scss',
})
export class StudentLayout {
  authService = inject(AuthService);
  permissionService = inject(PermissionService);
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
