import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeacherService } from '../../../core/services/teacher.service';
import { TeacherCourse } from '../../../core/models/teacher.model';

@Component({
  selector: 'app-teacher-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teacher-courses.html',
  styleUrl: './teacher-courses.scss',
})
export class TeacherCourses implements OnInit {
  private teacherService = inject(TeacherService);

  courses = signal<TeacherCourse[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.fetchCourses();
  }

  async fetchCourses(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.teacherService.getTeacherCourses();
      this.courses.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch teacher courses:', err);
      this.isLoading.set(false);
    }
  }
}
