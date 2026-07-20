import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { firstValueFrom } from 'rxjs';

import { firebaseAuth } from '../firebase/firebase.config';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  isInitialized = signal(false);

  constructor() {
    onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const backendUser = await this.syncWithBackend(token);
          this.currentUser.set(backendUser);
        } catch (error) {
          this.currentUser.set(null);
          throw error;
        }
      } else {
        this.currentUser.set(null);
      }
      this.isInitialized.set(true);
    });
  }

  private async syncWithBackend(token: string): Promise<User> {
    const response = await firstValueFrom(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.http.post<{ success: boolean; user:any }>(
        `${environment.apiUrl}/auth/google`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    );
    const u = response.user;
    return {
      id: u.id,
      firebaseUid: u.firebase_uid,
      email: u.email,
      name: u.name,
      photoUrl: u.photo_url,
      role: u.role
    };
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(firebaseAuth, provider);
    const token = await result.user.getIdToken();
    const backendUser = await this.syncWithBackend(token);
    this.currentUser.set(backendUser);
    this.redirectBasedOnRole(backendUser.role);
  }

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  redirectBasedOnRole(role: string): void {
    if (role === 'student') {
      this.router.navigate(['/student/dashboard']);
    } else if (role === 'teacher') {
      this.router.navigate(['/teacher/dashboard']);
    } else if (role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
