export type UserStatus = 'active' | 'inactive';
export type UserRole = 'employee' | 'admin';

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'employee', label: 'Employee' },
  { value: 'admin', label: 'Admin' },
];

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string | null;
  status: UserStatus;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phoneNumber?: string;
  status?: UserStatus;
  role?: UserRole;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  phoneNumber?: string;
  status?: UserStatus;
  role?: UserRole;
}

export interface ApiErrorBody {
  message: string;
  errors?: Record<string, string[]>;
}

export interface DeleteUserResponse {
  message: string;
}
