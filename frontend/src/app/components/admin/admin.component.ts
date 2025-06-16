import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  editExamForm: FormGroup;
  editingExamId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private cdr: ChangeDetectorRef
  ) {
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

    this.editExamForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadExams();
  }

  loadExams() {
    console.log('Fetching exams...');
    this.examService.getExams().subscribe({
      next: (res) => {
        console.log('Exams loaded:', res);
        this.exams = res;
        this.cdr.detectChanges();
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

    console.log('Creating exam:', this.examForm.value);
    this.examService.createExam(this.examForm.value).subscribe({
      next: (res) => {
        console.log('Exam created:', res);
        this.exams.push(res);
        this.examForm.reset();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error creating exam:', err);
      }
    });
  }

  editExam(examId: string) {
    console.log('Edit button clicked for examId:', examId);
    this.examService.getExam(examId).subscribe({
      next: (response) => {
        const exam = response.data || response;
        console.log('Exam fetched for editing:', exam);
        this.editingExamId = exam._id;
        this.editExamForm.patchValue({
          title: exam.title,
          description: exam.description
        });
        console.log('Editing form populated, editingExamId:', this.editingExamId);
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error fetching exam:', err);
      }
    });
  }

  saveExam(examId: string) {
    if (this.editExamForm.invalid) {
      console.error('Invalid edit exam data:', this.editExamForm.value);
      return;
    }

    console.log('Saving exam:', examId, this.editExamForm.value);
    this.examService.updateExam(examId, this.editExamForm.value).subscribe({
      next: (res) => {
        console.log('Exam updated:', res);
        const index = this.exams.findIndex(e => e._id === examId);
        if (index !== -1) {
          this.exams[index] = res;
        }
        this.cancelEdit();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating exam:', err);
      }
    });
  }

  cancelEdit() {
    console.log('Canceling edit, resetting editingExamId');
    this.editingExamId = null;
    this.editExamForm.reset();
    this.cdr.detectChanges();
  }

  deleteExam(examId: string) {
    if (!confirm('Are you sure you want to delete this exam?')) return;

    console.log('Deleting exam:', examId);
    this.examService.deleteExam(examId).subscribe({
      next: () => {
        console.log('Exam deleted:', examId);
        this.exams = this.exams.filter(e => e._id !== examId);
        if (this.editingExamId === examId) {
          this.cancelEdit();
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting exam:', err);
      }
    });
  }

  addQuestion() {
    if (this.questionForm.invalid) {
      console.error('Invalid question data:', this.questionForm.value);
      return;
    }

    const questionData = {
      text: this.questionForm.value.text,
      options: this.questionForm.value.options,
      correctAnswer: this.questionForm.value.correctAnswer
    };

    console.log('Adding question to exam:', this.questionForm.value.examId, questionData);
    this.examService.addQuestion(this.questionForm.value.examId, questionData).subscribe({
      next: (res) => {
        console.log('Question added:', res);
        const exam = this.exams.find(e => e._id === this.questionForm.value.examId);
        if (exam) {
          exam.questions = exam.questions || [];
          exam.questions.push(res);
        }
        this.questionForm.reset();
        this.cdr.detectChanges();
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