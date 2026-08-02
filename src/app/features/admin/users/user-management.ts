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
  activeTab = signal<'all' | 'pending'>('all');
  isProcessing = signal(false);

  ngOnInit(): void {
    this.fetchUsers();
  }

  get pendingTeacherRequests(): AdminUser[] {
    return this.users().filter(
      (u) => u.role === 'teacher' && (u.status === 'pending_approval' || u.status === 'pending')
    );
  }

  setTab(tab: 'all' | 'pending'): void {
    this.activeTab.set(tab);
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

  async approveTeacher(user: AdminUser): Promise<void> {
    try {
      this.isProcessing.set(true);
      await this.adminService.approveTeacher(user.id);
      await this.fetchUsers();
    } catch (err) {
      console.error('Failed to approve teacher:', err);
    } finally {
      this.isProcessing.set(false);
    }
  }

  async rejectTeacher(user: AdminUser): Promise<void> {
    try {
      this.isProcessing.set(true);
      await this.adminService.rejectTeacher(user.id);
      await this.fetchUsers();
    } catch (err) {
      console.error('Failed to reject teacher:', err);
    } finally {
      this.isProcessing.set(false);
    }
  }
}

