import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../core/services/student.service';
import { Assignment } from '../../../core/models/student.model';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assignments.html',
  styleUrl: './assignments.scss',
})
export class Assignments implements OnInit {
  private studentService = inject(StudentService);

  assignments = signal<Assignment[]>([]);
  isLoading = signal(true);

  // Modal & File Upload State
  isModalOpen = signal(false);
  selectedAssignment = signal<Assignment | null>(null);
  selectedFile = signal<File | null>(null);
  isSubmitting = signal(false);
  modalError = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchAssignments();
  }

  async fetchAssignments(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.studentService.getAssignments();
      this.assignments.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
      this.isLoading.set(false);
    }
  }

  openSubmitModal(item: Assignment): void {
    this.selectedAssignment.set(item);
    this.selectedFile.set(null);
    this.modalError.set(null);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedAssignment.set(null);
    this.selectedFile.set(null);
    this.modalError.set(null);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.name.toLowerCase().endsWith('.zip')) {
        this.modalError.set('Please select a valid .zip file');
        this.selectedFile.set(null);
        return;
      }
      this.modalError.set(null);
      this.selectedFile.set(file);
    }
  }

  async submitAssignment(): Promise<void> {
    const assignment = this.selectedAssignment();
    const file = this.selectedFile();

    if (!assignment || !file) {
      this.modalError.set('Please attach a .zip file before submitting');
      return;
    }

    try {
      this.isSubmitting.set(true);
      await this.studentService.submitAssignmentZip(assignment.id, file);
      this.isSubmitting.set(false);
      this.closeModal();
      await this.fetchAssignments();
    } catch (err: any) {
      console.error('Failed to submit assignment:', err);
      this.modalError.set(err?.error?.message || 'Failed to submit assignment. Please try again.');
      this.isSubmitting.set(false);
    }
  }

  async requestReupload(item: Assignment): Promise<void> {
    try {
      await this.studentService.requestReupload(item.id);
      await this.fetchAssignments();
    } catch (err) {
      console.error('Failed to request re-upload:', err);
      alert('Failed to request re-upload permission. Please try again.');
    }
  }
}
