import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../../core/services/student.service';
import { Course } from '../../../core/models/student.model';

@Component({
  selector: 'app-browse-courses',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './browse-courses.html',
  styleUrl: './browse-courses.scss',
})
export class BrowseCourses implements OnInit {
  private studentService = inject(StudentService);

  courses = signal<Course[]>([]);
  isLoading = signal(true);

  selectedCategory = signal<string>('All');
  selectedLevel = signal<string>('Level: All');
  selectedSort = signal<string>('Sort: Popular');
  searchQuery = signal<string>('');

  categories = ['All', 'Design', 'Development', 'Business', 'Data Science'];
  levels = ['Level: All', 'Beginner', 'Intermediate', 'Advanced'];
  sorts = ['Sort: Popular', 'Newest', 'Highest Rated', 'Price: Low to High'];

  ngOnInit(): void {
    this.fetchCourses();
  }

  async fetchCourses(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.studentService.getBrowseCourses({
        search: this.searchQuery(),
        category: this.selectedCategory(),
        level: this.selectedLevel(),
        sort: this.selectedSort(),
      });
      this.courses.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch browse courses:', err);
      this.isLoading.set(false);
    }
  }

  onCategorySelect(cat: string): void {
    this.selectedCategory.set(cat);
    this.fetchCourses();
  }

  onFilterChange(): void {
    this.fetchCourses();
  }
}
