import {
  Component,
  OnInit,
  AfterViewInit,
  inject,
  signal,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../core/services/student.service';
import { AuthService } from '../../core/auth/auth.service';
import { StudentDashboardData } from '../../core/models/student.model';

declare const Chart: any;

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss',
})
export class StudentDashboard implements OnInit, AfterViewInit {
  private studentService = inject(StudentService);
  authService = inject(AuthService);

  dashboardData = signal<StudentDashboardData | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  @ViewChild('goalChartCanvas') goalChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('activityChartCanvas') activityChartCanvas!: ElementRef<HTMLCanvasElement>;

  private goalChartInstance: any;
  private activityChartInstance: any;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    if (this.dashboardData()) {
      this.initCharts();
    }
  }

  async loadDashboardData(): Promise<void> {
    try {
      this.isLoading.set(true);
      const data = await this.studentService.getDashboardData();
      this.dashboardData.set(data);
      this.isLoading.set(false);

      setTimeout(() => {
        this.initCharts();
      }, 100);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      this.errorMessage.set('Failed to load student dashboard.');
      this.isLoading.set(false);
    }
  }

  private initCharts(): void {
    const data = this.dashboardData();
    if (!data) return;

    if (typeof Chart === 'undefined') return;

    // 1. Goal Chart (Donut)
    if (this.goalChartCanvas?.nativeElement) {
      if (this.goalChartInstance) this.goalChartInstance.destroy();
      const ctx = this.goalChartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.goalChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            datasets: [
              {
                data: [
                  data.weeklyGoal.completedHours,
                  Math.max(0, data.weeklyGoal.targetHours - data.weeklyGoal.completedHours),
                ],
                backgroundColor: ['#4f46e5', '#E2E8F0'],
                borderWidth: 0,
                cutout: '80%',
                borderRadius: [5, 0],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { tooltip: { enabled: false }, legend: { display: false } },
            animation: { animateScale: true, animateRotate: true },
          },
        });
      }
    }

    // 2. Activity Chart (Line)
    if (this.activityChartCanvas?.nativeElement) {
      if (this.activityChartInstance) this.activityChartInstance.destroy();
      const ctx = this.activityChartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.activityChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.activityChart.labels,
            datasets: [
              {
                label: 'Hours Spent',
                data: data.activityChart.data,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#4f46e5',
                pointRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 10 } } },
              y: { display: false, min: 0 },
            },
          },
        });
      }
    }
  }
}
