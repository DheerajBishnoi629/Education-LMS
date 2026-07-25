import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AdminFinancials } from '../../../core/models/admin.model';

@Component({
  selector: 'app-financial-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financial-reports.html',
  styleUrl: './financial-reports.scss',
})
export class FinancialReports implements OnInit {
  private adminService = inject(AdminService);

  financials = signal<AdminFinancials | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    this.fetchFinancials();
  }

  async fetchFinancials(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.adminService.getFinancials();
      this.financials.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch financial reports:', err);
      this.isLoading.set(false);
    }
  }
}
