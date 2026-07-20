import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { firstValueFrom } from 'rxjs';

import { firebaseAuth } from '../firebase/firebase.config';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  success: boolean;
  emailVerified?: boolean;
  message?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  isInitialized = signal(false);

  constructor() {
    onAuthStateChanged(firebaseAuth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          await firebaseUser.reload();
        } catch {
          // ignore
        }

        if (firebaseUser.emailVerified) {
          try {
            const token = await firebaseUser.getIdToken();
            const backendUser = await this.syncWithBackend(token);
            this.currentUser.set(backendUser);
          } catch {
            this.currentUser.set(null);
          }
        } else {
          this.currentUser.set(null);
        }
      } else {
        this.currentUser.set(null);
      }
      this.isInitialized.set(true);
    });
  }

  async syncWithBackend(token: string, fullName?: string): Promise<User> {
    const response = await firstValueFrom(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.http.post<{ success: boolean; user: any }>(
        `${environment.apiUrl}/auth/sync`,
        { name: fullName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      role: u.role,
    };
  }

  async fetchCurrentUser(token: string): Promise<User> {
    const response = await firstValueFrom(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.http.get<{ success: boolean; user: any }>(
        `${environment.apiUrl}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      role: u.role,
    };
  }

  async signUp(fullName: string, email: string, password: string): Promise<AuthResponse> {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;

    if (user) {
      await updateProfile(user, { displayName: fullName });
      await sendEmailVerification(user);
      const idToken = await user.getIdToken();
      await this.syncWithBackend(idToken, fullName);
    }

    return {
      success: true,
      message: 'Account created successfully! Please check your Gmail inbox to verify your email address before logging in.',
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;

    // Reload user to get latest emailVerified status from Firebase servers
    try {
      await user.reload();
    } catch {
      // ignore reload error if network glitch
    }

    if (!user.emailVerified) {
      return {
        success: false,
        emailVerified: false,
        message: 'Your email is not verified yet. Please check your inbox.',
      };
    }

    const idToken = await user.getIdToken(true);
    const backendUser = await this.syncWithBackend(idToken);
    this.currentUser.set(backendUser);

    return {
      success: true,
      emailVerified: true,
      user: backendUser,
    };
  }

  async resendVerificationEmail(): Promise<void> {
    if (firebaseAuth.currentUser) {
      await sendEmailVerification(firebaseAuth.currentUser);
    }
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(firebaseAuth, email);
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(firebaseAuth, provider);
    const token = await result.user.getIdToken();
    const backendUser = await this.syncWithBackend(token, result.user.displayName || undefined);
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

