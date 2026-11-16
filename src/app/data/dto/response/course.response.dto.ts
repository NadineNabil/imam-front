

export interface CourseResponseDto {
  id: number,
  name: string,
  collection_id?:string,
  description?: string,
  image?: string,
  category_id?: number,
  parent_category_id?: number,
  learning_units?: any[]
}
export interface CoursesApiResponseDto {
  courses: CourseResponseDto[];
  total_count: number;
}
export interface CourseDto {
  id: number;
  name: string;
  description: string;
  image: string;
  category_id: number;
  parent_category_id: number;
  
}
export interface StudentCourseResponseDto {
  id: number;
  name: string;
}
export interface AdminStudentCourseResponseDto {
  course_id: number;
  course_name: string;
  enrolled_date: Date | string;
  status: string;
}
export interface AllCoursesResponseDto {
  id: number;
  name: string;
}