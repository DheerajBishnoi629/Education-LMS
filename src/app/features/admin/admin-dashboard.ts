import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

interface AdminDashboardData {
  success: boolean;
  message: string;
  data: {
    role: string;
    systemStatus: string;
    totalUsers: number;
  };
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

  dashboardData = signal<AdminDashboardData | null>(null);
  errorMessage = signal<string | null>(null);

  targetIdentifier = signal('');
  promotionSuccessMessage = signal<string | null>(null);
  promotionErrorMessage = signal<string | null>(null);
  isSubmitting = signal(false);

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.http.get<AdminDashboardData>('http://localhost:3000/api/admin/dashboard').subscribe({
      next: (res) => {
        this.dashboardData.set(res);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load admin dashboard.');
        throw err;
      },
    });
  }

  promoteToTeacher(): void {
    const identifier = this.targetIdentifier().trim();
    if (!identifier) {
      this.promotionErrorMessage.set('Please enter a User ID or Firebase UID.');
      return;
    }

    this.isSubmitting.set(true);
    this.promotionSuccessMessage.set(null);
    this.promotionErrorMessage.set(null);

    const body = {
      targetFirebaseUid: identifier,
      newRole: 'teacher',
    };

    this.http.put<{ success: boolean; message: string }>('http://localhost:3000/api/admin/change-role', body).subscribe({
      next: (res) => {
        this.promotionSuccessMessage.set(res.message || 'User promoted to teacher successfully!');
        this.targetIdentifier.set('');
        this.isSubmitting.set(false);
        this.fetchDashboardData();
      },
      error: (err) => {
        const msg = err.error?.message || 'Failed to promote user.';
        this.promotionErrorMessage.set(msg);
        this.isSubmitting.set(false);
      },
    });
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
