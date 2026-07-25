export interface TeacherDashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
}

export interface TeacherCourse {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  instructor_name: string;
  category_name: string;
  level: string;
  thumbnail_url: string;
  price: number;
  rating: number;
  total_hours: string;
  student_count: number;
  status: 'Published' | 'Draft';
}

export interface TeacherAnalyticsData {
  financialSummary: {
    totalRevenue: number;
    revenueGrowthPercent: number;
    last30DaysRevenue: number;
    last30DaysGrowthPercent: number;
    nextPayout: number;
    payoutDate: string;
    payoutStatus: string;
  };
  topRegions: {
    country: string;
    percentage: number;
    color: string;
  }[];
  dailySalesChart: {
    labels: string[];
    data: number[];
  };
  coursePerformance: {
    id: string;
    name: string;
    icon: string;
    enrollments: number;
    revenue: number;
    conversionRate: string;
    refundRate: string;
    status: string;
  }[];
}

export interface TeacherStudent {
  id: string;
  name: string;
  email: string;
  photo_url?: string | null;
  course_title: string;
  enrolled_at: string;
  progress_percentage: number;
}

export interface TeacherPayment {
  id: string;
  date: string;
  amount: number;
  status: string;
  method: string;
}
