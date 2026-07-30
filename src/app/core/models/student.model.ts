export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  instructor_name: string;
  category_name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail_url: string;
  price: number;
  rating: number;
  total_hours: string;
  modules?: CourseModule[];
  isEnrolled?: boolean;
  progress?: number;
}

export interface CourseModule {
  id: string;
  title: string;
  order_index: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration_minutes: number;
  video_url?: string;
}

export interface StudentDashboardData {
  weeklyGoal: {
    completedHours: number;
    targetHours: number;
  };
  streakDays: number;
  weeklyProgressPercent: number;
  inProgressCourse: {
    course_title: string;
    subtitle: string;
    progress_percentage: number;
    completed_modules: number;
    total_modules: number;
  };
  activityChart: {
    labels: string[];
    data: number[];
  };
  upcomingAssignments: {
    id: string;
    title: string;
    due_date: string;
    course_title: string;
  }[];
  recentQuizzes: {
    id: string;
    title: string;
    score_percentage: number;
  }[];
  recommendedCourses: Course[];
}

export interface Enrollment {
  enrollment_id: string;
  course_id: string;
  title: string;
  subtitle: string;
  instructor_name: string;
  thumbnail_url: string;
  category_name: string;
  level: string;
  total_hours: string;
  progress_percentage: number;
  completed_modules: number;
  total_modules: number;
  status: 'active' | 'completed';
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  course_title: string;
  submission_id?: string;
  submission_status: 'pending' | 'submitted' | 'graded';
  grade?: string;
  score?: number;
  file_url?: string;
  reupload_status?: 'none' | 'requested' | 'approved' | 'rejected';
}

export interface Quiz {
  id: string;
  title: string;
  total_questions: number;
  course_title: string;
  score_percentage?: number;
}

export interface Certificate {
  id: string;
  certificate_code: string;
  issued_at: string;
  course_title: string;
  instructor_name: string;
  thumbnail_url: string;
}
