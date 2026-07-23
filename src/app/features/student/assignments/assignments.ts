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
}
