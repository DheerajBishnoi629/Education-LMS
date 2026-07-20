import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

interface StudentDashboardData {
  success: boolean;
  message: string;
  data: {
    role: string;
    courses: string[];
  };
}

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboard implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

  dashboardData = signal<StudentDashboardData | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.http.get<StudentDashboardData>('http://localhost:3000/api/student/dashboard').subscribe({
      next: (res) => {
        this.dashboardData.set(res);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load student dashboard.');
        throw err;
      },
    });
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
