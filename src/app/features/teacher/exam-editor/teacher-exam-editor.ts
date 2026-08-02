import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../../core/services/teacher.service';

export interface ExamQuestionItem {
  id?: string;
  exam_id?: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  order_index?: number;
}

@Component({
  selector: 'app-teacher-exam-editor',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './teacher-exam-editor.html',
  styleUrl: './teacher-exam-editor.scss',
})
export class TeacherExamEditor implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private teacherService = inject(TeacherService);

  courseId = signal<string>('');
  isLoading = signal<boolean>(true);
  isSavingSettings = signal<boolean>(false);
  isSavingQuestion = signal<boolean>(false);

  exam = signal<any>(null);
  questions = signal<ExamQuestionItem[]>([]);

  // Exam settings form
  examTitle = '';
  passingScore = 8;

  // Question editor form
  editingQuestionId: string | null = null;
  questionText = '';
  optionA = '';
  optionB = '';
  optionC = '';
  optionD = '';
  correctOption: 'A' | 'B' | 'C' | 'D' = 'A';

  successMessage = signal<string>('');
  errorMessage = signal<string>('');

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('courseId');
    if (id) {
      this.courseId.set(id);
      await this.loadExam();
    }
  }

  async loadExam(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.errorMessage.set('');
      const data = await this.teacherService.getCourseExam(this.courseId());
      this.exam.set(data.exam);
      this.questions.set(data.questions || []);

      if (data.exam) {
        this.examTitle = data.exam.title;
        this.passingScore = data.exam.passing_score;
      }
    } catch (err: any) {
      console.error('Failed to load course exam:', err);
      this.errorMessage.set('Failed to load course entrance exam details.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async saveExamSettings(): Promise<void> {
    if (!this.examTitle.trim()) {
      this.errorMessage.set('Exam title is required.');
      return;
    }

    try {
      this.isSavingSettings.set(true);
      this.errorMessage.set('');
      const updatedExam = await this.teacherService.updateCourseExam(this.courseId(), {
        title: this.examTitle,
        passing_score: this.passingScore,
        total_questions: this.questions().length,
      });
      this.exam.set(updatedExam);
      this.showToast('Exam settings saved successfully!');
    } catch (err: any) {
      console.error('Failed to update exam settings:', err);
      this.errorMessage.set(err?.message || 'Failed to save exam settings.');
    } finally {
      this.isSavingSettings.set(false);
    }
  }

  async saveQuestion(): Promise<void> {
    if (!this.questionText.trim() || !this.optionA.trim() || !this.optionB.trim() || !this.optionC.trim() || !this.optionD.trim()) {
      this.errorMessage.set('Please fill out the question text and all 4 options.');
      return;
    }

    const payload = {
      question_text: this.questionText,
      option_a: this.optionA,
      option_b: this.optionB,
      option_c: this.optionC,
      option_d: this.optionD,
      correct_option: this.correctOption,
      order_index: this.questions().length + 1,
    };

    try {
      this.isSavingQuestion.set(true);
      this.errorMessage.set('');

      if (this.editingQuestionId) {
        await this.teacherService.updateExamQuestion(this.courseId(), this.editingQuestionId, payload);
        this.showToast('Question updated successfully!');
      } else {
        await this.teacherService.addExamQuestion(this.courseId(), payload);
        this.showToast('New question added to exam!');
      }

      this.resetQuestionForm();
      await this.loadExam();
    } catch (err: any) {
      console.error('Failed to save question:', err);
      this.errorMessage.set(err?.message || 'Failed to save question.');
    } finally {
      this.isSavingQuestion.set(false);
    }
  }

  editQuestion(q: ExamQuestionItem): void {
    if (!q.id) return;
    this.editingQuestionId = q.id;
    this.questionText = q.question_text;
    this.optionA = q.option_a;
    this.optionB = q.option_b;
    this.optionC = q.option_c;
    this.optionD = q.option_d;
    this.correctOption = (q.correct_option as 'A' | 'B' | 'C' | 'D') || 'A';
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.resetQuestionForm();
  }

  async deleteQuestion(questionId: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this exam question?')) return;

    try {
      this.errorMessage.set('');
      await this.teacherService.deleteExamQuestion(this.courseId(), questionId);
      this.showToast('Question deleted.');
      await this.loadExam();
    } catch (err: any) {
      console.error('Failed to delete question:', err);
      this.errorMessage.set('Failed to delete question.');
    }
  }

  resetQuestionForm(): void {
    this.editingQuestionId = null;
    this.questionText = '';
    this.optionA = '';
    this.optionB = '';
    this.optionC = '';
    this.optionD = '';
    this.correctOption = 'A';
  }

  private showToast(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(''), 3000);
  }
}
