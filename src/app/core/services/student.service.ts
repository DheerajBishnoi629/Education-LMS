import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { firebaseAuth } from '../firebase/firebase.config';
import { environment } from '../../../environments/environment';
import {
  StudentDashboardData,
  Course,
  Enrollment,
  Assignment,
  Quiz,
  Certificate,
} from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const user = firebaseAuth.currentUser;
    if (!user) return new HttpHeaders();
    const token = await user.getIdToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  async getDashboardData(): Promise<StudentDashboardData> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; data: StudentDashboardData }>(
        `${environment.apiUrl}/student/dashboard`,
        { headers }
      )
    );
    return response.data;
  }

  async getBrowseCourses(params?: {
    search?: string;
    category?: string;
    level?: string;
    sort?: string;
  }): Promise<Course[]> {
    let queryStr = '';
    if (params) {
      const qp = new URLSearchParams();
      if (params.search) qp.set('search', params.search);
      if (params.category) qp.set('category', params.category);
      if (params.level) qp.set('level', params.level);
      if (params.sort) qp.set('sort', params.sort);
      queryStr = `?${qp.toString()}`;
    }

    const response = await firstValueFrom(
      this.http.get<{ success: boolean; courses: Course[] }>(
        `${environment.apiUrl}/courses${queryStr}`
      )
    );
    return response.courses;
  }

  async getCourseDetails(courseId: string): Promise<Course> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; course: Course }>(
        `${environment.apiUrl}/courses/${courseId}`,
        { headers }
      )
    );
    return response.course;
  }

  async enrollInCourse(courseId: string): Promise<boolean> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.post<{ success: boolean }>(
        `${environment.apiUrl}/courses/${courseId}/enroll`,
        {},
        { headers }
      )
    );
    return response.success;
  }

  async getEnrolledCourses(): Promise<Enrollment[]> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; courses: Enrollment[] }>(
        `${environment.apiUrl}/student/my-learning`,
        { headers }
      )
    );
    return response.courses;
  }

  async getAssignments(): Promise<Assignment[]> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; assignments: Assignment[] }>(
        `${environment.apiUrl}/student/assignments`,
        { headers }
      )
    );
    return response.assignments;
  }

  async getQuizzes(): Promise<Quiz[]> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; quizzes: Quiz[] }>(
        `${environment.apiUrl}/student/quizzes`,
        { headers }
      )
    );
    return response.quizzes;
  }

  async getCertificates(): Promise<Certificate[]> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; certificates: Certificate[] }>(
        `${environment.apiUrl}/student/certificates`,
        { headers }
      )
    );
    return response.certificates;
  }

  async getWishlist(): Promise<Course[]> {
    const headers = await this.getAuthHeaders();
    const response = await firstValueFrom(
      this.http.get<{ success: boolean; wishlist: Course[] }>(
        `${environment.apiUrl}/student/wishlist`,
        { headers }
      )
    );
    return response.wishlist;
  }
}
