import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../core/services/student.service';
import { Quiz } from '../../../core/models/student.model';

@Component({
  selector: 'app-quizzes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quizzes.html',
  styleUrl: './quizzes.scss',
})
export class Quizzes implements OnInit {
  private studentService = inject(StudentService);

  quizzes = signal<Quiz[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.fetchQuizzes();
  }

  async fetchQuizzes(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.studentService.getQuizzes();
      this.quizzes.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
      this.isLoading.set(false);
    }
  }
}
