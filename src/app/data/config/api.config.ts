import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


/**
 * API Configuration
 * 
 * Centralized API configuration service.
 * All API-related settings and endpoints should be managed here.
 */
@Injectable({ providedIn: 'root' })
export class ApiConfig {
  /**
   * Base URL for the API
   * Configure in environment files
   */
  readonly baseUrl: string;
  readonly fileUrl: string;
  readonly imageUrl: string;
  readonly aiUrl: string;
  readonly aiImageUrl: string;
  /**
   * API timeout in milliseconds
   */
  readonly timeout: number;

  /**
   * Centralized API Endpoints
   * All API URLs are defined here for easy maintenance
   */
  readonly endpoints = {
    // Authentication endpoints
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refreshToken: '/auth/refresh',
      passwordReset: '/auth/password-reset',
      me: '/auth/me',
      sendOtp: '/auth/send-otp',
      verifyOtp: '/auth/verify-otp',
      resendOtp: '/auth/resend-otp',
      updatePassword: '/auth/update-password',
      setPassword: '/auth/set-password',
      changePassword:'/auth/change-password'
    },
    
    // User endpoints
    users: {
      base: '/users',
      byId: (id: number) => `/users/${id}`,
      allUsers:'/auth/users',
      createUser:'/teacher',
      updateUserStatus:'/auth/set_active'
    },
    
