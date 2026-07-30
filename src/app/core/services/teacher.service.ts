import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { firebaseAuth } from '../firebase/firebase.config';
import { environment } from '../../../environments/environment';
import {
  TeacherDashboardStats,
  TeacherCourse,
  TeacherAnalyticsData,
  TeacherStudent,
  TeacherPayment,
  TeacherSubmission,
} from '../models/teacher.model';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private http = inject(HttpClient);

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const user = firebaseAuth.currentUser;
    if (!user) return new HttpHeaders();
    const token = await user.getIdToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  async getDashboardData(): Promise<{ stats: TeacherDashboardStats; recentCourses: TeacherCourse[] }> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; data: { stats: TeacherDashboardStats; recentCourses: TeacherCourse[] } }>(
        `${environment.apiUrl}/teacher/dashboard`,
        { headers }
      )
    );
    return response.data;
  }

  async getTeacherCourses(): Promise<TeacherCourse[]> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; courses: TeacherCourse[] }>(
        `${environment.apiUrl}/teacher/courses`,
        { headers }
      )
    );
    return response.courses;
  }

  async createCourse(courseData: Partial<TeacherCourse>): Promise<TeacherCourse> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<{ success: boolean; course: TeacherCourse }>(
        `${environment.apiUrl}/teacher/courses`,
        courseData,
        { headers }
      )
    );
    return response.course;
  }

  async getAnalytics(): Promise<TeacherAnalyticsData> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; analytics: TeacherAnalyticsData }>(
        `${environment.apiUrl}/teacher/analytics`,
        { headers }
      )
    );
    return response.analytics;
  }

  async getStudents(): Promise<TeacherStudent[]> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; students: TeacherStudent[] }>(
        `${environment.apiUrl}/teacher/students`,
        { headers }
      )
    );
    return response.students;
  }

  async getPayments(): Promise<TeacherPayment[]> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; payments: TeacherPayment[] }>(
        `${environment.apiUrl}/teacher/payments`,
        { headers }
      )
    );
    return response.payments;
  }

  async getTeacherAssignments(): Promise<TeacherSubmission[]> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; assignments: TeacherSubmission[] }>(
        `${environment.apiUrl}/teacher/assignments`,
        { headers }
      )
    );
    return response.assignments;
  }

  async gradeSubmission(submissionId: string, score: number): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<{ success: boolean }>(
        `${environment.apiUrl}/teacher/submissions/${submissionId}/grade`,
        { score },
        { headers }
      )
    );
    return response.success;
  }

  async respondReuploadRequest(submissionId: string, approve: boolean): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<{ success: boolean }>(
        `${environment.apiUrl}/teacher/submissions/${submissionId}/reupload-permission`,
        { approve },
        { headers }
      )
    );
    return response.success;
  }

  async createAssignment(assignmentData: { course_id: string; title: string; description: string; due_date?: string }): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<{ success: boolean }>(
        `${environment.apiUrl}/teacher/assignments`,
        assignmentData,
        { headers }
      )
    );
    return response.success;
  }
}
