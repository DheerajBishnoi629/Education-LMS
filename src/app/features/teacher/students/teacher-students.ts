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
  reexamRequests = signal<any[]>([]);
  isLoading = signal(true);
  activeTab = signal<'enrolled' | 'reexam'>('enrolled');

  ngOnInit(): void {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    try {
      this.isLoading.set(true);
      const [stRes, rxRes] = await Promise.all([
        this.teacherService.getStudents(),
        this.teacherService.getReexamRequests(),
      ]);
      this.students.set(stRes);
      this.reexamRequests.set(rxRes);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch teacher student data:', err);
      this.isLoading.set(false);
    }
  }

  async respondReexam(attemptId: string, approve: boolean): Promise<void> {
    try {
      const ok = await this.teacherService.respondReexamRequest(attemptId, approve);
      if (ok) {
        await this.fetchData();
      }
    } catch (err) {
      console.error('Failed to respond re-exam request:', err);
    }
  }
}

