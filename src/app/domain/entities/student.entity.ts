import { studentStatus } from "../enums/student-status.enum";
import { Enrollment } from "./Enrollment.entity";
import { Exam } from "./exam.entity";

export class Student {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public countryCode?: string,    
    public phoneNumber?: string,
    public profilePictureUrl?: string,
    public registrationDate?: Date|string,
    public lastLogin?: Date|string,
    public preferredLanguage?: 'en' | 'ar'|'',
    public enrollments?: Enrollment[],
    public averageScore?: number,
    public totalExams?: number,
    public totalCertificates?: number,
    public exams?:Exam[],
    public status?:studentStatus|string,
    public enrollmentsCount?: number,
    public activationDate?:Date|string



  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  
}