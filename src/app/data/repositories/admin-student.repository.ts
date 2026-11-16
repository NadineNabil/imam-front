import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ApiResponse } from 'src/app/domain/entities/api-response.entity';
import { PagedResult } from 'src/app/domain/entities/PagedResult.entity';
import { SharedPagination } from 'src/app/domain/entities/shared-pagination.entity';
import { Student } from 'src/app/domain/entities/student.entity';
import { IAdminStudentRepository } from 'src/app/domain/repository-contracts/admin-student-repository.contract';
import { AdminStudentService } from '../api/admin-student-api.service';
import { AdminStudentMapper } from '../mappers/admin-student.mapper';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminStudentRepositoryImpl implements IAdminStudentRepository {
  constructor(private readonly apiService: AdminStudentService, ) {}
  updateCourseStatus(studentId: number, courseId: number, status: string): Observable<ApiResponse> {
    return this.apiService.updateCourseStatus(studentId, courseId, status);
  }

  
  //without pagination

  getStudents(exclude_group_id: number,search:string): Observable<any> {


  
      return this.apiService.getStudents(exclude_group_id,search);
  }

private students: Student[] = [
  new Student(
    59,
    'Noah',
    'Admin',
    'noah.admin@example.com',
    '20',
    '+201234567890',
    'assets/profile.png',
    new Date('2024-01-01'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-01-25'),
        studentCourseStatus:'Active'
      },
      {
        course: {
          id: 2,
          name: 'React Basics',
          collectionId: 'col-2',
          description: 'Learn React from scratch',
          image: 'assets/react.png',
        },
        enrolledAt: new Date('2025-02-10'),
        studentCourseStatus:'Revoked'
      } ,{
        course: {
          id: 2,
          name: 'React Basics',
          collectionId: 'col-2',
          description: 'Learn React from scratch',
          image: 'assets/react.png',
        },
        enrolledAt: new Date('2025-02-10'),
        studentCourseStatus:'Revoked'
      }
    ],

    92,
    12,
    4,
    [],
    'Active',
    90,
    '25-1-2026'
  ),

  new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Pending',
    12,
    '25-1-2026'
  ),
    new Student(
    2,
    'Ava',
    'Student',
    'ava.student@example.com',
    '20',
    '+201098765432',
    'assets/profile.png',
    new Date('2024-02-12'),
    new Date(),
    'en',

    [
      {
        course: {
          id: 1,
          name: 'Angular Basics',
          collectionId: 'col-1',
          description: 'Learn Angular from scratch',
          image: 'assets/angular.png'
        },
        enrolledAt: new Date('2025-03-01')
      }
    ],

    88,
    9,
    2,
    [],
    'Active',
    12,
    '25-1-2026'
  )
];

  getAllStudents(pagination: SharedPagination): Observable<PagedResult<Student>> {
  
  /*  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const items = this.students.slice(
    startIndex,
    startIndex + pagination.pageSize
  );

  const result: PagedResult<Student> = {
    items,
    totalItems: this.students.length
  };
  

  return of(result);
  */

  let params = new HttpParams()
    .set('page_no', pagination.page)
    .set('page_size', pagination.pageSize);
    
    if (pagination.status) {
      params = params.set('status', pagination.status.toLocaleLowerCase());
    }

    if (pagination.search) {
      params = params.set('search', pagination.search);
    }
    

    return this.apiService.getAllStudents(params).pipe(
      map(apiResponse => ({
        items: AdminStudentMapper.fromAdminStudentListResponseDto(apiResponse.items),
        totalItems: apiResponse.total_count
      }))
    );


  }

/*   getAllExams(pagination: SharedPagination): Observable<PagedResult<Student>> {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const items = this.students.slice(startIndex, startIndex + pagination.pageSize);
    const totalItems = this.students.length;
    const totalPages = Math.ceil(totalItems / pagination.pageSize);

    const result: PagedResult<Student> = {
      items,
      totalItems
    };

    return of(result);
  } */

  getStudentById(studentId: number): Observable<Student> {
    return this.apiService.getStudentById(studentId).pipe(
      map(dto => AdminStudentMapper.fromAdminStudentProfileResponseDto(dto))
    );
  }

  updateStudent(student: Student): Observable<ApiResponse> {
    const index = this.students.findIndex((item) => item.id === student.id);
    if (index !== -1) {
      this.students[index] = student;
    }
    return of({ success: true, message: 'Student updated successfully' });
  }

  deleteStudent(studentId: number): Observable<ApiResponse> {
    this.students = this.students.filter((item) => item.id !== studentId);
    return of({ success: true, message: 'Student deleted successfully' });
  }
}
