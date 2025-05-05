
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  role: string = 'student';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    const user = { username: this.username, email: this.email, password: this.password, role: this.role };
    this.authService.register(user).subscribe({
      next: (res) => {
        console.log('Register response:', res);
        localStorage.setItem('token', res.token);
        this.router.navigate([this.authService.isAdmin() ? '/admin' : '/exams']);
      },
      error: (err) => {
        this.error = err.error.msg || 'Registration failed';
      }
    });
  }
}
