
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token || !this.isValidJwt(token)) {
      return false;
    }
    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token || !this.isValidJwt(token)) {
      return false;
    }
    try {
      const decoded = this.jwtHelper.decodeToken(token);
      return decoded && decoded.role === 'admin';
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  private isValidJwt(token: string): boolean {
  
    const parts = token.split('.');
    return parts.length === 3;
  }
}
