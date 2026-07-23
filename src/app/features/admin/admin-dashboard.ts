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
import { AdminService } from '../../core/services/admin.service';
import { AdminDashboardData } from '../../core/models/admin.model';

declare const Chart: any;

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit, AfterViewInit {
  private adminService = inject(AdminService);

  dashboardData = signal<AdminDashboardData | null>(null);
  isLoading = signal(true);

  @ViewChild('userChartCanvas') userChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChartCanvas') revenueChartCanvas!: ElementRef<HTMLCanvasElement>;

  private userChartInstance: any;
  private revenueChartInstance: any;

  ngOnInit(): void {
    this.fetchData();
  }

  ngAfterViewInit(): void {
    if (this.dashboardData()) {
      this.initCharts();
    }
  }

  async fetchData(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.adminService.getDashboardData();
      this.dashboardData.set(res);
      this.isLoading.set(false);

      setTimeout(() => {
        this.initCharts();
      }, 100);
    } catch (err) {
      console.error('Failed to fetch admin dashboard:', err);
      this.isLoading.set(false);
    }
  }

  private initCharts(): void {
    const data = this.dashboardData();
    if (!data || typeof Chart === 'undefined') return;

    // 1. Line Chart: MAU vs DAU
    if (this.userChartCanvas?.nativeElement) {
      if (this.userChartInstance) this.userChartInstance.destroy();

      const ctxUser = this.userChartCanvas.nativeElement.getContext('2d');
      if (ctxUser) {
        const gradientMAU = ctxUser.createLinearGradient(0, 0, 0, 300);
        gradientMAU.addColorStop(0, 'rgba(53, 37, 205, 0.2)');
        gradientMAU.addColorStop(1, 'rgba(53, 37, 205, 0.0)');

        this.userChartInstance = new Chart(ctxUser, {
          type: 'line',
          data: {
            labels: data.userChart.labels,
            datasets: [
              {
                label: 'Monthly Active Users (MAU)',
                data: data.userChart.mau,
                borderColor: '#3525cd',
                backgroundColor: gradientMAU,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
              },
              {
                label: 'Daily Active Users (DAU)',
                data: data.userChart.dau,
                borderColor: '#4b4dd8',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
              y: {
                grid: { color: 'rgba(199, 196, 216, 0.3)' },
                ticks: {
                  font: { family: 'Inter', size: 11 },
                  callback: (val: number) => val / 1000 + 'k',
                },
              },
            },
          },
        });
      }
    }

    // 2. Doughnut Chart: Revenue by Category
    if (this.revenueChartCanvas?.nativeElement) {
      if (this.revenueChartInstance) this.revenueChartInstance.destroy();

      const ctxRev = this.revenueChartCanvas.nativeElement.getContext('2d');
      if (ctxRev) {
        this.revenueChartInstance = new Chart(ctxRev, {
          type: 'doughnut',
          data: {
            labels: data.revenueChart.labels,
            datasets: [
              {
                data: data.revenueChart.percentages,
                backgroundColor: ['#3525cd', '#4b4dd8', '#dae2fd'],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: { legend: { display: false } },
          },
        });
      }
    }
  }
}
