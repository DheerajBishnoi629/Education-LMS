import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
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
  pendingApproval?: boolean;
  isRejected?: boolean;
  message?: string;
  user?: User;
}

export interface GoogleAuthResult {
  requiresPasswordCreation: boolean;
  user?: User;
  firebaseUser?: FirebaseUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  isInitialized = signal(false);
  isGoogleAuthInProgress = false;

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
            const syncRes = await this.syncWithBackend(token);
            if (syncRes.pendingApproval || syncRes.isRejected) {
              this.currentUser.set(null);
            } else {
              this.currentUser.set(syncRes.user);
              const currentUrl = this.router.url;
              if (!this.isGoogleAuthInProgress && (currentUrl === '/login' || currentUrl === '/signup' || currentUrl === '/')) {
                this.redirectBasedOnRole(syncRes.user.role);
              }
            }
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

  async syncWithBackend(
    token: string,
    fullName?: string,
    role?: string
  ): Promise<{ user: User; pendingApproval?: boolean; isRejected?: boolean; message?: string }> {
    const response = await firstValueFrom(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.http.post<{ success: boolean; pendingApproval?: boolean; isRejected?: boolean; message?: string; user: any }>(
        `${environment.apiUrl}/auth/sync`,
        { name: fullName, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    );
    const u = response.user;
    return {
      pendingApproval: response.pendingApproval,
      isRejected: response.isRejected,
      message: response.message,
      user: {
        id: u.id,
        firebaseUid: u.firebase_uid,
        email: u.email,
        name: u.name,
        photoUrl: u.photo_url,
        role: u.role,
        status: u.status,
      },
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
      status: u.status,
    };
  }

  async signUp(fullName: string, email: string, password: string, role = 'student'): Promise<AuthResponse> {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;

    let syncRes = null;
    if (user) {
      await updateProfile(user, { displayName: fullName });
      await sendEmailVerification(user);
      const idToken = await user.getIdToken();
      syncRes = await this.syncWithBackend(idToken, fullName, role);
    }

    if (role === 'teacher' || syncRes?.pendingApproval) {
      return {
        success: true,
        pendingApproval: true,
        message: 'Your teacher registration request has been submitted successfully! An administrator will review and approve your teacher account soon.',
      };
    }

    return {
      success: true,
      message: 'Account created successfully! Please check your Gmail inbox to verify your email address before logging in.',
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;

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
    const syncRes = await this.syncWithBackend(idToken);

    if (syncRes.pendingApproval) {
      return {
        success: false,
        pendingApproval: true,
        message: syncRes.message || 'Your teacher account registration is currently pending administrator approval. An admin will review and approve your account soon.',
      };
    }

    if (syncRes.isRejected) {
      return {
        success: false,
        isRejected: true,
        message: syncRes.message || 'Your teacher account request was declined by an administrator.',
      };
    }

    this.currentUser.set(syncRes.user);

    return {
      success: true,
      user: syncRes.user,
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

  async loginWithGoogle(): Promise<GoogleAuthResult> {
    this.isGoogleAuthInProgress = true;
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;

      const token = await user.getIdToken();
      const syncRes = await this.syncWithBackend(token, user.displayName || undefined);

      const hasPasswordProvider = user.providerData.some(p => p.providerId === 'password');

      // Prompt for password creation if first time and no password provider linked yet
      if (!hasPasswordProvider) {
        return {
          requiresPasswordCreation: true,
          firebaseUser: user,
          user: syncRes.user,
        };
      }

      if (!syncRes.pendingApproval && !syncRes.isRejected) {
        this.currentUser.set(syncRes.user);
        this.redirectBasedOnRole(syncRes.user.role);
      }

      this.isGoogleAuthInProgress = false;
      return {
        requiresPasswordCreation: false,
        user: syncRes.user,
        firebaseUser: user,
      };
    } catch (err) {
      this.isGoogleAuthInProgress = false;
      throw err;
    }
  }

  async setPasswordForGoogleUser(firebaseUser: FirebaseUser, newPassword: string): Promise<User> {
    try {
      if (firebaseUser.email) {
        try {
          const credential = EmailAuthProvider.credential(firebaseUser.email, newPassword);
          await linkWithCredential(firebaseUser, credential);
        } catch {
          await updatePassword(firebaseUser, newPassword);
        }
      } else {
        await updatePassword(firebaseUser, newPassword);
      }
      const token = await firebaseUser.getIdToken(true);
      const syncRes = await this.syncWithBackend(token, firebaseUser.displayName || undefined);
      if (!syncRes.pendingApproval && !syncRes.isRejected) {
        this.currentUser.set(syncRes.user);
        this.redirectBasedOnRole(syncRes.user.role);
      }
      return syncRes.user;
    } finally {
      this.isGoogleAuthInProgress = false;
    }
  }

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  redirectBasedOnRole(role: string): void {
    const normalizedRole = (role || '').toLowerCase();
    if (normalizedRole === 'student') {
      this.router.navigate(['/student/dashboard']);
    } else if (normalizedRole === 'teacher') {
      this.router.navigate(['/teacher/dashboard']);
    } else if (normalizedRole === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}

