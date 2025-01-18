export type Role = 'admin' | 'teacher';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  subjects?: string[];
  classes?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}