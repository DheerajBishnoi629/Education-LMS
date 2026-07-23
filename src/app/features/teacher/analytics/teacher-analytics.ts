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
import { TeacherService } from '../../../core/services/teacher.service';
import { TeacherAnalyticsData } from '../../../core/models/teacher.model';

declare const Chart: any;

@Component({
  selector: 'app-teacher-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-analytics.html',
  styleUrl: './teacher-analytics.scss',
})
export class TeacherAnalytics implements OnInit, AfterViewInit {
  private teacherService = inject(TeacherService);

  analytics = signal<TeacherAnalyticsData | null>(null);
  isLoading = signal(true);

  @ViewChild('salesChartCanvas') salesChartCanvas!: ElementRef<HTMLCanvasElement>;
  private salesChartInstance: any;

  ngOnInit(): void {
    this.fetchAnalytics();
  }

  ngAfterViewInit(): void {
    if (this.analytics()) {
      this.initChart();
    }
  }

  async fetchAnalytics(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.teacherService.getAnalytics();
      this.analytics.set(res);
      this.isLoading.set(false);

      setTimeout(() => {
        this.initChart();
      }, 100);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      this.isLoading.set(false);
    }
  }

  private initChart(): void {
    const data = this.analytics();
    if (!data || !this.salesChartCanvas?.nativeElement) return;
    if (typeof Chart === 'undefined') return;

    if (this.salesChartInstance) this.salesChartInstance.destroy();

    const ctx = this.salesChartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.salesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.dailySalesChart.labels,
          datasets: [
            {
              label: 'Daily Revenue ($)',
              data: data.dailySalesChart.data,
              backgroundColor: '#3525cd',
              borderRadius: 6,
              hoverBackgroundColor: '#4f46e5',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
            y: { grid: { color: 'rgba(199, 196, 216, 0.3)' }, ticks: { font: { family: 'Inter', size: 11 } } },
          },
        },
      });
    }
  }
}
