import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AuditLogItem } from '../../../core/models/admin.model';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.scss',
})
export class AuditLogs implements OnInit {
  private adminService = inject(AdminService);

  logs = signal<AuditLogItem[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.fetchLogs();
  }

  async fetchLogs(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.adminService.getAuditLogs();
      this.logs.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
      this.isLoading.set(false);
    }
  }
}
