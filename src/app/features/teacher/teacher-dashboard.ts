import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

interface TeacherDashboardData {
  success: boolean;
  message: string;
  data: {
    role: string;
    classes: string[];
    pendingGrading: number;
  };
}

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.scss',
})
export class TeacherDashboard implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

  dashboardData = signal<TeacherDashboardData | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.http.get<TeacherDashboardData>('http://localhost:3000/api/teacher/dashboard').subscribe({
      next: (res) => {
        this.dashboardData.set(res);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load teacher dashboard.');
        throw err;
      },
    });
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
