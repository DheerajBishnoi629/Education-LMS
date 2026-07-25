import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { Enrollment } from '../../../core/models/student.model';

@Component({
  selector: 'app-my-learning',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-learning.html',
  styleUrl: './my-learning.scss',
})
export class MyLearning implements OnInit {
  private studentService = inject(StudentService);

  courses = signal<Enrollment[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.fetchEnrolledCourses();
  }

  async fetchEnrolledCourses(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.studentService.getEnrolledCourses();
      this.courses.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch enrolled courses:', err);
      this.isLoading.set(false);
    }
  }
}
