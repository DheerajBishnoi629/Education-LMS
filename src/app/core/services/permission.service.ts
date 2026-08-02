import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  // Parent student permission
  readonly EDUFORGE_SIDEBAR_STUDENT = 'EDUFORGE-SIDEBAR-STUDENT';

  // Child student tab permissions
  readonly EDUFORGE_SIDEBAR_STUDENT_DASHBOARD = 'EDUFORGE-SIDEBAR-STUDENT-DASHBOARD';
  readonly EDUFORGE_SIDEBAR_STUDENT_BROWSE = 'EDUFORGE-SIDEBAR-STUDENT-BROWSE';
  readonly EDUFORGE_SIDEBAR_STUDENT_MY_LEARNING = 'EDUFORGE-SIDEBAR-STUDENT-MY-LEARNING';
  readonly EDUFORGE_SIDEBAR_STUDENT_ASSIGNMENTS = 'EDUFORGE-SIDEBAR-STUDENT-ASSIGNMENTS';
  readonly EDUFORGE_SIDEBAR_STUDENT_QUIZZES = 'EDUFORGE-SIDEBAR-STUDENT-QUIZZES';
  readonly EDUFORGE_SIDEBAR_STUDENT_CERTIFICATES = 'EDUFORGE-SIDEBAR-STUDENT-CERTIFICATES';
  readonly EDUFORGE_SIDEBAR_STUDENT_WISHLIST = 'EDUFORGE-SIDEBAR-STUDENT-WISHLIST';

  // Active user permissions list
  userPermissions = signal<string[]>([
    this.EDUFORGE_SIDEBAR_STUDENT,
    this.EDUFORGE_SIDEBAR_STUDENT_DASHBOARD,
    this.EDUFORGE_SIDEBAR_STUDENT_BROWSE,
    this.EDUFORGE_SIDEBAR_STUDENT_MY_LEARNING,
    this.EDUFORGE_SIDEBAR_STUDENT_ASSIGNMENTS,
    this.EDUFORGE_SIDEBAR_STUDENT_QUIZZES,
    // this.EDUFORGE_SIDEBAR_STUDENT_CERTIFICATES,
    this.EDUFORGE_SIDEBAR_STUDENT_WISHLIST,
  ]);

  /**
   * Check if active user has permission
   */
  hasPermission(permission: string): boolean {
    return this.userPermissions().includes(permission);
  }

  /**
   * Set active user permissions
   */
  setPermissions(permissions: string[]): void {
    this.userPermissions.set(permissions);
  }
}