    // course endpoints  
    courses: {
      base: '/course',
      create: '/course/create_course',
      GetAllCourses: '/course/get_all_courses',
      GetCoursesByCategoryId:'/course/allbycategoryid/',
      details: (id: number) => `/course/get_course/${id}`,
      update: '/course/update_course',
      delete: (id: number) => `/course/delete_course/${id}`,
      list: '/course/list',
      inviteGroup: '/invitation/invite_group',
      getCoursesWithLastExam: (courseId: number) => `/course/get_courses_with_last_exam/${courseId}`

    },
    invitations:
    {
      addInvitation: `/invitation/invite_student`,
      allInvitations: `/invitation/all`,
      cancelInvitation:`/invitation/cancel/`,
      resendInvitation:`/invitation/resend/`
    }
    // learning unit endpoints
    ,learningUnits: {
      base: '/learningUnit',
      create: '/learning_unit/add_learning_unit',
      getAllLearningUnits: (course_id: number) => `/learning_unit/get_learning_units_by_course/${course_id}`,
      details: (id: number) => `/learning_unit/get_learning_unit_by_id/${id}`,
      editLearningUnit: '/learning_unit/update_learning_unit',
      addKnowledgeSource: '/knowledgeSource/create_knowledge_source_v2',
      deleteKnowledgeSource: (id: number) => `/knowledgeSource/knowledge-source_v2/${id}`,
      knowledgeSourceFile:(path:String)=>`/knowledgeSource/knowledge-source-file/${path}`
    }
        //lessons endpoints
    ,lessons: {
      addKnowledgeSource: '/knowledgeSource/create_knowledge_source_v2',
      lessonDetails: (lessonId: string) => `/lesson/get_lesson_by_id/${lessonId}`,
      deleteKnowledgeSource: (id: number) => `/knowledgeSource/knowledge-source_v2/${id}`,
      editLesson:`/lesson/update_lesson`,
      updateKnowledgeSource:  `/knowledgeSource/update_knowledge_source_question_source`

    }
    ,categories: {
      getCategoriesTree: '/category/getall',
      all: `/category/getall`,
      createCategory: '/category',
      updateCategory: '/category/',
      getCategoryById: (id: number) => `/category/${id}`,
      deleteCategory: (id: number) => `/category/${id}`
    },
     subCategories: {
      getsubCategories: '/category/allsubcategoriesbycategoryid/',
    },
    learningunits:{
      getLearningUnit:'/learning_unit/get_learning_units/'
    },
     objective: {
    getObjectives: '/objectives/'  // <--- add this
  },
  exams:{
    createExam:'/exams/',
     base: '/exams/',
     retryExam: (id: number) => `/exams/${id}/retry`,
     setSettings: (id: number) => `/exams/${id}/options`,
     updateQuestions: (id: number) => `/exams/${id}`,
      updateSchedule: (id: number) => `/exams/${id}/scheduled-date`,
     duplicate:(exam_id: number) =>`/exams/${exam_id}/duplicate`,
     activate:(exam_id:number)=>`/exams/${exam_id}/activate`
  },
  groups: {
    getAllGroups: '/groups/',
    getGroupById: (id: number) => `/groups/${id}`,
    create: '/groups/',
    update: '/groups/',
    delete: (id: number) => `/groups/${id}`,
    Add_Students_To_Group: (group_id: number) => `/groups/${group_id}/students`,
    Remove_Student_From_Group: (group_id: number, student_id: number) => `/groups/${group_id}/students/${student_id}`,
    Get_Students_List: '/student/list',
    Get_Courses_List: '/course/list',
    Invite_Group: '/invitation/invite_group'
  },
  student:{
    getStudent: (id: number) => `/student/get/${id}`,
    update:'/student/update-profile',
    update_image:'/student/image',
    summary: '/student/summary',
    courses: '/student/courses',
    examsToSolve: '/student/exams-to-solve',
    completedExams: '/student/completed-exams',
    coursesDetails: '/student/courses-details',
    examReport: (examId: number) => `/student/exams/${examId}/report`,
    trainingReport: (trainingId: number) => `/student/trainings/${trainingId}/report`
  },
  adminStudent: {
    getStudentById: (id: number) => `/student/profile/${id}`,
    getAll: '/student/all',
    getStudentsOfGroups: (exclude_group_id: number, search: string) => `/student/list?exclude_group_id=${exclude_group_id}&search=${search}`,
    updateCourseStatus: (studentId: number, courseId: number) => `/student/${studentId}/courses/${courseId}`
  },
  adminDashboard: {
    kpis: '/admin/kpis',
    examActivity: (period: string) => `/admin/exam_activity/${period}`,
    enrollmentActivity: (period: string) => `/admin/enrollment_activity/${period}`,
    topPerformingCourses: '/admin/top_performing_courses'
  },
  exam:{
  generateExam:'/generate_exam',
  getExam:(id:number)=>`/student/exams/${id}`,
  getExamReport:(id: number | string)=>`/student/exams/${id}/report`,

  audioToText:'/audioToText',
  streamtts:'/stream-tts',
  correct_answer:'/correct_answer',
  getAssistantId:'/Subjects/GetAIAssistantProperties',
  enroll:'/enroll',
  verify:'/verify',
  setStudentAnswers:(id:number)=>`/student/exams/${id}`
},
chat:{
  getHistory:'/get_history',
  stream:'/chat/stream',
  getAssistantId:'/Subjects/GetAIAssistantProperties',
  streamTTS:'/stream-tts',
  audioToText:'/audioToText',
  
},
logs:{
  getLogs:'/audit/logs'
}
}
  ;

  constructor() {
    // In production, this should come from environment
    this.baseUrl = (environment as any).apiUrl || '/api/v1';
    this.timeout = (environment as any).apiTimeout || 30000;
    this.fileUrl =(environment as any).fileUrl; 
    this.imageUrl =(environment as any).imageUrl; 
    this.aiUrl =(environment as any).aiUrl; 
    this.aiImageUrl =(environment as any).aiImageUrl; 

  }

  /**
   * Helper method to get full URL for an endpoint
   * @param endpoint - Relative endpoint path
   * @returns Full URL with base URL
   */
  getUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
    getAiUrl(endpoint: string): string {
    return `${this.aiUrl}${endpoint}`;
  }
  getAiImageUrl(endpoint: string): string {
    return `${this.aiImageUrl}${endpoint}`;
  }
    getUsersUrl() {
    return this.getUrl(this.endpoints.users.base);
  }
}

