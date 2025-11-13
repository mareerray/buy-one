export interface UserUpdateDTO {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  password?: string; // only present if changing
}
