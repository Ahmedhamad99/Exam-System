


import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ExamListComponent } from './components/exam-list/exam-list.component';
import { AdminComponent } from './components/admin/admin.component';
import { TakeExamComponent } from './components/take-exam/take-exam.component';
import { ResultsComponent } from './components/results/results.component';
import { ResultsForAdminComponent } from './components/results-for-admin/results-for-admin.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'exams', component: ExamListComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'exams/:id', component: TakeExamComponent,  },
  { path: 'results', component: ResultsComponent,  },
  { path: 'all-results', component: ResultsForAdminComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
