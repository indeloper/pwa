export interface UserResponse {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}
