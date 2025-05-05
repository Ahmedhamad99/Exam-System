
import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-results-for-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule],
  templateUrl: './results-for-admin.component.html',
  styleUrls: ['./results-for-admin.component.css']
})
export class ResultsForAdminComponent implements OnInit {
  studentsResults: any[] = [];
  displayedColumns: string[] = ['username', 'examTitle', 'score'];

  constructor(private examService: ExamService) {}

  ngOnInit() {
    this.loadAllResults();
  }

  loadAllResults() {
    this.examService.getAllResults().subscribe({
      next: (res) => {
        this.studentsResults = res.flatMap((student : any) =>
          student.exams.map((exam : any) => ({

            username: student.username,
            examTitle: exam.examTitle,
            score: `${exam.score} / ${exam.totalQuestions}`
          }))
        );
        console.log('Students results loaded:', this.studentsResults);
      },
      error: (err) => {
        console.error('Error loading students results:', err);
      }
    });
  }
}
