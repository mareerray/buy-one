import { UserResponse } from './userResponse.model';

export interface LoginResponse {
  message: string;
  token: string;
  user: UserResponse;
}
