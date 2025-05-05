
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:5000/api/exams';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  getExams(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  createExam(exam: any): Observable<any> {
    return this.http.post(this.apiUrl, exam, { headers: this.getAuthHeaders() });
  }

  addQuestion(examId: string, question: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${examId}/questions`, question, { headers: this.getAuthHeaders() });
  }

  submitExam(examId: string, answers: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${examId}/submit`, answers, { headers: this.getAuthHeaders() });
  }

  getResults(): Observable<any> {
    return this.http.get(`${this.apiUrl}/results`, { headers: this.getAuthHeaders() });
  }
  getAllResults(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-results`, { headers: this.getAuthHeaders() });
  }
}
