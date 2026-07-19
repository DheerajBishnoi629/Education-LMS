import { Routes } from '@angular/router';
import { Features } from './shared/components/features/features';
import { Homepage } from './shared/components/homepage/homepage';
import { Main } from './shared/components/main/main';
import { Pricing } from './shared/components/pricing/pricing';
import { Courses } from './shared/components/courses/courses';
import { Login } from './shared/components/login/login';
import { Signup } from './shared/components/signup/signup';
import { Verify } from './shared/components/verify/verify';
import { ForgotPassword } from './shared/components/forgot-password/forgot-password';

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
  { path: '**', redirectTo: '' },
];

