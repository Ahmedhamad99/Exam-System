
import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements OnInit {
  exams: any[] = [];

  constructor(private examService: ExamService) {}

  ngOnInit() {
    this.examService.getExams().subscribe({
      next: (res) => {
        this.exams = res;
      },
      error: (err) => {
        console.error('Error fetching exams:', err);
      }
    });
  }
}
