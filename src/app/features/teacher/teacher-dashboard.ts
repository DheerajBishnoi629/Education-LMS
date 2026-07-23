import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeacherService } from '../../core/services/teacher.service';
import { AuthService } from '../../core/auth/auth.service';
import { TeacherDashboardStats, TeacherCourse } from '../../core/models/teacher.model';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.scss',
})
export class TeacherDashboard implements OnInit {
  private teacherService = inject(TeacherService);
  authService = inject(AuthService);

  stats = signal<TeacherDashboardStats | null>(null);
  recentCourses = signal<TeacherCourse[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.teacherService.getDashboardData();
      this.stats.set(res.stats);
      this.recentCourses.set(res.recentCourses);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to load teacher dashboard:', err);
      this.isLoading.set(false);
    }
  }
}
