import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule
  ],
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.css']
})
export class TakeExamComponent implements OnInit {
  exam: any = null;
  answers: string[] = [];
  examId: string = '';

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    if (this.examId) {
      this.loadExam();
    }
  }

  loadExam() {
    this.examService.getExams().subscribe({
      next: (exams) => {
        this.exam = exams.find((e: any) => e._id === this.examId);
        if (this.exam) {
          this.answers = new Array(this.exam.questions.length).fill('');
        }
      },
      error: (err) => {
        console.error('Error loading exam:', err);
      }
    });
  }

  submitExam() {
    if (this.examId && this.answers.length) {
      this.examService.submitExam(this.examId, this.answers).subscribe({
        next: (res) => {
          console.log('Exam submitted:', res);
          this.router.navigate(['/results']);
        },
        error: (err) => {
          console.error('Error submitting exam:', err);
        }
      });
    }
  }
}
