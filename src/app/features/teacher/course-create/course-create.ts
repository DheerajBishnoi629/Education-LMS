import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../../core/services/teacher.service';

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './course-create.html',
  styleUrl: './course-create.scss',
})
export class CourseCreate {
  private teacherService = inject(TeacherService);
  private router = inject(Router);

  isSaving = signal(false);

  title = '';
  subtitle = '';
  category = 'Development';
  level = 'Intermediate';
  price = 49.99;
  thumbnailUrl = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop';
  description = '';

  categories = ['Design', 'Development', 'Business', 'Data Science', 'History'];
  levels = ['Beginner', 'Intermediate', 'Advanced'];

  async onSubmit(): Promise<void> {
    if (!this.title.trim()) return;

    try {
      this.isSaving.set(true);
      await this.teacherService.createCourse({
        title: this.title,
        subtitle: this.subtitle,
        category_name: this.category,
        level: this.level,
        price: this.price,
        thumbnail_url: this.thumbnailUrl,
        description: this.description,
        total_hours: '4h 30m',
      });
      this.isSaving.set(false);
      this.router.navigate(['/teacher/courses']);
    } catch (err) {
      console.error('Failed to create course:', err);
      this.isSaving.set(false);
    }
  }
}
