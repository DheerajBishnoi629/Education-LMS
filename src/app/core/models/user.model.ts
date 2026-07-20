export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: number;
  firebaseUid: string;
  email: string;
  name: string;
  photoUrl: string | null;
  role: UserRole;
}
