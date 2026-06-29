import { Routes } from '@angular/router';
import { Main } from './shared/components/main/main';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Main, title: 'Home' },
];
