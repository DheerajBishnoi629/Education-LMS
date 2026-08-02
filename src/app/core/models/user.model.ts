export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  photoUrl: string | null;
  role: UserRole;
  status?: 'active' | 'pending_approval' | 'rejected' | 'suspended';
}
