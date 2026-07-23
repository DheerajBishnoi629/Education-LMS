import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { SupportTicketItem } from '../../../core/models/admin.model';

@Component({
  selector: 'app-support-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './support-tickets.html',
  styleUrl: './support-tickets.scss',
})
export class SupportTickets implements OnInit {
  private adminService = inject(AdminService);

  tickets = signal<SupportTicketItem[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.fetchTickets();
  }

  async fetchTickets(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.adminService.getTickets();
      this.tickets.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch support tickets:', err);
      this.isLoading.set(false);
    }
  }

  resolveTicket(ticketId: string): void {
    this.tickets.update((list) =>
      list.map((t) => (t.id === ticketId ? { ...t, status: 'Resolved' } : t))
    );
  }
}
