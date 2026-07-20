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
import { TeacherDashboard } from './features/teacher/teacher-dashboard';
import { AdminDashboard } from './features/admin/admin-dashboard';
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
    path: 'student/dashboard',
    component: StudentDashboard,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['student'] },
  },
  {
    path: 'teacher/dashboard',
    component: TeacherDashboard,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['teacher'] },
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboard,
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ['admin'] },
  },
  { path: 'unauthorized', component: Unauthorized },
  { path: '**', redirectTo: '' },
];
