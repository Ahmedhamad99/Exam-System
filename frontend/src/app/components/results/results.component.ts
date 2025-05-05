import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  results: any[] = [];

  constructor(private examService: ExamService) {}

  ngOnInit() {
    this.loadResults();
  }

  loadResults() {
    this.examService.getResults().subscribe({
      next: (res) => {
        this.results = res.map((result: any) => ({
          ...result,
          results: result.results.filter((item: any) => item.isCorrect),
          correctCount: result.results.filter((item: any) => item.isCorrect).length,
          totalQuestions: result.totalQuestions || result.results.length 
        }));
        console.log('Filtered results (Correct only):', this.results);
      },
      error: (err) => {
        console.error('Error loading results:', err);
      }
    });
  }
}
