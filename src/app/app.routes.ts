import { Routes } from '@angular/router';
import { Features } from './shared/components/features/features';
import { Homepage } from './shared/components/homepage/homepage';
import { Main } from './shared/components/main/main';
import { Pricing } from './shared/components/pricing/pricing';
import { Courses } from './shared/components/courses/courses';
import { Login } from './features/auth/login/login/login';
import { Signup } from './features/auth/login/signup/signup';
import { Verify } from './features/auth/login/verify/verify';
import { ForgotPassword } from './features/auth/login/forgot-password/forgot-password';
import { StudentDashboard } from './features/student/student-dashboard';
import { StudentLayout } from './features/student/layout/student-layout';
import { BrowseCourses } from './features/student/browse/browse-courses';
import { CourseDetail } from './features/student/course-detail/course-detail';
import { MyLearning } from './features/student/my-learning/my-learning';
import { Assignments } from './features/student/assignments/assignments';
import { Quizzes } from './features/student/quizzes/quizzes';
import { Certificates } from './features/student/certificates/certificates';
import { Wishlist } from './features/student/wishlist/wishlist';
import { TeacherLayout } from './features/teacher/layout/teacher-layout';
import { TeacherDashboard } from './features/teacher/teacher-dashboard';
import { TeacherCourses } from './features/teacher/courses/teacher-courses';
import { TeacherAnalytics } from './features/teacher/analytics/teacher-analytics';
import { CourseCreate } from './features/teacher/course-create/course-create';
import { TeacherStudents } from './features/teacher/students/teacher-students';
import { TeacherPayments } from './features/teacher/payments/teacher-payments';
import { AdminLayout } from './features/admin/layout/admin-layout';
import { AdminDashboard } from './features/admin/admin-dashboard';
import { AdminSettings } from './features/admin/settings/admin-settings';
import { UserManagement } from './features/admin/users/user-management';
import { CourseModeration } from './features/admin/courses/course-moderation';
import { FinancialReports } from './features/admin/financials/financial-reports';
import { SupportTickets } from './features/admin/tickets/support-tickets';
import { AuditLogs } from './features/admin/audit-logs/audit-logs';
import { Unauthorized } from './features/auth/unauthorized/unauthorized';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: Main,
    children: [
      { path: '', component: Homepage },
      { path: 'features', component: Features },
      { path: 'pricing', component: Pricing },
      { path: 'courses', component: Courses },
    ],
  },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'verify', component: Verify },
  { path: 'forgot-password', component: ForgotPassword },
  {
    path: 'student',
    component: StudentLayout,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['student'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: StudentDashboard },
      { path: 'browse', component: BrowseCourses },
      { path: 'course/:id', component: CourseDetail },
      { path: 'my-learning', component: MyLearning },
      { path: 'assignments', component: Assignments },
      { path: 'quizzes', component: Quizzes },
      { path: 'certificates', component: Certificates },
      { path: 'wishlist', component: Wishlist },
    ],
  },
  {
    path: 'teacher',
    component: TeacherLayout,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['teacher'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: TeacherDashboard },
      { path: 'courses', component: TeacherCourses },
      { path: 'course/create', component: CourseCreate },
      { path: 'analytics', component: TeacherAnalytics },
      { path: 'students', component: TeacherStudents },
      { path: 'payments', component: TeacherPayments },
    ],
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['admin'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: UserManagement },
      { path: 'courses', component: CourseModeration },
      { path: 'financials', component: FinancialReports },
      { path: 'settings', component: AdminSettings },
      { path: 'tickets', component: SupportTickets },
      { path: 'audit-logs', component: AuditLogs },
    ],
  },
  { path: 'unauthorized', component: Unauthorized },
  { path: '**', redirectTo: '' },
];
