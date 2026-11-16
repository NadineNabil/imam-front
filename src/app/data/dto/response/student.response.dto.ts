import { AdminStudentCourseResponseDto, CourseResponseDto } from "./course.response.dto";


export interface StudentResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
   countryCode?: string,
  phoneNumber?: string;
  profilePictureUrl?: string;
  registrationDate?: Date | string;
  lastLogin?: Date | string;
  preferredLanguage?: 'en' | 'ar';
  averageScore?: number;
  totalExams?: number;
  totalCertificates?: number;
  enrollments?: StudentEnrollmentResponseDto[];
}
export interface StudentEnrollmentResponseDto {
  course: CourseResponseDto;
  enrolledAt: Date | string;
}
export interface CurrentStudentDto {
  id: number;
  user_id: number;
  image: string;
  status: 'pending' | 'active' | 'inactive';
  last_login_date: string;
  registration_date: string;
  ip_address: string;
  user: User;
  created_at: string;
  updated_at: string;
  course_count: number;
}
export interface User {
  id: number;
  organization_id: number;
  name: string;
  email: string;
  phone_number: string;
  phone_country_code: string;
  preferred_language: 'en' | 'ar';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export interface AdminStudentProfileResponseDto {
  student_id: number;
  student_id_from_student: number;
  full_name: string;
  email: string;
  status: string;
  activated_date: string;
  enrolled_courses: AdminStudentCourseResponseDto[];
  total_courses: number;
}
export interface AdminStudentListUserResponseDto {
  id: number;
  organization_id: number;
  name: string;
  email: string;
  phone_number: string | null;
  phone_country_code: string | null;
  preferred_language: 'en' | 'ar' | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export interface AdminStudentListResponseDto {
  id: number;
  user_id: number;
  image: string | null;
  status: 'pending' | 'active' | 'inactive';
  last_login_date: string | null;
  registration_date: string;
  ip_address: string | null;
  user: AdminStudentListUserResponseDto;
  created_at: string;
  updated_at: string;
  course_count: number;
}
