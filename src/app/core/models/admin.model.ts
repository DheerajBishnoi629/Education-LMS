export interface AdminDashboardData {
  stats: {
    totalRevenue: number;
    revenueGrowthPercent: number;
    totalUsers: number;
    userGrowthPercent: number;
    activeCourses: number;
    courseGrowthPercent: number;
    serverHealth: string;
    serverHealthStatus: string;
  };
  userChart: {
    labels: string[];
    mau: number[];
    dau: number[];
  };
  revenueChart: {
    labels: string[];
    percentages: number[];
  };
  auditLogs: {
    id: string;
    time: string;
    event: string;
    entity: string;
    status: 'Success' | 'Processing' | 'Warning';
  }[];
  pendingTickets: {
    id: string;
    title: string;
    priority: string;
    time: string;
    reportedBy: string;
  }[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  photo_url?: string | null;
  status: string;
  created_at: string;
}

export interface AdminSettings {
  siteName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  enableSelfRegistration: boolean;
  requireEmailVerification: boolean;
  maxVideoUploadMb: number;
  paymentGateway: string;
}

export interface ModerationCourse {
  id: string;
  title: string;
  instructor_name: string;
  category: string;
  submitted_at: string;
  modules_count: number;
  status: string;
}

export interface AdminFinancials {
  summary: {
    grossVolume: number;
    netRevenue: number;
    teacherPayouts: number;
    activeSubscriptions: number;
  };
  recentTransactions: {
    id: string;
    type: string;
    user: string;
    amount: number;
    date: string;
    status: string;
  }[];
}

export interface SupportTicketItem {
  id: string;
  title: string;
  reportedBy: string;
  priority: string;
  status: string;
  created: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  ip: string;
  status: 'Success' | 'Processing' | 'Warning';
}
