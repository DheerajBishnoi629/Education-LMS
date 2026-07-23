import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { ModerationCourse } from '../../../core/models/admin.model';

@Component({
  selector: 'app-course-moderation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-moderation.html',
  styleUrl: './course-moderation.scss',
})
export class CourseModeration implements OnInit {
  private adminService = inject(AdminService);

  courses = signal<ModerationCourse[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.fetchCourses();
  }

  async fetchCourses(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.adminService.getModerationCourses();
      this.courses.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch moderation courses:', err);
      this.isLoading.set(false);
    }
  }

  approveCourse(courseId: string): void {
    this.courses.update((list) =>
      list.map((c) => (c.id === courseId ? { ...c, status: 'Approved' } : c))
    );
  }

  rejectCourse(courseId: string): void {
    this.courses.update((list) =>
      list.map((c) => (c.id === courseId ? { ...c, status: 'Rejected' } : c))
    );
  }
}
