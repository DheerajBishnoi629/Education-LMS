import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../../core/services/teacher.service';
import { TeacherSubmission, TeacherCourse } from '../../../core/models/teacher.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-teacher-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-assignments.html',
  styleUrl: './teacher-assignments.scss',
})
export class TeacherAssignments implements OnInit {
  private teacherService = inject(TeacherService);

  submissions = signal<TeacherSubmission[]>([]);
  courses = signal<TeacherCourse[]>([]);
  isLoading = signal(true);

  // Create Assignment Modal State
  isCreateModalOpen = signal(false);
  isSavingAssignment = signal(false);
  newCourseId = '';
  newTitle = '';
  newDescription = '';
  newDueDate = '';

  // Score input mapping by submission_id
  scoresMap: { [submissionId: string]: number } = {};

  ngOnInit(): void {
    this.fetchSubmissions();
    this.fetchCourses();
  }

  async fetchSubmissions(): Promise<void> {
    try {
      this.isLoading.set(true);
      const list = await this.teacherService.getTeacherAssignments();
      this.submissions.set(list);

      // Initialize score inputs
      list.forEach((sub) => {
        if (sub.submission_id) {
          this.scoresMap[sub.submission_id] = sub.score ?? 85;
        }
      });

      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch teacher assignments:', err);
      this.isLoading.set(false);
    }
  }

  async fetchCourses(): Promise<void> {
    try {
      const list = await this.teacherService.getTeacherCourses();
      this.courses.set(list);
      if (list.length > 0) {
        this.newCourseId = list[0].id;
      }
    } catch (err) {
      console.error('Failed to fetch teacher courses:', err);
    }
  }

  openCreateModal(): void {
    if (this.courses().length > 0 && !this.newCourseId) {
      this.newCourseId = this.courses()[0].id;
    }
    this.newTitle = '';
    this.newDescription = '';
    this.newDueDate = '';
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  async submitCreateAssignment(): Promise<void> {
    if (!this.newCourseId || !this.newTitle.trim()) {
      alert('Please select a course and enter an assignment title.');
      return;
    }

    try {
      this.isSavingAssignment.set(true);
      await this.teacherService.createAssignment({
        course_id: this.newCourseId,
        title: this.newTitle,
        description: this.newDescription,
        due_date: this.newDueDate || undefined,
      });
      this.isSavingAssignment.set(false);
      this.closeCreateModal();
      await this.fetchSubmissions();
    } catch (err) {
      console.error('Failed to create assignment:', err);
      alert('Failed to create assignment. Please try again.');
      this.isSavingAssignment.set(false);
    }
  }

  getDownloadUrl(fileUrl?: string | null): string {
    if (!fileUrl) return '#';
    if (fileUrl.startsWith('http')) return fileUrl;
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${fileUrl}`;
  }

  async saveGrade(item: TeacherSubmission): Promise<void> {
    if (!item.submission_id) return;
    const score = this.scoresMap[item.submission_id];

    if (score === undefined || score === null || isNaN(score) || score < 0 || score > 100) {
      alert('Please enter a valid score between 0 and 100.');
      return;
    }

    try {
      await this.teacherService.gradeSubmission(item.submission_id, score);
      await this.fetchSubmissions();
    } catch (err) {
      console.error('Failed to grade submission:', err);
      alert('Failed to save grade. Please try again.');
    }
  }

  async respondReupload(item: TeacherSubmission, approve: boolean): Promise<void> {
    if (!item.submission_id) return;

    try {
      await this.teacherService.respondReuploadRequest(item.submission_id, approve);
      await this.fetchSubmissions();
    } catch (err) {
      console.error('Failed to respond to re-upload request:', err);
      alert('Failed to update re-upload permission. Please try again.');
    }
  }

  get pendingReuploadsCount(): number {
    return this.submissions().filter(s => s.reupload_status === 'requested').length;
  }

  get pendingGradingCount(): number {
    return this.submissions().filter(s => s.status === 'submitted').length;
  }
}
