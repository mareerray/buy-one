export type Role = 'CLIENT' | 'SELLER';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

// export interface ResponseUser {
//   id: string;
//   name: string;
//   email: string;
//   role: 'client' | 'seller';
//   avatar?: string;
// }
