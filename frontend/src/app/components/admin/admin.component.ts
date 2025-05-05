import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatSelectModule,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  exams: any[] = [];
  examForm: FormGroup;
  questionForm: FormGroup;

  constructor(private fb: FormBuilder, private examService: ExamService) {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });

    this.questionForm = this.fb.group({
      examId: ['', Validators.required],
      text: ['', Validators.required],
      options: this.fb.array([
        ['', Validators.required],
        ['', Validators.required],
        ['', Validators.required],
        ['', Validators.required]
      ]),
      correctAnswer: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadExams();
  }

  loadExams() {
    this.examService.getExams().subscribe({
      next: (res) => {
        this.exams = res;
      },
      error: (err) => {
        console.error('Error fetching exams:', err);
      }
    });
  }

  addExam() {
    if (this.examForm.invalid) {
      console.error('Invalid exam data:', this.examForm.value);
      return;
    }
    this.examService.createExam(this.examForm.value).subscribe({
      next: (res) => {
        this.exams.push(res);
        this.examForm.reset();
      },
      error: (err) => {
        console.error('Error creating exam:', err);
      }
    });
  }

  addQuestion() {
    if (this.questionForm.invalid) {
      console.error('Invalid question data:', this.questionForm.value);
      return;
    }
    console.log('Sending question:', this.questionForm.value);
    this.examService.addQuestion(this.questionForm.value.examId, this.questionForm.value).subscribe({
      next: (res) => {
        const exam = this.exams.find(e => e._id === this.questionForm.value.examId);
        if (exam) {
          exam.questions = exam.questions || [];
          exam.questions.push(res);
        }
        this.questionForm.reset();
      },
      error: (err) => {
        console.error('Error adding question:', err);
      }
    });
  }

  get options() {
    return this.questionForm.get('options') as FormArray;
  }

  trackByFn(index: number) {
    return index;
  }
}