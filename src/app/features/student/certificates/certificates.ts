import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../core/services/student.service';
import { Certificate } from '../../../core/models/student.model';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificates.html',
  styleUrl: './certificates.scss',
})
export class Certificates implements OnInit {
  private studentService = inject(StudentService);

  certificates = signal<Certificate[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.fetchCertificates();
  }

  async fetchCertificates(): Promise<void> {
    try {
      this.isLoading.set(true);
      const res = await this.studentService.getCertificates();
      this.certificates.set(res);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Failed to fetch certificates:', err);
      this.isLoading.set(false);
    }
  }
}
