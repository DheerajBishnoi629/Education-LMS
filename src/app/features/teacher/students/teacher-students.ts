import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../core/services/teacher.service';
import { TeacherStudent } from '../../../core/models/teacher.model';

@Component({
  selector: 'app-teacher-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-students.html',
  styleUrl: './teacher-students.scss',
})
export class TeacherStudents implements OnInit {
  private teacherService = inject(TeacherService);

  students = signal<TeacherStudent[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.fetchStudents();
  }

  async fetchStudents(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.teacherService.getStudents();
      this.students.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch teacher students:', err);
      this.isLoading.set(false);
    }
  }
}
