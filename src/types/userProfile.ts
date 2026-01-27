export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string; // matches auth.users.id
  email: string;
  fullName: string;
  company: string | null;
  phone: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserProfileUpdate = Partial<Pick<UserProfile, 'fullName' | 'company' | 'phone'>>;
