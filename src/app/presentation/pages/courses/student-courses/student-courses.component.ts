import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StudentService } from 'src/app/data/api/student-api.service';
import { StudentCourseDetailsResponseDto } from 'src/app/data/dto/response/student-dashboard.response.dto';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-student-courses',
  templateUrl: './student-courses.component.html',
  styleUrls: ['./student-courses.component.scss'],
  standalone: false
})
export class StudentCoursesComponent implements OnInit {
  isLoading = true;
  isGridView = true;
  searchQuery = '';

  allCourses: StudentCourseDetailsResponseDto[] = [];
  filteredCourses: StudentCourseDetailsResponseDto[] = [];

  // Breadcrumb items
  breadCrumbItems: Array<{}> = [];

  constructor(
    private readonly router: Router,
    public readonly translate: TranslateService,
    private readonly studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'MENUITEMS.MYCOURSES.TEXT' },
      { label: 'STUDENT_COURSES.TITLE', active: true }
    ];

    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.studentService.getStudentCoursesDetails().subscribe({
      next: (courses) => {
        this.allCourses = courses.map(course => {
          let imageUrl = null;
          if (course.course_image) {
            // Clean leading slashes (e.g. "////uploads/..." -> "uploads/...")
            const cleanPath = course.course_image.replace(/^\/+/, '');
            imageUrl = `${environment.imageUrl}/${cleanPath}`;
          }
          return {
            ...course,
            course_image: imageUrl
          };
        });
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load student courses details:', err);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredCourses = query
      ? this.allCourses.filter(c => c.course_name.toLowerCase().includes(query))
      : [...this.allCourses];
  }

  setViewMode(isGrid: boolean): void {
    this.isGridView = isGrid;
  }

  viewCourseDetails(course: StudentCourseDetailsResponseDto): void {
    this.router.navigate([`/courses/my-courses/${course.course_id}`]);
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.onerror = null;
      imgElement.src = 'assets/images/default-subject.jpg';
    }
  }
}
