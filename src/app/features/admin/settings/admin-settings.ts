import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AdminSettings as IAdminSettings } from '../../../core/models/admin.model';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.scss',
})
export class AdminSettings implements OnInit {
  private adminService = inject(AdminService);

  settings = signal<IAdminSettings | null>(null);
  isLoading = signal(true);
  isSaving = signal(false);
  saveMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchSettings();
  }

  async fetchSettings(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.adminService.getSettings();
      this.settings.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch admin settings:', err);
      this.isLoading.set(false);
    }
  }

  async saveSettings(): Promise<void> {
    if (!this.settings()) return;
    try {
      this.isSaving.set(true);
      await this.adminService.updateSettings(this.settings()!);
      this.isSaving.set(false);
      this.saveMessage.set('Settings saved successfully!');
      setTimeout(() => this.saveMessage.set(null), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      this.isSaving.set(false);
    }
  }
}
