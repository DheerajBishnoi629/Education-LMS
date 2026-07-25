import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../core/services/teacher.service';
import { TeacherPayment } from '../../../core/models/teacher.model';

@Component({
  selector: 'app-teacher-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-payments.html',
  styleUrl: './teacher-payments.scss',
})
export class TeacherPayments implements OnInit {
  private teacherService = inject(TeacherService);

  payments = signal<TeacherPayment[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.fetchPayments();
  }

  async fetchPayments(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.teacherService.getPayments();
      this.payments.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch teacher payments:', err);
      this.isLoading.set(false);
    }
  }
}
