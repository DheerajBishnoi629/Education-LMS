import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { Course } from '../../../core/models/student.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist implements OnInit {
  private studentService = inject(StudentService);

  courses = signal<Course[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.fetchWishlist();
  }

  async fetchWishlist(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.studentService.getWishlist();
      this.courses.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
      this.isLoading.set(false);
    }
  }
}
