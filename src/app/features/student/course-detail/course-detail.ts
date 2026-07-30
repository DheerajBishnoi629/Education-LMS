import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StudentService } from '../../../core/services/student.service';
import { Course, Lesson } from '../../../core/models/student.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss',
})
export class CourseDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private studentService = inject(StudentService);
  private sanitizer = inject(DomSanitizer);

  course = signal<Course | null>(null);
  selectedLesson = signal<Lesson | null>(null);
  safeVideoUrl = signal<SafeResourceUrl | null>(null);
  isLoading = signal(true);
  isEnrolling = signal(false);
  enrollSuccess = signal(false);

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourse(courseId);
    }
  }

  async loadCourse(id: string): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.studentService.getCourseDetails(id);
      this.course.set(res);

      // Auto-select the first available lesson from the first module
      if (res && res.modules && res.modules.length > 0) {
        for (const mod of res.modules) {
          if (mod.lessons && mod.lessons.length > 0) {
            this.selectLesson(mod.lessons[0]);
            break;
          }
        }
      }

      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch course detail:', err);
      this.isLoading.set(false);
    }
  }

  selectLesson(lesson: Lesson): void {
    this.selectedLesson.set(lesson);
    const url = lesson.video_url || '';
    let embedUrl = '';

    if (url.includes('list=')) {
      const listMatch = url.match(/list=([a-zA-Z0-9_-]+)/);
      const listId = listMatch ? listMatch[1] : 'PL9n0l8rSshSnragNblKDBsT8Xu3otp3jA';
      embedUrl = `https://www.youtube.com/embed/videoseries?list=${listId}&autoplay=1&rel=0`;
    } else {
      const videoId = this.extractYouTubeId(url);
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }

    this.safeVideoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl));
  }

  private extractYouTubeId(url?: string): string {
    if (!url) return 'c9Wg6Cb_YlU';

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return match[2];
    }

    if (url.length === 11) {
      return url;
    }

    return 'c9Wg6Cb_YlU';
  }

  async enroll(): Promise<void> {
    const c = this.course();
    if (!c) return;

    try {
      this.isEnrolling.set(true);
      const success = await this.studentService.enrollInCourse(c.id);
      if (success) {
        this.enrollSuccess.set(true);
        this.course.set({ ...c, isEnrolled: true });
      }
      this.isEnrolling.set(false);
    } catch (err) {
      console.error('Enrollment failed:', err);
      this.isEnrolling.set(false);
    }
  }
}

