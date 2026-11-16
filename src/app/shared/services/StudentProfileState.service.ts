import { Injectable, signal } from '@angular/core';
import { Student } from 'src/app/domain/entities/student.entity';

@Injectable({ providedIn: 'root' })
export class StudentProfileStateService {

  private studentSignal = signal<Student | null>(null);

  // read-only exposure
  student = this.studentSignal.asReadonly();

  setStudent(student: Student) {
    this.studentSignal.set(student);
            console.log(this.student(),"Updated student in store");

  }
  clear() {
    this.studentSignal.set(null);
  }
}