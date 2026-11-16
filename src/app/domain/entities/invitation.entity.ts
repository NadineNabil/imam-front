export interface Invitation {
  id: number;
  email: string;
  user_status: 'Pending' | 'Active' | 'Expired';
  invitation_status: 'Sent' | 'Activated' | 'Expired';
  sent_at: string; // ISO date string
  course_id: number;
  course_name?: string;
}


/*
 "full_name": "string",
  "email": "string",
  "course_id": 0,
  "course_name": "string",
  "student_id": 0,
  "student_user_id": 0,
  "invitation_id": 0,
  "enrollment_id": 0,
  "message": "string",
  "email_sent": false,
  "created_at": "2026-05-13T06:26:31.895Z"
  */