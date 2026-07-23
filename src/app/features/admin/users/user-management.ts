import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AdminUser } from '../../../core/models/admin.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement implements OnInit {
  private adminService = inject(AdminService);

  users = signal<AdminUser[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.fetchUsers();
  }

  async fetchUsers(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.adminService.getUsers();
      this.users.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
      this.isLoading.set(false);
    }
  }
}
