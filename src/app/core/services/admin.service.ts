import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { firebaseAuth } from '../firebase/firebase.config';
import { environment } from '../../../environments/environment';
import {
  AdminDashboardData,
  AdminUser,
  AdminSettings,
  ModerationCourse,
  AdminFinancials,
  SupportTicketItem,
  AuditLogItem,
} from '../models/admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const user = firebaseAuth.currentUser;
    if (!user) return new HttpHeaders();
    const token = await user.getIdToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  async getDashboardData(): Promise<AdminDashboardData> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; data: AdminDashboardData }>(
        `${environment.apiUrl}/admin/dashboard`,
        { headers }
      )
    );
    return response.data;
  }

  async getUsers(): Promise<AdminUser[]> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; users: AdminUser[] }>(
        `${environment.apiUrl}/admin/users`,
        { headers }
      )
    );
    return response.users;
  }

  async approveTeacher(userId: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    await firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/admin/users/${userId}/approve`,
        {},
        { headers }
      )
    );
  }

  async rejectTeacher(userId: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    await firstValueFrom(
      this.http.post(
        `${environment.apiUrl}/admin/users/${userId}/reject`,
        {},
        { headers }
      )
    );
  }

  async getSettings(): Promise<AdminSettings> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; settings: AdminSettings }>(
        `${environment.apiUrl}/admin/settings`,
        { headers }
      )
    );
    return response.settings;
  }

  async updateSettings(settingsData: Partial<AdminSettings>): Promise<AdminSettings> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<{ success: boolean; settings: AdminSettings }>(
        `${environment.apiUrl}/admin/settings`,
        settingsData,
        { headers }
      )
    );
    return response.settings;
  }

  async getModerationCourses(): Promise<ModerationCourse[]> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; courses: ModerationCourse[] }>(
        `${environment.apiUrl}/admin/courses`,
        { headers }
      )
    );
    return response.courses;
  }

  async getFinancials(): Promise<AdminFinancials> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; financials: AdminFinancials }>(
        `${environment.apiUrl}/admin/financials`,
        { headers }
      )
    );
    return response.financials;
  }

  async getTickets(): Promise<SupportTicketItem[]> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; tickets: SupportTicketItem[] }>(
        `${environment.apiUrl}/admin/tickets`,
        { headers }
      )
    );
    return response.tickets;
  }

  async getAuditLogs(): Promise<AuditLogItem[]> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; logs: AuditLogItem[] }>(
        `${environment.apiUrl}/admin/audit-logs`,
        { headers }
      )
    );
    return response.logs;
  }
}
