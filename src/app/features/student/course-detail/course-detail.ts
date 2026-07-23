import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { Course } from '../../../core/models/student.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss',
})
export class CourseDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);

  course = signal<Course | null>(null);
  isLoading = signal(true);
  isEnrolling = signal(false);
  enrollSuccess = signal(false);

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourse(courseId);
    }
  }

  async loadCourse(id: string): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.studentService.getCourseDetails(id);
      this.course.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch course detail:', err);
      this.isLoading.set(false);
    }
  }

  async enroll(): Promise<void> {
    const c = this.course();
    if (!c) return;

    try {
      this.isEnrolling.set(true);
      const success = await this.studentService.enrollInCourse(c.id);
      if (success) {
        this.enrollSuccess.set(true);
        this.course.set({ ...c, isEnrolled: true });
      }
      this.isEnrolling.set(false);
    } catch (err) {
      console.error('Enrollment failed:', err);
      this.isEnrolling.set(false);
    }
  }
}
